import { NextResponse } from "next/server";
import { regenerateSlide } from "@/lib/storyboard/storyboard-builder";
import { projectRepository } from "@/lib/storage/local-project-repository";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const { slideId } = await request.json(); const project = await projectRepository.get(id);
  if (!project?.storyboard) return NextResponse.json({ error: "页面大纲不存在" }, { status: 404 });
  const index = project.storyboard.slides.findIndex(slide => slide.id === slideId);
  if (index < 0) return NextResponse.json({ error: "页面不存在" }, { status: 404 });
  project.storyboard.slides[index] = regenerateSlide(project.storyboard.slides[index], project.claims);
  project.updatedAt = new Date().toISOString(); await projectRepository.save(project);
  return NextResponse.json(project.storyboard.slides[index]);
}
