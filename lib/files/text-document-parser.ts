import { readFile } from "node:fs/promises";
import type { UploadedFile } from "@/domain/project";
import type { DocumentParser } from "./document-parser";

export class TextDocumentParser implements DocumentParser {
  canHandle(file: UploadedFile) { return file.extension === ".txt" || file.extension === ".md"; }
  async parse(file: UploadedFile) {
    const text = (await readFile(file.path, "utf8")).trim();
    const sections = text.split(/\n\s*\n/).map((value, index) => ({ id: `${file.id}-section-${index + 1}`, section: `段落 ${index + 1}`, text: value.trim() })).filter(section => section.text);
    return { fileId: file.id, fileName: file.originalName, mimeType: file.mimeType, title: sections[0]?.text.split("\n")[0], text, sections, warnings: [], metadata: { format: file.extension.slice(1), sectionCount: sections.length } };
  }
}
