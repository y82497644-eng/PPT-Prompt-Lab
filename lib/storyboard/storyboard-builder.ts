import type { Claim } from "@/domain/claim";
import type { Brief } from "@/domain/project";
import type { Storyboard, StoryboardSlide } from "@/domain/storyboard";
import type { Source } from "@/domain/source";
import { recommendNarrative } from "@/lib/narrative/narrative-strategy";

const layouts = ["hero-statement", "evidence-split", "timeline-focus", "comparison-axis", "process-path", "case-spotlight", "closing-action"];

export function buildStoryboard(brief: Brief, claims: Claim[], sources: Source[], avoidStrategy?: Storyboard["strategy"]): Storyboard {
  let narrative = recommendNarrative(brief);
  if (narrative.strategy === avoidStrategy) {
    const alternatives: Storyboard["strategy"][] = ["CONCLUSION_FIRST", "PROBLEM_SOLUTION", "PAST_PRESENT_FUTURE", "MARKET_FUNNEL", "COMPARE", "TEACHING"];
    const strategy = alternatives[(alternatives.indexOf(avoidStrategy) + 1) % alternatives.length];
    narrative = { strategy, rationale: "换一个组织角度，让同一组证据形成不同的讲述节奏。", beats: strategy === "PROBLEM_SOLUTION" ? ["核心问题", "问题证据", "根因洞察", "解决方案", "落地路径"] : ["核心判断", "支持证据", "关键解释", "实际影响", "下一步行动"] };
  }
  const reliableClaims = [...claims].sort((a, b) => Number(a.needsReview) - Number(b.needsReview) || b.confidence - a.confidence);
  const target = Math.max(8, Math.min(15, Number.parseInt(brief.pageRange) || 10));
  const evidenceSlots = reliableClaims.slice(0, target - 3);
  const slideDrafts: Array<Partial<StoryboardSlide> & Pick<StoryboardSlide, "role" | "narrativeBeat" | "headline" | "summary">> = [
    { role: "COVER", narrativeBeat: "建立主题", headline: brief.topic, summary: `${brief.deckType} · 面向${brief.audience}` },
    ...evidenceSlots.map((claim, index) => ({ role: roleForClaim(claim, index), narrativeBeat: narrative.beats[index % narrative.beats.length], headline: claim.needsReview && claim.sourceIds.length === 0 ? "待补可靠数据" : claim.text, summary: claim.needsReview ? "这项信息仍需核对，暂不作为唯一事实使用。" : `用可追溯证据支撑“${narrative.beats[index % narrative.beats.length]}”。`, claimIds: [claim.id], sourceRefs: claim.sourceIds, needsReview: claim.needsReview })),
  ];
  while (slideDrafts.length < target - 2) {
    const beat = narrative.beats[(slideDrafts.length - 1) % narrative.beats.length];
    slideDrafts.push({ role: "PROCESS", narrativeBeat: beat, headline: `${beat}：需要进一步说明的关键关系`, summary: "这一页只承担解释任务，不引入未经来源支持的新事实。", needsReview: true });
  }
  slideDrafts.push({ role: "SOURCES", narrativeBeat: "来源说明", headline: `本次共记录 ${sources.filter(source => source.sourceType !== "MOCK").length} 条可追溯来源`, summary: "保留资料位置与公开网页信息，便于逐项核对。", sourceRefs: sources.filter(source => source.sourceType !== "MOCK").map(source => source.id) });
  slideDrafts.push({ role: "CONCLUSION", narrativeBeat: "形成行动", headline: "把已确认的判断变成下一步行动", summary: "只基于已经核实的证据形成结论，并明确仍需复核的部分。" });
  const slides = slideDrafts.map((draft, index) => ({ id: crypto.randomUUID(), order: index, role: draft.role, narrativeBeat: draft.narrativeBeat, headline: draft.headline, summary: draft.summary, claimIds: draft.claimIds || [], sourceRefs: draft.sourceRefs || [], visualIntent: visualIntent(draft.role), suggestedLayout: layouts[index % layouts.length], signatureSlide: index === Math.floor(slideDrafts.length / 2), needsReview: draft.needsReview || false } satisfies StoryboardSlide));
  return { id: crypto.randomUUID(), strategy: narrative.strategy, rationale: narrative.rationale, slides };
}

export function regenerateSlide(slide: StoryboardSlide, claims: Claim[]): StoryboardSlide {
  const alternative = claims.find(claim => !slide.claimIds.includes(claim.id) && claim.sourceIds.length > 0);
  return { ...slide, id: crypto.randomUUID(), headline: alternative?.text || `换一个角度：${slide.headline}`, summary: alternative ? "用另一项已有证据改写本页，不触发新的联网研究。" : `保留“${slide.narrativeBeat}”这一叙事任务，改用更直接的表达。`, claimIds: alternative ? [alternative.id] : slide.claimIds, sourceRefs: alternative?.sourceIds || slide.sourceRefs, needsReview: alternative?.needsReview ?? slide.needsReview };
}

function roleForClaim(claim: Claim, index: number): StoryboardSlide["role"] { if (claim.type === "NUMERIC") return index % 2 ? "TREND" : "DATA"; if (/对比|差异|高于|低于/.test(claim.text)) return "COMPARISON"; if (/地区|区域|国家|城市/.test(claim.text)) return "MAP"; return index === 0 ? "THESIS" : "CASE"; }
function visualIntent(role: StoryboardSlide["role"]) { if (role === "DATA") return "突出一个有来源的核心数字"; if (role === "TREND") return "用有来源的数据解释变化方向"; if (role === "COMPARISON") return "围绕同一口径呈现差异"; if (role === "MAP") return "展示有来源的区域关系"; if (role === "SOURCES") return "清晰列出资料与网页出处"; return "保持一个主要视觉焦点"; }
