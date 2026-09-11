import { NextResponse } from "next/server";
import { ProjectSchema } from "@/domain/project";
import { projectRepository } from "@/lib/storage/local-project-repository";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const project = await projectRepository.get(id);
  return project ? NextResponse.json(project) : NextResponse.json({ error: "项目不存在" }, { status: 404 });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const current = await projectRepository.get(id);
  if (!current) return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  const body = await request.json();
  const project = ProjectSchema.parse({ ...current, ...body, id, updatedAt: new Date().toISOString() });
  return NextResponse.json(await projectRepository.save(project));
}
