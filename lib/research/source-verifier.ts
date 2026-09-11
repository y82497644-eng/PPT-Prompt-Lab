import type { Claim } from "@/domain/claim";
import type { Source } from "@/domain/source";

export function verifyClaims(claims: Claim[], sources: Source[]): Claim[] {
  const ids = new Set(sources.map(source => source.id));
  return claims.map(claim => {
    const sourceIds = claim.sourceIds.filter(id => ids.has(id));
    const requiresSource = claim.type === "FACT" || claim.type === "NUMERIC" || Boolean(claim.numericValues?.length) || /\d/.test(claim.text);
    return { ...claim, sourceIds, needsReview: claim.needsReview || (requiresSource && sourceIds.length === 0), confidence: sourceIds.length ? claim.confidence : Math.min(claim.confidence, 0.55) };
  });
}
