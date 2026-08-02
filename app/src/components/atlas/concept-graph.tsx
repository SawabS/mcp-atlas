"use client";

import dynamic from "next/dynamic";
import { useDeferredValue, useMemo, useState } from "react";
import { ArrowRight, BookOpenText, FileText, GitBranch, Network, Search, Sparkles } from "lucide-react";
import type { AtlasGraphEdge, AtlasGraphGroup, AtlasGraphNode } from "@/components/atlas/graph-types";
import type { GraphData, KnowledgeDocumentSummary } from "@/lib/knowledge-types";

const InteractiveGraph = dynamic(
  () => import("@/components/atlas/concept-graph-canvas").then((module) => module.ConceptGraphCanvas),
  { ssr: false, loading: () => <div className="graph-loading"><Network className="animate-pulse" /><span>Building the interactive graph...</span></div> },
);

const groupLabels: Record<AtlasGraphGroup, string> = {
  core: "Protocol core",
  primitive: "Primitives",
  security: "Trust and access",
  ecosystem: "Ecosystem",
  document: "Source notes",
};

type ConceptGraphProps = {
  graph: GraphData | null;
  documents: KnowledgeDocumentSummary[];
  theme: "dark" | "light";
  onExplore: (concept: string) => void;
  onOpenDocument: (id: string) => void;
  onAsk: (question: string) => void;
};

export function ConceptGraph({ graph, documents, theme, onExplore, onOpenDocument, onAsk }: ConceptGraphProps) {
  const [mode, setMode] = useState<"concepts" | "notes">("concepts");
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const conceptNodes = useMemo<AtlasGraphNode[]>(() => (graph?.nodes ?? []).map((node) => ({
    id: `concept:${node.id}`,
    label: node.label,
    kind: "concept",
    group: node.group,
    summary: node.summary,
  })), [graph]);

  const conceptIdByLabel = useMemo(() => new Map(conceptNodes.map((node) => [node.label, node.id])), [conceptNodes]);
  const nodes = useMemo<AtlasGraphNode[]>(() => {
    if (mode === "concepts") return conceptNodes;
    const documentNodes = documents.map<AtlasGraphNode>((document) => ({
      id: `doc:${document.id}`,
      label: document.title,
      kind: "document",
      group: "document",
      summary: document.excerpt,
      documentId: document.id,
      category: document.category,
      sourcePath: document.sourcePath,
      authority: document.authority,
    }));
    return [...conceptNodes, ...documentNodes];
  }, [conceptNodes, documents, mode]);

  const edges = useMemo<AtlasGraphEdge[]>(() => {
    const conceptEdges = (graph?.edges ?? []).map((edge) => ({ source: `concept:${edge.source}`, target: `concept:${edge.target}` }));
    if (mode === "concepts") return conceptEdges;
    const documentEdges = documents.flatMap((document) => document.concepts.slice(0, 3).flatMap((concept) => {
      const conceptId = conceptIdByLabel.get(concept);
      return conceptId ? [{ source: `doc:${document.id}`, target: conceptId }] : [];
    }));
    return [...conceptEdges, ...documentEdges];
  }, [conceptIdByLabel, documents, graph, mode]);

  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    edges.forEach((edge) => {
      if (!map.has(edge.source)) map.set(edge.source, new Set());
      if (!map.has(edge.target)) map.set(edge.target, new Set());
      map.get(edge.source)?.add(edge.target);
      map.get(edge.target)?.add(edge.source);
    });
    return map;
  }, [edges]);
  const selected = nodeMap.get(selectedId) ?? conceptNodes[0];
  const related = useMemo(() => [...(adjacency.get(selected?.id ?? "") ?? [])]
    .map((id) => nodeMap.get(id))
    .filter(Boolean)
    .sort((left, right) => left!.kind.localeCompare(right!.kind) || left!.label.localeCompare(right!.label))
    .slice(0, 10) as AtlasGraphNode[], [adjacency, nodeMap, selected?.id]);

  const searchResults = useMemo(() => {
    if (!deferredQuery) return [];
    return nodes.filter((node) => `${node.label} ${node.category ?? ""} ${node.sourcePath ?? ""}`.toLowerCase().includes(deferredQuery)).slice(0, 12);
  }, [deferredQuery, nodes]);

  const selectMode = (nextMode: "concepts" | "notes") => {
    setMode(nextMode);
    setSelectedId("");
    setQuery("");
  };

  const selectSearchResult = (node: AtlasGraphNode) => {
    setSelectedId(node.id);
    setQuery("");
  };

  return (
    <div className="content-page graph-page">
      <header className="page-header graph-page-header"><div><span className="eyebrow">Connected knowledge</span><h1>Knowledge graph</h1><p>Pan, zoom, drag, search, and follow links across the MCP knowledge base.</p></div><div className="graph-legend">{Object.entries(groupLabels).filter(([key]) => mode === "notes" || key !== "document").map(([key, value]) => <span key={key} className={`legend-${key}`}><i />{value}</span>)}</div></header>
      <div className="graph-toolbar">
        <div className="graph-mode-switch" aria-label="Graph scope">
          <button type="button" className={mode === "concepts" ? "is-active" : ""} onClick={() => selectMode("concepts")}><Network size={16} /> Concepts <span>{conceptNodes.length}</span></button>
          <button type="button" className={mode === "notes" ? "is-active" : ""} onClick={() => selectMode("notes")}><FileText size={16} /> All notes <span>{(conceptNodes.length + documents.length).toLocaleString()}</span></button>
        </div>
        <div className="graph-search-wrap">
          <label className="graph-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={mode === "notes" ? "Find a concept or source note" : "Find a concept"} /></label>
          {query && <div className="graph-search-results">{searchResults.length ? searchResults.map((node) => <button type="button" key={node.id} onClick={() => selectSearchResult(node)}><span className={`graph-result-dot group-${node.group}`} /><span><strong>{node.label}</strong><small>{node.kind === "concept" ? groupLabels[node.group] : node.category}</small></span><ArrowRight size={14} /></button>) : <p>No matching nodes</p>}</div>}
        </div>
        <div className="graph-stat"><GitBranch size={15} /><span><b>{nodes.length.toLocaleString()}</b> nodes</span><span><b>{edges.length.toLocaleString()}</b> links</span></div>
      </div>
      <div className="graph-workspace">
        <div className="graph-canvas">
          <div className="graph-canvas-grid" />
          {graph ? <InteractiveGraph key={mode} nodes={nodes} edges={edges} selectedId={selectedId} theme={theme} onSelect={setSelectedId} /> : <div className="graph-loading"><Network className="animate-pulse" /><span>Loading graph data...</span></div>}
          <div className="graph-hint"><GitBranch size={14} /> Drag nodes, scroll to zoom, double-click to focus</div>
        </div>
        <aside className="concept-panel" aria-live="polite">
          {selected?.kind === "document"
            ? <DocumentDetail node={selected} related={related} onSelect={setSelectedId} onOpenDocument={onOpenDocument} onAsk={onAsk} />
            : selected && <ConceptDetail node={selected} related={related} onSelect={setSelectedId} onExplore={onExplore} onAsk={onAsk} />}
        </aside>
      </div>
    </div>
  );
}

function ConceptDetail({ node, related, onSelect, onExplore, onAsk }: { node: AtlasGraphNode; related: AtlasGraphNode[]; onSelect: (id: string) => void; onExplore: (concept: string) => void; onAsk: (question: string) => void }) {
  return <><div className={`concept-symbol group-${node.group}`}><Network size={22} /></div><span className="eyebrow">{groupLabels[node.group]}</span><h2>{node.label}</h2><p>{node.summary}</p><div className="related-concepts"><span className="eyebrow">Direct connections</span>{related.map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)}><i className={`group-${item.group}`} /><span>{item.label}</span><small>{item.kind === "document" ? "note" : "concept"}</small></button>)}</div><div className="concept-actions"><button className="primary-action" type="button" onClick={() => onExplore(node.label)}>Explore sources <ArrowRight size={15} /></button><button className="secondary-action" type="button" onClick={() => onAsk(`Explain ${node.label} in MCP and how it connects to ${related.filter((item) => item.kind === "concept").slice(0, 3).map((item) => item.label).join(", ")}.`)}><Sparkles size={15} /> Ask Atlas</button></div></>;
}

function DocumentDetail({ node, related, onSelect, onOpenDocument, onAsk }: { node: AtlasGraphNode; related: AtlasGraphNode[]; onSelect: (id: string) => void; onOpenDocument: (id: string) => void; onAsk: (question: string) => void }) {
  return <><div className="concept-symbol group-document"><BookOpenText size={22} /></div><span className="eyebrow">{node.category}</span><h2>{node.label}</h2><p>{node.summary}</p>{node.sourcePath && <code className="graph-source-path">{node.sourcePath}</code>}<div className="related-concepts"><span className="eyebrow">Connected concepts</span>{related.map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)}><i className={`group-${item.group}`} /><span>{item.label}</span><small>concept</small></button>)}</div><div className="concept-actions"><button className="primary-action" type="button" onClick={() => node.documentId && onOpenDocument(node.documentId)}>Open source note <BookOpenText size={15} /></button><button className="secondary-action" type="button" onClick={() => onAsk(`Summarize the MCP source titled ${node.label} and explain its practical importance.`)}><Sparkles size={15} /> Ask Atlas</button></div></>;
}
