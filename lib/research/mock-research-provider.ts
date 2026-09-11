import type { Brief } from "@/domain/project";
import type { ResearchPlan, ResearchProvider } from "./research-provider";

export class MockResearchProvider implements ResearchProvider {
  async research(brief: Brief, plan: ResearchPlan, fileContext: string[]) {
    const sources = [{ id: "mock-source-brief", title: "用户提交的主题与说明", publisher: "本次项目资料", retrievedAt: new Date().toISOString(), sourceType: "MOCK" as const, credibilityScore: 0.5 }];
    const claims = [
      { id: "claim-context", text: `${brief.topic}需要围绕受众关心的问题建立清晰主线。`, type: "INTERPRETATION" as const, sourceIds: [sources[0].id], confidence: 0.72, needsReview: false },
      { id: "claim-research", text: `建议从${plan.questions.length}个研究问题展开，并在正式发布前核对外部事实。`, type: "RECOMMENDATION" as const, sourceIds: [], confidence: 0.65, needsReview: true },
      ...fileContext.slice(0, 2).map((text, index) => ({ id: `claim-file-${index}`, text: text.slice(0, 180), type: "FACT" as const, sourceIds: [], confidence: 0.6, needsReview: true })),
    ];
    return { sources, claims, mode: "mock" as const };
  }
}
