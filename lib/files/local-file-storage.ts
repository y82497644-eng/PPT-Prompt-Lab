import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { UploadedFile } from "@/domain/project";
import { assertLocalStorageAllowed, type RuntimeEnvironment } from "@/lib/config/runtime";
import type { FileStorage } from "./file-storage";

const allowed: Record<string, string[]> = {
  ".pdf": ["application/pdf"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/octet-stream"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/octet-stream"],
  ".txt": ["text/plain", "application/octet-stream"],
  ".md": ["text/markdown", "text/plain", "application/octet-stream"],
};
const maxBytes = 20 * 1024 * 1024;
const uploadRoot = path.join(process.cwd(), "data", "uploads");

export class LocalFileStorage implements FileStorage {
  async save(file: File): Promise<UploadedFile> {
    const extension = path.extname(file.name).toLowerCase();
    if (!allowed[extension] || !allowed[extension].includes(file.type || "application/octet-stream")) throw new Error(`不支持的文件格式：${extension || "未知"}`);
    if (file.size > maxBytes) throw new Error("单个文件不能超过 20MB");
    const id = crypto.randomUUID();
    const storedName = `${id}${extension}`;
    const diskPath = path.join(uploadRoot, storedName);
    if (!diskPath.startsWith(uploadRoot + path.sep)) throw new Error("Invalid upload path");
    const bytes = Buffer.from(await file.arrayBuffer());
    await mkdir(uploadRoot, { recursive: true });
    await writeFile(diskPath, bytes);
    return { id, originalName: path.basename(file.name), storedName, extension, mimeType: file.type || "application/octet-stream", size: file.size, path: diskPath, parseStatus: "PENDING" };
  }
}

export function getFileStorage(environment: RuntimeEnvironment = process.env): FileStorage {
  assertLocalStorageAllowed(environment);
  return new LocalFileStorage();
}

export const fileStorage = getFileStorage();
