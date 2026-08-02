import type {
  GraphData,
  KnowledgeDocument,
  KnowledgeDocumentSummary,
  RegistryServer,
} from "@/lib/knowledge-types";

const decorativeEmoji = /(?:\p{Extended_Pictographic}\uFE0F?|[\uFE0F\u200D\u2713\u2717\u2611\u2610\u2715\u2726\u26F6])/gu;

export function withoutDecorativeEmoji(value: string) {
  return value.replace(decorativeEmoji, "");
}

export function displayText(value: string) {
  return withoutDecorativeEmoji(value)
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .trim();
}

export function displayMarkdown(value: string) {
  return withoutDecorativeEmoji(value);
}

function displayDocumentSummary<T extends KnowledgeDocumentSummary>(document: T): T {
  return {
    ...document,
    title: displayText(document.title),
    excerpt: displayText(document.excerpt),
    headings: document.headings.map(displayText).filter(Boolean),
  };
}

export function displayDocuments(documents: KnowledgeDocumentSummary[]) {
  return documents.map(displayDocumentSummary);
}

export function displayDocument(document: KnowledgeDocument): KnowledgeDocument {
  return {
    ...displayDocumentSummary(document),
    content: displayMarkdown(document.content),
  };
}

export function displayGraph(graph: GraphData): GraphData {
  return {
    ...graph,
    nodes: graph.nodes.map((node) => ({
      ...node,
      label: displayText(node.label),
      summary: displayText(node.summary),
    })),
  };
}

export function displayRegistry(servers: RegistryServer[]): RegistryServer[] {
  return servers.map((server) => ({
    ...server,
    title: displayText(server.title),
    description: displayText(server.description),
  }));
}

export function documentAssetUrl(url: string, document: KnowledgeDocument) {
  if (!url.startsWith("/images/") || !document.commit) return url;

  let assetRoot = "";
  if (document.repository === "modelcontextprotocol/modelcontextprotocol") {
    assetRoot = document.sourcePath.startsWith("blog/") ? "blog/static" : "docs";
  } else if (document.repository === "modelcontextprotocol/java-sdk") {
    assetRoot = "docs";
  } else if (document.repository === "modelcontextprotocol/inspector") {
    assetRoot = "clients/tui";
  }

  const path = `${assetRoot}${url}`.replace(/^\//, "");
  return `https://raw.githubusercontent.com/${document.repository}/${document.commit}/${path}`;
}
