import type { JobState, JobStatus } from "@/domain/job-state";
import { assertLocalJobRunnerAllowed } from "@/lib/config/runtime";
import { LocalFileReader } from "@/lib/files/file-reader";
import { buildFileEvidence } from "@/lib/research/claim-builder";
import { reconcileEvidenceConflicts } from "@/lib/research/conflict-detector";
import { getResearchProvider } from "@/lib/research/provider-factory";
import { planResearch } from "@/lib/research/research-planner";
import { normalizeSources } from "@/lib/research/source-normalizer";
import { verifyClaims } from "@/lib/research/source-verifier";
import { buildStoryboard } from "@/lib/storyboard/storyboard-builder";
import { projectRepository } from "@/lib/storage/local-project-repository";

async function transition(job: JobState, status: JobStatus, message: string) {
  if (!job.completed.includes(job.status) && !["FAILED", "CANCELLED"].includes(job.status)) job.completed.push(job.status);
  job.status = status; job.message = message; job.updatedAt = new Date().toISOString(); await projectRepository.saveJob(job);
}

export async function runResearchJob(jobId: string, projectId: string) {
  assertLocalJobRunnerAllowed();
  const job = await projectRepository.getJob(jobId); const project = await projectRepository.get(projectId);
  if (!job || !project) return;
  try {
    await transition(job, "UPLOAD_VALIDATING", "正在检查你提供的资料");
    await transition(job, "FILE_PARSING", "正在读取资料");
    const parsedBatch = await new LocalFileReader().parse(project.files);
    project.files = parsedBatch.files;
    await projectRepository.save(project);
    const fatalParse = project.files.find(file => file.parseStatus === "FAILED" && file.parseError !== "NO_EXTRACTABLE_TEXT");
    if (fatalParse) throw new Error(fatalParse.parseError || "FILE_PARSE_FAILED");
    const fileEvidence = buildFileEvidence(parsedBatch.documents);
    const fileContext = parsedBatch.documents.map(document => `${document.fileName}: ${document.text.slice(0, 12000)}`);
    await transition(job, "RESEARCH_PLANNING", "正在确定需要核实的问题");
    const plan = planResearch(project.brief);
    await transition(job, "WEB_SEARCHING", "正在查找可靠资料");
    const result = await getResearchProvider().research(project.brief, plan, fileContext);
    await transition(job, "SOURCE_VERIFYING", "正在核对来源与数字");
    project.sources = normalizeSources([...fileEvidence.sources, ...result.sources]);
    const verifiedClaims = verifyClaims([...fileEvidence.claims, ...result.claims], project.sources);
    const reconciled = reconcileEvidenceConflicts(verifiedClaims);
    project.claims = reconciled.claims;
    project.conflicts = reconciled.conflicts;
    project.researchMode = result.mode;
    await transition(job, "STORYBOARD_DRAFTING", "正在整理故事线");
    const previousStrategy = project.storyboard?.strategy;
    project.storyboard = buildStoryboard(project.brief, project.claims, project.sources, previousStrategy);
    project.updatedAt = new Date().toISOString(); await projectRepository.save(project);
    await transition(job, "STORYBOARD_READY", "故事线已经准备好");
  } catch (error) {
    job.error = error instanceof Error ? error.message : "Unknown error";
    await transition(job, "FAILED", "处理没有完成，请重试");
  }
}
