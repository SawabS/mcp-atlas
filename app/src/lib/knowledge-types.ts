import type { UIMessage } from "ai";

export type KnowledgeDocumentSummary = {
  id: string;
  title: string;
  excerpt: string;
  documentType: string;
  authority: string;
  repository: string;
  sourcePath: string;
  sourceUrl: string;
  commit: string | null;
  license: string | null;
  category: string;
  tags: string[];
  concepts: string[];
  headings: string[];
  wordCount: number;
  vaultPath: string;
  vaultLink: string;
};

export type KnowledgeDocument = KnowledgeDocumentSummary & {
  content: string;
};

export type RegistryServer = {
  id: string;
  name: string;
  title: string;
  description: string;
  version: string | null;
  repositoryUrl: string | null;
  websiteUrl: string | null;
  packages: Array<{
    type: string | null;
    identifier: string | null;
    transport: string | null;
  }>;
  remotes: Array<{ type: string | null; url: string | null }>;
  updatedAt: string | null;
};

export type CorpusStats = {
  generatedAt: string;
  documents: number;
  retrievalChunks: number;
  registryServers: number;
  repositories: number;
  categories: Record<string, number>;
  authorities: Record<string, number>;
};

export type GraphNode = {
  id: string;
  label: string;
  group: "core" | "primitive" | "security" | "ecosystem";
  summary: string;
};

export type GraphData = {
  nodes: GraphNode[];
  edges: Array<{ source: string; target: string }>;
};

export type RetrievalChunk = {
  id: string;
  documentId: string;
  title: string;
  heading: string;
  text: string;
  authority: string;
  repository: string | null;
  sourcePath: string;
  sourceUrl: string;
  commit: string | null;
  category: string;
};

export type RetrievedSource = RetrievalChunk & {
  rank: number;
  score: number;
};

export type IndexProgress = {
  phase: "retrieving" | "ranking" | "drafting";
  sourceCount?: number;
};

export type IndexSourceAttribution = {
  sourceId: string;
  url: string;
  title: string;
  heading: string;
  repository: string | null;
  sourcePath: string;
  authority: string;
  category: string;
  excerpt: string;
};

export type IndexDataParts = {
  progress: IndexProgress;
  source: IndexSourceAttribution;
};

export type IndexUIMessage = UIMessage<unknown, IndexDataParts>;
