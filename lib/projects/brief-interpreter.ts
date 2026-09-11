import type { Brief } from "@/domain/project";

export function interpretBrief(topic: string, fileIds: string[]): Brief {
  const text = topic.trim();
  const teaching = /课程|课堂|作业|汇报|答辩/.test(text);
  const business = /商业|市场|融资|路演|产品|客户/.test(text);
  const deckType = teaching ? "课程报告" : business ? "商务演示" : "主题演示";
  const audience = teaching ? "老师与同学" : business ? "业务决策者" : "普通听众";
  return { topic: text, deckType, audience, purpose: teaching ? "清楚解释主题并展示关键判断" : business ? "支持理解、判断与行动" : "让听众快速理解并记住核心观点", pageRange: teaching ? "12" : "10", needsRecentResearch: /趋势|市场|行业|政策|最新|今年|现状/.test(text), uploadedFileIds: fileIds };
}
