import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import type { UploadedFile } from "../domain/project";
import { DocumentParseError } from "../lib/files/document-parser";
import { DocxDocumentParser } from "../lib/files/docx-document-parser";
import { PdfDocumentParser } from "../lib/files/pdf-document-parser";
import { PptxDocumentParser } from "../lib/files/pptx-document-parser";
import { getDocumentParser } from "../lib/files/document-parser-registry";

const root = path.join(process.cwd(), "tests", "fixtures");
function stored(name: string, mimeType: string): UploadedFile { return { id: name, originalName: name, storedName: name, extension: path.extname(name), mimeType, size: 1, path: path.join(root, name), parseStatus: "PENDING" }; }

test("PDF parser extracts page text", async () => { const document = await new PdfDocumentParser().parse(stored("sample.pdf", "application/pdf")); assert.match(document.text, /120 MW/); assert.equal(document.sections[0].pageOrSlide, 1); });
test("scanned PDF reports no extractable text", async () => { await assert.rejects(() => new PdfDocumentParser().parse(stored("scanned-no-text.pdf", "application/pdf")), (error: unknown) => error instanceof DocumentParseError && error.code === "NO_EXTRACTABLE_TEXT"); });
test("DOCX parser extracts paragraphs, lists and table text", async () => { const document = await new DocxDocumentParser().parse(stored("sample.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")); assert.match(document.text, /2026/); assert.match(document.text, /80 MW/); assert.equal(document.title, "课程能源资料"); });
test("PPTX parser preserves slide positions and notes", async () => { const document = await new PptxDocumentParser().parse(stored("sample.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation")); assert.equal(document.sections.length, 2); assert.equal(document.sections[1].pageOrSlide, 2); assert.match(document.sections[1].text, /80 MW/); assert.match(document.sections[1].text, /演讲者备注/); });
test("invalid parser input is rejected", () => { assert.throws(() => getDocumentParser(stored("bad.csv", "text/csv")), (error: unknown) => error instanceof DocumentParseError && error.code === "UNSUPPORTED_DOCUMENT"); });
