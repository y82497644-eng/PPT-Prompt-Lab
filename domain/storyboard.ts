import { z } from "zod";

export const SlideRoleSchema = z.enum(["COVER", "THESIS", "DATA", "TREND", "MAP", "COMPARISON", "PROCESS", "CASE", "IMAGE", "CONCLUSION", "SOURCES"]);

export const StoryboardSlideSchema = z.object({
  id: z.string(),
  order: z.number().int().nonnegative(),
  role: SlideRoleSchema,
  narrativeBeat: z.string(),
  headline: z.string().min(1),
  summary: z.string(),
  claimIds: z.array(z.string()),
  sourceRefs: z.array(z.string()),
  visualIntent: z.string(),
  suggestedLayout: z.string(),
  signatureSlide: z.boolean().default(false),
  needsReview: z.boolean().default(false),
});

export const StoryboardSchema = z.object({
  id: z.string(),
  strategy: z.enum(["CONCLUSION_FIRST", "PROBLEM_SOLUTION", "PAST_PRESENT_FUTURE", "MARKET_FUNNEL", "COMPARE", "TEACHING"]),
  rationale: z.string(),
  slides: z.array(StoryboardSlideSchema),
});

export type StoryboardSlide = z.infer<typeof StoryboardSlideSchema>;
export type Storyboard = z.infer<typeof StoryboardSchema>;
