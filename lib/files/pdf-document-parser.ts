import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { UploadedFile } from "@/domain/project";
import { DocumentParseError, type DocumentParser } from "./document-parser";

export class PdfDocumentParser implements DocumentParser {
  canHandle(file: UploadedFile) { return file.extension === ".pdf"; }
  async parse(file: UploadedFile) {
    try {
      const bytes = new Uint8Array(await readFile(file.path));
      const pdf = await getDocument({ data: bytes, useSystemFonts: false, disableFontFace: true, verbosity: 0 }).promise;
      const sections = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber); const content = await page.getTextContent();
        const text = content.items.map(item => "str" in item ? item.str : "").join(" ").replace(/\s+/g, " ").trim();
        if (text) sections.push({ id: `${file.id}-page-${pageNumber}`, section: `第 ${pageNumber} 页`, pageOrSlide: pageNumber, text });
      }
      const text = sections.map(section => section.text).join("\n\n");
      if (!text) throw new DocumentParseError("NO_EXTRACTABLE_TEXT", "这个 PDF 可能是扫描版，暂时无法读取正文。");
      return { fileId: file.id, fileName: file.originalName, mimeType: file.mimeType, title: sections[0]?.text.slice(0, 100), text, sections, warnings: [], metadata: { format: "pdf", pageCount: pdf.numPages } };
    } catch (error) {
      if (error instanceof DocumentParseError) throw error;
      throw new DocumentParseError("PDF_PARSE_FAILED", error instanceof Error ? error.message : "PDF parse failed");
    }
  }
}
