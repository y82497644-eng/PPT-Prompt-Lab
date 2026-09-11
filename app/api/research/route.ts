import { NextResponse } from "next/server";
import type { JobState } from "@/domain/job-state";
import { runResearchJob } from "@/lib/jobs/job-runner";
import { getResearchProvider } from "@/lib/research/provider-factory";
import { projectRepository } from "@/lib/storage/local-project-repository";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    getResearchProvider();
    const { projectId } = await request.json(); const project = await projectRepository.get(projectId);
    if (!project) return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    const job: JobState = { id: crypto.randomUUID(), projectId, status: "PROJECT_CREATED", completed: [], message: "已理解你的需求", updatedAt: new Date().toISOString() };
    await projectRepository.saveJob(job); void runResearchJob(job.id, projectId);
    return NextResponse.json(job, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "研究服务暂不可用";
    return NextResponse.json({ error: message }, { status: message === "RESEARCH_PROVIDER_NOT_CONFIGURED" ? 503 : 400 });
  }
}
