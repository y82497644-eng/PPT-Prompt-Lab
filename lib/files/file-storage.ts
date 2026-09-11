import type { UploadedFile } from "@/domain/project";

export interface FileStorage {
  save(file: File): Promise<UploadedFile>;
}
