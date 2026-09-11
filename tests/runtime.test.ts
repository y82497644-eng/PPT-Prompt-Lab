import assert from "node:assert/strict";
import test from "node:test";
import { GET as healthCheck } from "../app/api/health/route";
import { assertLocalJobRunnerAllowed, getRuntimeConfig } from "../lib/config/runtime";
import { getFileStorage } from "../lib/files/local-file-storage";
import { getResearchProvider } from "../lib/research/provider-factory";
import { getProjectRepository } from "../lib/storage/local-project-repository";

test("health endpoint returns public preview status", async () => {
  const previous = process.env.APP_ENV;
  process.env.APP_ENV = "preview";
  try {
    const response = healthCheck();
    assert.deepEqual(await response.json(), { status: "ok", app: "yejian", environment: "preview" });
  } finally {
    if (previous === undefined) delete process.env.APP_ENV; else process.env.APP_ENV = previous;
  }
});

test("preview selects local persistence", () => {
  assert.ok(getProjectRepository({ APP_ENV: "preview", RESEARCH_MODE: "mock" }));
  assert.ok(getFileStorage({ APP_ENV: "preview", RESEARCH_MODE: "mock" }));
});

test("production rejects local persistence", () => {
  const environment = { NODE_ENV: "production", APP_ENV: "production", RESEARCH_MODE: "real" };
  assert.throws(() => getProjectRepository(environment), /PRODUCTION_STORAGE_NOT_CONFIGURED/);
  assert.throws(() => getFileStorage(environment), /PRODUCTION_STORAGE_NOT_CONFIGURED/);
  assert.throws(() => assertLocalJobRunnerAllowed(environment), /PRODUCTION_JOB_RUNNER_NOT_CONFIGURED/);
});

test("production rejects mock research", () => {
  assert.throws(() => getResearchProvider({ APP_ENV: "production", RESEARCH_MODE: "mock" }), /RESEARCH_PROVIDER_NOT_CONFIGURED/);
});

test("real research requires a key", () => {
  assert.throws(() => getResearchProvider({ APP_ENV: "preview", RESEARCH_MODE: "real" }), /RESEARCH_PROVIDER_NOT_CONFIGURED/);
});

test("environment values are validated", () => {
  assert.throws(() => getRuntimeConfig({ APP_ENV: "staging" }), /INVALID_APP_ENV/);
  assert.throws(() => getRuntimeConfig({ RESEARCH_MODE: "automatic" }), /INVALID_RESEARCH_MODE/);
});
