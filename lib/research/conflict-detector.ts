import type { Claim, ConflictRecord } from "@/domain/claim";

export function detectEvidenceConflicts(claims: Claim[]): ConflictRecord[] {
  const groups = new Map<string, Claim[]>();
  for (const claim of claims.filter(item => item.numericValues?.length && item.sourceIds.length)) {
    const key = (claim.claimTopic || claim.text.replace(/\d+(?:\.\d+)?/g, "#")).trim().toLowerCase();
    groups.set(key, [...(groups.get(key) || []), claim]);
  }
  return [...groups.entries()].flatMap(([claimTopic, group]) => {
    const values = group.flatMap(claim => claim.numericValues || []); const distinct = new Set(values.map(value => `${value.value}:${value.unit || ""}`)); const sourceIds = [...new Set(group.flatMap(claim => claim.sourceIds))];
    if (group.length < 2 || distinct.size < 2 || sourceIds.length < 2) return [];
    return [{ id: crypto.randomUUID(), claimTopic, claimIds: group.map(claim => claim.id), sourceIds, values, needsReview: true as const }];
  });
}

export function reconcileEvidenceConflicts(claims: Claim[]) {
  const conflicts = detectEvidenceConflicts(claims);
  const conflictingIds = new Set(conflicts.flatMap(conflict => conflict.claimIds));
  return { conflicts, claims: claims.map(claim => conflictingIds.has(claim.id) ? { ...claim, needsReview: true } : claim) };
}
