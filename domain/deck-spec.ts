import { z } from "zod";
import { ClaimSchema } from "./claim";
import { SourceSchema } from "./source";
import { StoryboardSlideSchema } from "./storyboard";

export const MediaSlotSchema = z.object({ id: z.string(), purpose: z.string(), kind: z.enum(["IMAGE", "ICON", "CHART", "MAP", "NONE"]) });
export const SlideSpecSchema = StoryboardSlideSchema.extend({
  body: z.string().optional(),
  claims: z.array(ClaimSchema),
  layoutId: z.string(),
  mediaSlots: z.array(MediaSlotSchema),
  chartSpec: z.object({ type: z.string(), description: z.string() }).optional(),
  speakerNotes: z.string().optional(),
});
export const DeckSpecSchema = z.object({
  id: z.string(), brief: z.string(), audience: z.string(), purpose: z.string(), narrative: z.string(), theme: z.string(), sources: z.array(SourceSchema), slides: z.array(SlideSpecSchema),
});
export type SlideSpec = z.infer<typeof SlideSpecSchema>;
export type DeckSpec = z.infer<typeof DeckSpecSchema>;
