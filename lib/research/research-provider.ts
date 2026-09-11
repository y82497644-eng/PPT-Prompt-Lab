import type { Brief } from "@/domain/project";
import type { Claim } from "@/domain/claim";
import type { Source } from "@/domain/source";

export interface ResearchPlan { questions: string[]; recencyRequired: boolean; }
export interface ResearchResult { sources: Source[]; claims: Claim[]; mode: "mock" | "real"; }
export interface ResearchProvider { research(brief: Brief, plan: ResearchPlan, fileContext: string[]): Promise<ResearchResult>; }
