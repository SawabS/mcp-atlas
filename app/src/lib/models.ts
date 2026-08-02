import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

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
} as const;

export type ModelKey = keyof typeof MODEL_OPTIONS;

function readKey(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
}

export function getLanguageModel(requested: string | undefined) {
  const modelKey: ModelKey = requested === "kimi" ? "kimi" : "nemotron";
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
