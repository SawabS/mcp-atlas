import type { GraphData, KnowledgeDocumentSummary } from "@/lib/knowledge-types";

export type NodeGroup = "core" | "primitive" | "security" | "ecosystem" | "document";

export type AtlasNode = {
  id: string;
  label: string;
  kind: "concept" | "document";
  group: NodeGroup;
  summary: string;
  documentId?: string;
  category?: string;
  sourcePath?: string;
  x: number;
  y: number;
  radius: number;
  phase: number;
};

export type AtlasEdge = { source: number; target: number; strong: boolean };

export type AtlasGraph = {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  index: Map<string, number>;
  neighbours: number[][];
};

export const groupLabels: Record<NodeGroup, string> = {
  core: "Protocol core",
  primitive: "Primitives",
  security: "Trust and access",
  ecosystem: "Ecosystem",
  document: "Source notes",
};

export const groupOrder: NodeGroup[] = ["core", "primitive", "security", "ecosystem"];

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

/**
 * Deterministic constellation layout: concept clusters on a wide ring,
 * each source note settling into a phyllotaxis halo around its concept.
 */
export function buildGraph(
  graph: GraphData | null,
  documents: KnowledgeDocumentSummary[],
  includeDocuments: boolean,
): AtlasGraph {
  const nodes: AtlasNode[] = [];
  const edges: AtlasEdge[] = [];
  const index = new Map<string, number>();

  const concepts = graph?.nodes ?? [];
  const byGroup = new Map<NodeGroup, string[]>();
  concepts.forEach((concept) => {
    const group = concept.group as NodeGroup;
    byGroup.set(group, [...(byGroup.get(group) ?? []), concept.id]);
  });

  const clusterCentre = new Map<NodeGroup, { x: number; y: number }>();
  groupOrder.forEach((group, position) => {
    const angle = (Math.PI * 2 * position) / groupOrder.length - Math.PI / 2;
    clusterCentre.set(group, { x: Math.cos(angle) * 940, y: Math.sin(angle) * 780 });
  });

  concepts.forEach((concept) => {
    const group = concept.group as NodeGroup;
    const siblings = byGroup.get(group) ?? [];
    const position = siblings.indexOf(concept.id);
    const centre = clusterCentre.get(group) ?? { x: 0, y: 0 };
    const angle = (Math.PI * 2 * position) / Math.max(siblings.length, 1) - Math.PI / 3;
    const spread = siblings.length > 1 ? 300 : 0;

    index.set(`concept:${concept.id}`, nodes.length);
    nodes.push({
      id: `concept:${concept.id}`,
      label: concept.label,
      kind: "concept",
      group,
      summary: concept.summary,
      x: centre.x + Math.cos(angle) * spread,
      y: centre.y + Math.sin(angle) * spread,
      radius: 9,
      phase: (hash(concept.id) % 1000) / 1000,
    });
  });

  (graph?.edges ?? []).forEach((edge) => {
    const source = index.get(`concept:${edge.source}`);
    const target = index.get(`concept:${edge.target}`);
    if (source === undefined || target === undefined) return;
    edges.push({ source, target, strong: true });
  });

  if (includeDocuments) {
    const conceptIdByLabel = new Map(concepts.map((concept) => [concept.label, `concept:${concept.id}`]));
    const orbitCount = new Map<string, number>();

    documents.forEach((document) => {
      const anchors = [
        ...new Set(document.concepts.map((concept) => conceptIdByLabel.get(concept)).filter(Boolean) as string[]),
      ];
      const primary = anchors[0];
      const anchorIndex = primary ? index.get(primary) : undefined;
      const anchor = anchorIndex !== undefined ? nodes[anchorIndex] : undefined;

      const seed = hash(document.id);
      const rank = orbitCount.get(primary ?? "loose") ?? 0;
      orbitCount.set(primary ?? "loose", rank + 1);

      const angle = rank * GOLDEN + (seed % 100) / 260;
      const distance = 130 + Math.sqrt(rank + 1) * 26 + (seed % 29);
      const fallbackAngle = (seed % 3600) / 3600 * Math.PI * 2;

      const position = anchor
        ? { x: anchor.x + Math.cos(angle) * distance, y: anchor.y + Math.sin(angle) * distance }
        : { x: Math.cos(fallbackAngle) * 1520, y: Math.sin(fallbackAngle) * 1280 };

      const nodeIndex = nodes.length;
      index.set(`doc:${document.id}`, nodeIndex);
      nodes.push({
        id: `doc:${document.id}`,
        label: document.title,
        kind: "document",
        group: "document",
        summary: document.excerpt,
        documentId: document.id,
        category: document.category,
        sourcePath: document.sourcePath,
        x: position.x,
        y: position.y,
        radius: 2.6,
        phase: (seed % 1000) / 1000,
      });

      anchors.slice(0, 2).forEach((anchorId) => {
        const target = index.get(anchorId);
        if (target === undefined) return;
        edges.push({ source: nodeIndex, target, strong: false });
      });
    });
  }

  const seen: Array<Set<number>> = nodes.map(() => new Set());
  edges.forEach((edge) => {
    seen[edge.source].add(edge.target);
    seen[edge.target].add(edge.source);
  });
  const neighbours = seen.map((set) => [...set]);

  return { nodes, edges, index, neighbours };
}
