import { z } from "zod";
import { ClaimSchema } from "./claim";
import { ConflictRecordSchema } from "./claim";
import { ParsedDocumentSchema } from "./document";
import { SourceSchema } from "./source";
import { StoryboardSchema } from "./storyboard";

export const BriefSchema = z.object({ topic: z.string().min(1), deckType: z.string(), audience: z.string(), purpose: z.string(), pageRange: z.string(), needsRecentResearch: z.boolean(), uploadedFileIds: z.array(z.string()) });
export const UploadedFileSchema = z.object({ id: z.string(), originalName: z.string(), storedName: z.string(), extension: z.string(), mimeType: z.string(), size: z.number(), path: z.string(), parsedDocument: ParsedDocumentSchema.optional(), parseStatus: z.preprocess(value => value === "METADATA_ONLY" ? "PENDING" : value, z.enum(["PENDING", "READY", "FAILED"])).default("PENDING"), parseError: z.string().optional() });
export const ProjectSchema = z.object({
  id: z.string(), title: z.string(), createdAt: z.string(), updatedAt: z.string(), brief: BriefSchema, files: z.array(UploadedFileSchema), sources: z.array(SourceSchema), claims: z.array(ClaimSchema), conflicts: z.array(ConflictRecordSchema).default([]), storyboard: StoryboardSchema.optional(), researchMode: z.enum(["mock", "real"]).default("mock"),
});
export type Brief = z.infer<typeof BriefSchema>;
export type UploadedFile = z.infer<typeof UploadedFileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
