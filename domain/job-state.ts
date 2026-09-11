import { z } from "zod";

export const JobStatusSchema = z.enum(["PROJECT_CREATED", "UPLOAD_VALIDATING", "FILE_PARSING", "RESEARCH_PLANNING", "WEB_SEARCHING", "SOURCE_VERIFYING", "STORYBOARD_DRAFTING", "STORYBOARD_READY", "FAILED", "RETRYING", "CANCELLED"]);
export const JobStateSchema = z.object({ id: z.string(), projectId: z.string(), status: JobStatusSchema, completed: z.array(JobStatusSchema), message: z.string(), updatedAt: z.string(), error: z.string().optional() });
export type JobStatus = z.infer<typeof JobStatusSchema>;
export type JobState = z.infer<typeof JobStateSchema>;
