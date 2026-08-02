export type AtlasGraphGroup = "core" | "primitive" | "security" | "ecosystem" | "document";

export type AtlasGraphNode = {
  id: string;
  label: string;
  kind: "concept" | "document";
  group: AtlasGraphGroup;
  summary: string;
  documentId?: string;
  category?: string;
  sourcePath?: string;
  authority?: string;
};

export type AtlasGraphEdge = {
  source: string;
  target: string;
};
