import { z } from "zod";

export const ParsedSectionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  text: z.string(),
  section: z.string().optional(),
  pageOrSlide: z.number().int().positive().optional(),
});

export const ParsedDocumentSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  title: z.string().optional(),
  text: z.string(),
  sections: z.array(ParsedSectionSchema),
  warnings: z.array(z.string()),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

export type ParsedSection = z.infer<typeof ParsedSectionSchema>;
export type ParsedDocument = z.infer<typeof ParsedDocumentSchema>;
