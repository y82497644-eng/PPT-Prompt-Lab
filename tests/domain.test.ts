import assert from "node:assert/strict";
import test from "node:test";
import { ClaimSchema } from "../domain/claim";
import { recommendNarrative } from "../lib/narrative/narrative-strategy";
import { verifyClaims } from "../lib/research/source-verifier";
import { buildStoryboard, regenerateSlide } from "../lib/storyboard/storyboard-builder";

const brief = { topic: "新能源汽车行业趋势", deckType: "商务演示", audience: "业务决策者", purpose: "支持判断", pageRange: "10", needsRecentResearch: true, uploadedFileIds: [] };

test("invalid structured claim is rejected", () => { assert.throws(() => ClaimSchema.parse({ id: "x", text: "", type: "UNKNOWN" })); });
test("numeric claim without source requires review", () => { const [claim] = verifyClaims([{ id: "c", text: "市场增长 20%", type: "NUMERIC", numericValues: [{ value: 20, unit: "%" }], sourceIds: [], confidence: 0.9, needsReview: false }], []); assert.equal(claim.needsReview, true); });
test("narrative is selected from brief", () => { assert.equal(recommendNarrative(brief).strategy, "MARKET_FUNNEL"); });
test("storyboard uses varied layouts", () => { const storyboard = buildStoryboard(brief, [], []); assert.ok(new Set(storyboard.slides.map(slide => slide.suggestedLayout)).size >= 5); for (let index = 1; index < storyboard.slides.length; index++) assert.notEqual(storyboard.slides[index].suggestedLayout, storyboard.slides[index - 1].suggestedLayout); });
test("alternative narrative changes strategy", () => { const first = buildStoryboard(brief, [], []); const second = buildStoryboard(brief, [], [], first.strategy); assert.notEqual(second.strategy, first.strategy); });
test("regenerate changes only requested slide value", () => { const storyboard = buildStoryboard(brief, [], []); const before = storyboard.slides.map(slide => slide.id); const target = 2; const next = storyboard.slides.map((slide, index) => index === target ? regenerateSlide(slide, []) : slide); assert.notEqual(next[target].id, before[target]); next.forEach((slide, index) => { if (index !== target) assert.equal(slide.id, before[index]); }); });
