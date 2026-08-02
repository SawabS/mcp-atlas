import type {
  CorpusStats,
  GraphData,
  KnowledgeDocument,
  KnowledgeDocumentSummary,
  RegistryServer,
} from "@/lib/knowledge-types";
import {
  displayDocument,
  displayDocuments,
  displayGraph,
  displayRegistry,
} from "@/lib/display-text";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function dataPath(path: string) {
  return `${basePath}/data/${path}`;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(dataPath(path));
  if (!response.ok) {
    throw new Error(`Could not load ${path}.`);
  }
  return response.json() as Promise<T>;
}

export function loadDocuments() {
  return getJson<KnowledgeDocumentSummary[]>("documents.json").then(displayDocuments);
}

export function loadDocument(id: string) {
  return getJson<KnowledgeDocument>(`documents/${id}.json`).then(displayDocument);
}

export function loadGraph() {
  return getJson<GraphData>("graph.json").then(displayGraph);
}

export function loadRegistry() {
  return getJson<RegistryServer[]>("registry.json").then(displayRegistry);
}

export function loadStats() {
  return getJson<CorpusStats>("stats.json");
}

export function chatEndpoint() {
  return process.env.NEXT_PUBLIC_CHAT_API_URL || `${basePath}/api/chat`;
}
