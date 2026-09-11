import { NextResponse } from "next/server";
import { fileStorage } from "@/lib/files/local-file-storage";
import { interpretBrief } from "@/lib/projects/brief-interpreter";
import { projectRepository } from "@/lib/storage/local-project-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const topic = String(form.get("topic") || "").trim();
    const incomingFiles = form.getAll("files").filter(value => value instanceof File) as File[];
    if (!topic && !incomingFiles.length) return NextResponse.json({ error: "请输入主题或上传资料" }, { status: 400 });
    const files = await Promise.all(incomingFiles.map(file => fileStorage.save(file)));
    const fallbackTopic = files[0]?.originalName.replace(/\.[^.]+$/, "") || "新的演示文稿";
    const brief = interpretBrief(topic || fallbackTopic, files.map(file => file.id));
    const now = new Date().toISOString();
    const project = await projectRepository.create({ id: crypto.randomUUID(), title: brief.topic, createdAt: now, updatedAt: now, brief, files, sources: [], claims: [], conflicts: [], researchMode: "mock" });
    return NextResponse.json(project, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "创建失败" }, { status: 400 }); }
}
