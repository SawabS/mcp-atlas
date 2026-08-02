import type {
  CorpusStats,
  GraphData,
  KnowledgeDocument,
  KnowledgeDocumentSummary,
  RegistryServer,
} from "@/lib/knowledge-types";

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
  return getJson<KnowledgeDocumentSummary[]>("documents.json");
}

export function loadDocument(id: string) {
  return getJson<KnowledgeDocument>(`documents/${id}.json`);
}

export function loadGraph() {
  return getJson<GraphData>("graph.json");
}

export function loadRegistry() {
  return getJson<RegistryServer[]>("registry.json");
}

export function loadStats() {
  return getJson<CorpusStats>("stats.json");
}

export function chatEndpoint() {
  return process.env.NEXT_PUBLIC_CHAT_API_URL || `${basePath}/api/chat`;
}
