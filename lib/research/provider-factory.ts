import { getRuntimeConfig, type RuntimeEnvironment } from "@/lib/config/runtime";
import { MockResearchProvider } from "./mock-research-provider";
import { OpenAIResearchProvider } from "./openai-research-provider";
import type { ResearchProvider } from "./research-provider";

export function getResearchProvider(environment: RuntimeEnvironment = process.env): ResearchProvider {
  const { appEnvironment, researchMode } = getRuntimeConfig(environment);
  if (researchMode === "mock") {
    if (appEnvironment === "production") throw new Error("RESEARCH_PROVIDER_NOT_CONFIGURED");
    return new MockResearchProvider();
  }
  if (!environment.OPENAI_API_KEY) throw new Error("RESEARCH_PROVIDER_NOT_CONFIGURED");
  return new OpenAIResearchProvider(environment.OPENAI_API_KEY, environment.OPENAI_MODEL);
}
