import type { Brief } from "@/domain/project";
import type { ResearchPlan } from "./research-provider";

export function planResearch(brief: Brief): ResearchPlan {
  const questions = [`${brief.topic}的核心定义与边界是什么？`, `${brief.topic}有哪些可验证的关键事实？`, `${brief.topic}对${brief.audience}最重要的影响是什么？`];
  if (brief.needsRecentResearch) questions.push(`${brief.topic}最近一年发生了哪些重要变化？`);
  return { questions, recencyRequired: brief.needsRecentResearch };
}
