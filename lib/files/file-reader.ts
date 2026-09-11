import type { ParsedDocument } from "@/domain/document";
import type { UploadedFile } from "@/domain/project";
import { DocumentParseError } from "./document-parser";
import { getDocumentParser } from "./document-parser-registry";

export interface ParsedFileBatch { files: UploadedFile[]; documents: ParsedDocument[]; warnings: string[]; }

export class LocalFileReader {
  async parse(files: UploadedFile[]): Promise<ParsedFileBatch> {
    const documents: ParsedDocument[] = []; const warnings: string[] = [];
    for (const file of files) {
      try {
        const document = await getDocumentParser(file).parse(file);
        file.parsedDocument = document; file.parseStatus = "READY"; file.parseError = undefined; documents.push(document);
      } catch (error) {
        const code = error instanceof DocumentParseError ? error.code : "UNSUPPORTED_DOCUMENT";
        file.parseStatus = "FAILED"; file.parseError = code;
        warnings.push(error instanceof Error ? error.message : "资料暂时无法读取");
      }
    }
    return { files, documents, warnings };
  }
}
