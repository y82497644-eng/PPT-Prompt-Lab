export const appEnvironments = ["development", "preview", "production"] as const;
export const researchModes = ["mock", "real"] as const;

export type AppEnvironment = (typeof appEnvironments)[number];
export type ResearchMode = (typeof researchModes)[number];
export type RuntimeEnvironment = Record<string, string | undefined>;

export function getRuntimeConfig(environment: RuntimeEnvironment = process.env) {
  const appEnvironment = environment.APP_ENV || "development";
  const researchMode = environment.RESEARCH_MODE || "mock";

  if (!appEnvironments.includes(appEnvironment as AppEnvironment)) throw new Error("INVALID_APP_ENV");
  if (!researchModes.includes(researchMode as ResearchMode)) throw new Error("INVALID_RESEARCH_MODE");

  return { appEnvironment: appEnvironment as AppEnvironment, researchMode: researchMode as ResearchMode };
}

export function assertLocalStorageAllowed(environment: RuntimeEnvironment = process.env) {
  if (getRuntimeConfig(environment).appEnvironment === "production") throw new Error("PRODUCTION_STORAGE_NOT_CONFIGURED");
}

export function assertLocalJobRunnerAllowed(environment: RuntimeEnvironment = process.env) {
  if (getRuntimeConfig(environment).appEnvironment === "production") throw new Error("PRODUCTION_JOB_RUNNER_NOT_CONFIGURED");
}
