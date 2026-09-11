import { z } from "zod";

export const SourceSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  url: z.string().min(1).optional(),
  publisher: z.string().min(1),
  publishedAt: z.string().optional(),
  retrievedAt: z.string(),
  sourceType: z.preprocess(value => typeof value === "string" ? value.toUpperCase() : value, z.enum(["WEB", "FILE", "MOCK"])),
  credibilityScore: z.number().min(0).max(1).optional(),
  fileId: z.string().optional(),
  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  section: z.string().optional(),
  pageOrSlide: z.number().int().positive().optional(),
  excerpt: z.string().optional(),
});

export type Source = z.infer<typeof SourceSchema>;
