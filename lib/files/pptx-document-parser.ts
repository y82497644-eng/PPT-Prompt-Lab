import { readFile } from "node:fs/promises";
import type { UploadedFile } from "@/domain/project";
import { DocumentParseError, type DocumentParser } from "./document-parser";
import { decodeXml, extractXmlText, unzipOfficeDocument } from "./ooxml-utils";

export class PptxDocumentParser implements DocumentParser {
  canHandle(file: UploadedFile) { return file.extension === ".pptx"; }
  async parse(file: UploadedFile) {
    try {
      const archive = unzipOfficeDocument(new Uint8Array(await readFile(file.path)));
      const slideNames = Object.keys(archive).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort((a, b) => slideNumber(a) - slideNumber(b));
      const sections = slideNames.map(name => {
        const number = slideNumber(name); const texts = extractXmlText(decodeXml(archive[name]), "a:t");
        const notesName = `ppt/notesSlides/notesSlide${number}.xml`; const notes = archive[notesName] ? extractXmlText(decodeXml(archive[notesName]), "a:t").filter(value => !/^\d+$/.test(value)) : [];
        const title = texts[0]; const body = texts.join("\n"); const noteText = notes.length ? `\n演讲者备注：${notes.join(" ")}` : "";
        return { id: `${file.id}-slide-${number}`, title, section: `第 ${number} 页`, pageOrSlide: number, text: `${body}${noteText}`.trim() };
      }).filter(section => section.text);
      const text = sections.map(section => `第 ${section.pageOrSlide} 页\n${section.text}`).join("\n\n");
      if (!text) throw new Error("No text in PPTX");
      return { fileId: file.id, fileName: file.originalName, mimeType: file.mimeType, title: sections[0]?.title, text, sections, warnings: [], metadata: { format: "pptx", slideCount: slideNames.length } };
    } catch (error) { throw new DocumentParseError("PPTX_PARSE_FAILED", error instanceof Error ? error.message : "PPTX parse failed"); }
  }
}

function slideNumber(path: string) { return Number(path.match(/(\d+)\.xml$/)?.[1] || 0); }
