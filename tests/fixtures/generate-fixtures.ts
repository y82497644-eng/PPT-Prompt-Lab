import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { strToU8, zipSync } from "fflate";

const fixtureRoot = path.join(process.cwd(), "tests", "fixtures");

function zip(files: Record<string, string>) { return Buffer.from(zipSync(Object.fromEntries(Object.entries(files).map(([name, value]) => [name, strToU8(value)])))); }
function pdf(content: string) {
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`];
  let output = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(output)); output += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(output); output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(output, "ascii");
}

async function main() {
await mkdir(fixtureRoot, { recursive: true });
await writeFile(path.join(fixtureRoot, "sample.pdf"), pdf("BT /F1 18 Tf 72 720 Td (Solar Market Report) Tj 0 -30 Td /F1 12 Tf (Installed capacity reached 120 MW in 2025.) Tj ET"));
await writeFile(path.join(fixtureRoot, "scanned-no-text.pdf"), pdf("0.8 g 72 650 300 100 re f"));
await writeFile(path.join(fixtureRoot, "sample.docx"), zip({
  "[Content_Types].xml": `<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
  "_rels/.rels": `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
  "docProps/core.xml": `<?xml version="1.0"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>课程能源资料</dc:title></cp:coreProperties>`,
  "word/document.xml": `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>课程能源资料</w:t></w:r></w:p><w:p><w:r><w:t>学校计划在 2026 年建设屋顶光伏示范项目。</w:t></w:r></w:p><w:p><w:pPr><w:numPr/></w:pPr><w:r><w:t>第一项：完成能源审计</w:t></w:r></w:p><w:tbl><w:tr><w:tc><w:p><w:r><w:t>预计容量</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>80 MW</w:t></w:r></w:p></w:tc></w:tr></w:tbl></w:body></w:document>`,
}));
await writeFile(path.join(fixtureRoot, "sample.pptx"), zip({
  "[Content_Types].xml": `<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/><Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/></Types>`,
  "_rels/.rels": `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`,
  "ppt/presentation.xml": `<?xml version="1.0"?><p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>`,
  "ppt/slides/slide1.xml": `<?xml version="1.0"?><p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:t>校园光伏计划</a:t><a:t>从能源审计开始</a:t></p:sld>`,
  "ppt/slides/slide2.xml": `<?xml version="1.0"?><p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:t>建设目标</a:t><a:t>示范容量达到 80 MW</a:t><a:tbl><a:tr><a:tc><a:t>阶段一</a:t></a:tc></a:tr></a:tbl></p:sld>`,
  "ppt/notesSlides/notesSlide2.xml": `<?xml version="1.0"?><p:notes xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:t>说明数据仍需最终复核</a:t></p:notes>`,
}));
}

void main();
