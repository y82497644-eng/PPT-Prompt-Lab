import { z } from "zod";

export const NumericValueSchema = z.object({
  value: z.number(),
  unit: z.string().optional(),
  context: z.string().optional(),
});

export const ClaimSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  type: z.enum(["FACT", "NUMERIC", "INTERPRETATION", "RECOMMENDATION"]),
  numericValues: z.array(NumericValueSchema).optional(),
  sourceIds: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  needsReview: z.boolean(),
  claimTopic: z.string().optional(),
});

export const ConflictRecordSchema = z.object({
  id: z.string(),
  claimTopic: z.string(),
  claimIds: z.array(z.string()).min(2),
  sourceIds: z.array(z.string()).min(2),
  values: z.array(NumericValueSchema).min(2),
  needsReview: z.literal(true),
});

export type Claim = z.infer<typeof ClaimSchema>;
export type ConflictRecord = z.infer<typeof ConflictRecordSchema>;
