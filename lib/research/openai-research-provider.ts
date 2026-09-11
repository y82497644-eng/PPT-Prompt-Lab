import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { Brief } from "@/domain/project";
import type { ResearchPlan, ResearchProvider } from "./research-provider";

const OutputSchema = z.object({
  sources: z.array(z.object({ id: z.string(), title: z.string(), url: z.string(), publisher: z.string() })),
  claims: z.array(z.object({ id: z.string(), text: z.string(), type: z.enum(["FACT", "NUMERIC", "INTERPRETATION", "RECOMMENDATION"]), numericValues: z.array(z.object({ value: z.number(), unit: z.string().optional(), context: z.string().optional() })).optional(), sourceIds: z.array(z.string()), confidence: z.number().min(0).max(1), needsReview: z.boolean(), claimTopic: z.string().optional() })),
});

export class OpenAIResearchProvider implements ResearchProvider {
  private client: OpenAI;
  constructor(apiKey: string, private model = "gpt-5.4-mini") { this.client = new OpenAI({ apiKey }); }
  async research(brief: Brief, plan: ResearchPlan, fileContext: string[]) {
    const response = await this.client.responses.parse({
      model: this.model,
      tools: [{ type: "web_search_preview" }],
      include: ["web_search_call.action.sources"],
      store: false,
      input: `为演示文稿研究以下主题。政策、法律、统计和财报优先使用政府、国际组织、原始政策、官方企业或一手数据；新闻只用于补充近期变化。只记录本次 Web Search 工具实际返回的来源，不确定时标记 needsReview。数字 Claim 必须引用来源。不同来源出现冲突数字时保留为独立 Claim，使用相同 claimTopic，不得平均或隐藏。\n主题：${brief.topic}\n受众：${brief.audience}\n目标：${brief.purpose}\n研究问题：${plan.questions.join("；")}\n用户资料：${fileContext.join("\n")}`,
      text: { format: zodTextFormat(OutputSchema, "research_result") },
    });
    const parsed = OutputSchema.parse(response.output_parsed);
    const retrievedAt = new Date().toISOString();
    const citations = collectCitations(response.output);
    const sources = parsed.sources.filter(source => citations.has(source.url)).map(source => ({ id: source.id, url: source.url, title: citations.get(source.url) || source.title, publisher: new URL(source.url).hostname.replace(/^www\./, ""), retrievedAt, sourceType: "WEB" as const, credibilityScore: credibilityScore(source.url) }));
    return { mode: "real" as const, sources, claims: parsed.claims };
  }
}

function credibilityScore(url: string) {
  const host = new URL(url).hostname.toLowerCase();
  if (/\.go\.id$|\.gov$|\.gov\.|worldbank\.org$|iea\.org$|irena\.org$/.test(host)) return 0.95;
  if (/\.org$|reuters\.com$|apnews\.com$|bloomberg\.com$/.test(host)) return 0.85;
  return 0.65;
}

export function collectCitations(value: unknown): Map<string, string> {
  const citations = new Map<string, string>();
  function visit(item: unknown) {
    if (!item || typeof item !== "object") return;
    const record = item as Record<string, unknown>;
    if (record.type === "url_citation" && typeof record.url === "string") citations.set(record.url, typeof record.title === "string" ? record.title : record.url);
    for (const child of Object.values(record)) {
      if (Array.isArray(child)) child.forEach(visit);
      else visit(child);
    }
  }
  visit(value); return citations;
}
