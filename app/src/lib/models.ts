import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

/**
 * Every model is served through the same OpenAI-compatible NVIDIA endpoint and
 * carries its own key. `envNames` lists the canonical variable first and the
 * bare model id second, which is the form the deployed `.env` already uses.
 */
export const MODEL_OPTIONS = {
  nemotron: {
    id: "nvidia/nemotron-3-ultra-550b-a55b",
    label: "Nemotron 3 Ultra",
    envNames: ["NVIDIA_NEMOTRON_API_KEY", "nemotron-3-ultra-550b-a55b"],
  },
  kimi: {
    id: "moonshotai/kimi-k2.6",
    label: "Kimi K2.6",
    envNames: ["NVIDIA_KIMI_API_KEY", "kimi-k2.6"],
  },
  deepseek: {
    id: "deepseek-ai/deepseek-v4-flash",
    label: "DeepSeek V4 Flash",
    envNames: ["NVIDIA_DEEPSEEK_API_KEY", "deepseek-v4-flash"],
  },
  glm: {
    id: "z-ai/glm-5.2",
    label: "GLM 5.2",
    envNames: ["NVIDIA_GLM_API_KEY", "glm-5.2"],
  },
} as const;

export type ModelKey = keyof typeof MODEL_OPTIONS;

const DEFAULT_MODEL: ModelKey = "nemotron";

function readKey(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
}

function isModelKey(value: string | undefined): value is ModelKey {
  return Boolean(value && value in MODEL_OPTIONS);
}

/** Which models actually have a key on this deployment. Keys never leave the server. */
export function availableModels(): Array<{ key: ModelKey; label: string; ready: boolean }> {
  return (Object.keys(MODEL_OPTIONS) as ModelKey[]).map((key) => ({
    key,
    label: MODEL_OPTIONS[key].label,
    ready: Boolean(readKey(MODEL_OPTIONS[key].envNames)),
  }));
}

export function getLanguageModel(requested: string | undefined) {
  const modelKey: ModelKey = isModelKey(requested) ? requested : DEFAULT_MODEL;
  const config = MODEL_OPTIONS[modelKey];
  const apiKey = readKey(config.envNames);
  if (!apiKey) {
    throw new Error(`No API key is configured for ${config.label}.`);
  }
  const nvidia = createOpenAI({
    apiKey,
    baseURL: "https://integrate.api.nvidia.com/v1",
    name: "nvidia",
  });
  return { model: nvidia.chat(config.id), modelKey, config };
}
