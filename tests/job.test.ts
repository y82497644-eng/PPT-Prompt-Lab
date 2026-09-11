import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import type { JobState } from "../domain/job-state";
import type { Project } from "../domain/project";
import { runResearchJob } from "../lib/jobs/job-runner";
import { projectRepository } from "../lib/storage/local-project-repository";

test("job state follows real parsing and storyboard steps", async () => {
  const id = `job-project-${crypto.randomUUID()}`; const jobId = `job-${crypto.randomUUID()}`; const now = new Date().toISOString();
  const project: Project = { id, title: "校园光伏课程汇报", createdAt: now, updatedAt: now, brief: { topic: "校园光伏课程汇报", deckType: "课程报告", audience: "老师与同学", purpose: "解释项目", pageRange: "10", needsRecentResearch: true, uploadedFileIds: ["fixture-docx"] }, files: [{ id: "fixture-docx", originalName: "sample.docx", storedName: "sample.docx", extension: ".docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 1, path: path.join(process.cwd(), "tests", "fixtures", "sample.docx"), parseStatus: "PENDING" }], sources: [], claims: [], conflicts: [], researchMode: "mock" };
  const job: JobState = { id: jobId, projectId: id, status: "PROJECT_CREATED", completed: [], message: "已理解你的需求", updatedAt: now };
  await projectRepository.save(project); await projectRepository.saveJob(job); await runResearchJob(jobId, id);
  const savedJob = await projectRepository.getJob(jobId); const savedProject = await projectRepository.get(id);
  assert.equal(savedJob?.status, "STORYBOARD_READY"); assert.ok(savedJob?.completed.includes("FILE_PARSING")); assert.ok(savedJob?.completed.includes("SOURCE_VERIFYING"));
  assert.equal(savedProject?.files[0].parseStatus, "READY"); assert.ok(savedProject?.sources.some(source => source.sourceType === "FILE")); assert.ok(savedProject?.storyboard?.slides.some(slide => slide.sourceRefs.some(sourceId => savedProject.sources.some(source => source.id === sourceId && source.sourceType === "FILE"))));
  await rm(path.join(process.cwd(), "data", "local", `project-${id}.json`)); await rm(path.join(process.cwd(), "data", "local", `job-${jobId}.json`));
});
