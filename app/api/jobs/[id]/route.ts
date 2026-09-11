import { NextResponse } from "next/server";
import { projectRepository } from "@/lib/storage/local-project-repository";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const job = await projectRepository.getJob(id);
  return job ? NextResponse.json(job) : NextResponse.json({ error: "任务不存在" }, { status: 404 });
}
