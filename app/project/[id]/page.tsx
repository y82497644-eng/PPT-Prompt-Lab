import { ProjectWorkspace } from "@/components/storyboard/project-workspace";
import { projectRepository } from "@/lib/storage/local-project-repository";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const project = await projectRepository.get(id); if (!project) notFound(); return <ProjectWorkspace initialProject={project} />;
}
