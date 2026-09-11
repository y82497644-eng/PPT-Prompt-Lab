import type { Claim } from "@/domain/claim";
import type { ParsedDocument } from "@/domain/document";
import type { Source } from "@/domain/source";

export function buildFileEvidence(documents: ParsedDocument[]): { sources: Source[]; claims: Claim[] } {
  const sources: Source[] = []; const claims: Claim[] = [];
  for (const document of documents) {
    for (const section of document.sections) {
      const sourceId = `file-source-${section.id}`;
      sources.push({ id: sourceId, sourceType: "FILE", title: document.title || document.fileName, publisher: "来自你的资料", retrievedAt: new Date().toISOString(), fileId: document.fileId, fileName: document.fileName, mimeType: document.mimeType, section: section.section, pageOrSlide: section.pageOrSlide, excerpt: section.text.slice(0, 280), credibilityScore: 0.8 });
      const text = firstClaimText(section.text);
      if (!text) continue;
      const numericValues = extractNumericValues(text);
      claims.push({ id: `file-claim-${section.id}`, text, type: numericValues.length ? "NUMERIC" : "FACT", numericValues: numericValues.length ? numericValues : undefined, sourceIds: [sourceId], confidence: 0.82, needsReview: false, claimTopic: section.title || section.section || document.title || document.fileName });
    }
  }
  return { sources, claims };
}

function firstClaimText(text: string) { return text.split(/(?<=[。！？.!?])\s*/).find(value => value.trim().length >= 6)?.trim() || text.trim().slice(0, 220); }
function extractNumericValues(text: string) { return [...text.matchAll(/(?<![\w.])(\d+(?:\.\d+)?)\s*(%|％|GW|MW|亿元|万元|人|页|年)?/gi)].map(match => ({ value: Number(match[1]), unit: match[2] || undefined, context: text.slice(Math.max(0, (match.index || 0) - 20), (match.index || 0) + match[0].length + 20) })); }
