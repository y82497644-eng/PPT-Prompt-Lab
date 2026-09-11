import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import type { Project } from "../domain/project";
import { LocalFileStorage } from "../lib/files/local-file-storage";
import { LocalProjectRepository } from "../lib/storage/local-project-repository";

test("project state persists through repository", async () => {
  const repository = new LocalProjectRepository(); const id = `test-${crypto.randomUUID()}`; const now = new Date().toISOString();
  const project: Project = { id, title: "测试项目", createdAt: now, updatedAt: now, brief: { topic: "测试项目", deckType: "主题演示", audience: "普通听众", purpose: "测试", pageRange: "8", needsRecentResearch: false, uploadedFileIds: [] }, files: [], sources: [], claims: [], conflicts: [], researchMode: "mock" };
  await repository.save(project); assert.equal((await repository.get(id))?.title, "测试项目");
  await rm(path.join(process.cwd(), "data", "local", `project-${id}.json`));
});

test("upload stays inside project upload directory", async () => {
  const storage = new LocalFileStorage(); const uploaded = await storage.save(new File(["hello"], "../unsafe.txt", { type: "text/plain" }));
  const root = path.join(process.cwd(), "data", "uploads") + path.sep; assert.ok(uploaded.path.startsWith(root)); assert.ok(!uploaded.storedName.includes("unsafe"));
  await rm(uploaded.path);
});
