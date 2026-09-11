import type { Brief } from "@/domain/project";
import type { Storyboard } from "@/domain/storyboard";

export type NarrativeStrategy = Storyboard["strategy"];

export function recommendNarrative(brief: Brief): { strategy: NarrativeStrategy; rationale: string; beats: string[] } {
  const text = `${brief.topic} ${brief.deckType} ${brief.purpose}`;
  if (/对比|比较|选型|优劣/.test(text)) return { strategy: "COMPARE", rationale: "对比型主题适合先建立共同标准，再形成判断。", beats: ["共同标准", "方案 A", "方案 B", "关键差异", "建议判断"] };
  if (/教学|课程|科普|概念/.test(text)) return { strategy: "TEACHING", rationale: "学习场景需要从问题进入，再用案例巩固理解。", beats: ["问题", "核心概念", "关键证据", "应用案例", "练习与总结"] };
  if (/市场|行业|商业|投资|路演/.test(text)) return { strategy: "MARKET_FUNNEL", rationale: "商业议题适合从宏观趋势逐步收束到具体机会。", beats: ["宏观变化", "产业结构", "竞争格局", "机会窗口", "行动建议"] };
  if (/历史|演变|未来|趋势/.test(text)) return { strategy: "PAST_PRESENT_FUTURE", rationale: "趋势型主题用时间线更容易形成连续认知。", beats: ["过去如何形成", "今天发生什么", "变化驱动力", "未来可能走向", "现在的选择"] };
  if (/问题|方案|改善|解决/.test(text)) return { strategy: "PROBLEM_SOLUTION", rationale: "目标指向改善，先证明问题再展开解决路径。", beats: ["核心问题", "问题证据", "根因洞察", "解决方案", "落地路径"] };
  return { strategy: "CONCLUSION_FIRST", rationale: "先给结论能让听众快速建立方向，再用证据逐层支撑。", beats: ["核心结论", "关键证据", "原因解释", "实际影响", "下一步行动"] };
}
