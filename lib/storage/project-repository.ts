import type { JobState } from "@/domain/job-state";
import type { Project } from "@/domain/project";

export interface ProjectRepository {
  create(project: Project): Promise<Project>;
  get(id: string): Promise<Project | null>;
  save(project: Project): Promise<Project>;
  saveJob(job: JobState): Promise<JobState>;
  getJob(id: string): Promise<JobState | null>;
}
