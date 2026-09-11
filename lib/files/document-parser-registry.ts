import type { UploadedFile } from "@/domain/project";
import { DocumentParseError, type DocumentParser } from "./document-parser";
import { DocxDocumentParser } from "./docx-document-parser";
import { PdfDocumentParser } from "./pdf-document-parser";
import { PptxDocumentParser } from "./pptx-document-parser";
import { TextDocumentParser } from "./text-document-parser";

const parsers: DocumentParser[] = [new PdfDocumentParser(), new DocxDocumentParser(), new PptxDocumentParser(), new TextDocumentParser()];

export function getDocumentParser(file: UploadedFile): DocumentParser {
  const parser = parsers.find(candidate => candidate.canHandle(file));
  if (!parser) throw new DocumentParseError("UNSUPPORTED_DOCUMENT", `Unsupported extension: ${file.extension}`);
  return parser;
}
