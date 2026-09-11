import { readFile } from "node:fs/promises";
import type { UploadedFile } from "@/domain/project";
import { DocumentParseError, type DocumentParser } from "./document-parser";
import { decodeXml, extractXmlText, unzipOfficeDocument } from "./ooxml-utils";

export class DocxDocumentParser implements DocumentParser {
  canHandle(file: UploadedFile) { return file.extension === ".docx"; }
  async parse(file: UploadedFile) {
    try {
      const archive = unzipOfficeDocument(new Uint8Array(await readFile(file.path)));
      const documentXml = archive["word/document.xml"];
      if (!documentXml) throw new Error("word/document.xml missing");
      const xml = decodeXml(documentXml);
      const blocks = [...xml.matchAll(/<(w:p|w:tr)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)].map(match => extractXmlText(match[2], "w:t").join(" ").trim()).filter(Boolean);
      const sections = blocks.map((text, index) => ({ id: `${file.id}-section-${index + 1}`, section: `段落 ${index + 1}`, text }));
      const text = blocks.join("\n");
      if (!text) throw new Error("No text in DOCX");
      const core = archive["docProps/core.xml"] ? decodeXml(archive["docProps/core.xml"]) : "";
      const title = extractXmlText(core, "dc:title")[0] || blocks[0]?.slice(0, 100);
      return { fileId: file.id, fileName: file.originalName, mimeType: file.mimeType, title, text, sections, warnings: [], metadata: { format: "docx", blockCount: blocks.length } };
    } catch (error) { throw new DocumentParseError("DOCX_PARSE_FAILED", error instanceof Error ? error.message : "DOCX parse failed"); }
  }
}
