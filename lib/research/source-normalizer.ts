import type { Source } from "@/domain/source";

export function normalizeSources(sources: Source[]): Source[] {
  const unique = new Map<string, Source>();
  for (const source of sources) {
    const key = source.url?.toLowerCase().replace(/\/$/, "") || `${source.fileId}:${source.section}:${source.pageOrSlide}`;
    if (!unique.has(key)) unique.set(key, { ...source, title: source.title.trim(), publisher: source.publisher.trim() });
  }
  return [...unique.values()];
}
