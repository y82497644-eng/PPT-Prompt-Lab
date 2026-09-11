import type { ParsedDocument } from "@/domain/document";
import type { UploadedFile } from "@/domain/project";

export interface DocumentParser {
  canHandle(file: UploadedFile): boolean;
  parse(file: UploadedFile): Promise<ParsedDocument>;
}

export class DocumentParseError extends Error {
  constructor(public readonly code: "NO_EXTRACTABLE_TEXT" | "PDF_PARSE_FAILED" | "DOCX_PARSE_FAILED" | "PPTX_PARSE_FAILED" | "UNSUPPORTED_DOCUMENT", message: string) {
    super(message);
    this.name = "DocumentParseError";
  }
}
