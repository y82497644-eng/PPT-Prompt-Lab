import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { JobStateSchema, type JobState } from "@/domain/job-state";
import { ProjectSchema, type Project } from "@/domain/project";
import { assertLocalStorageAllowed, type RuntimeEnvironment } from "@/lib/config/runtime";
import type { ProjectRepository } from "./project-repository";

const dataRoot = path.join(process.cwd(), "data", "local");

async function readJson<T>(filePath: string, parse: (value: unknown) => T): Promise<T | null> {
  try { return parse(JSON.parse(await readFile(filePath, "utf8"))); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}

async function writeJson(filePath: string, value: unknown) {
  await mkdir(dataRoot, { recursive: true });
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

export class LocalProjectRepository implements ProjectRepository {
  create(project: Project) { return this.save(project); }
  get(id: string) { return readJson(path.join(dataRoot, `project-${id}.json`), value => ProjectSchema.parse(value)); }
  async save(project: Project) { const parsed = ProjectSchema.parse(project); await writeJson(path.join(dataRoot, `project-${project.id}.json`), parsed); return parsed; }
  async saveJob(job: JobState) { const parsed = JobStateSchema.parse(job); await writeJson(path.join(dataRoot, `job-${job.id}.json`), parsed); return parsed; }
  getJob(id: string) { return readJson(path.join(dataRoot, `job-${id}.json`), value => JobStateSchema.parse(value)); }
}

export function getProjectRepository(environment: RuntimeEnvironment = process.env): ProjectRepository {
  assertLocalStorageAllowed(environment);
  return new LocalProjectRepository();
}

export const projectRepository = getProjectRepository();
