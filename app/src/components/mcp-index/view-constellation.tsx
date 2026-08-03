"use client";

import { useDeferredValue, useMemo, useState, type CSSProperties } from "react";
import { ArrowRight, BookOpen, FileText, Hand, Search, Waypoints } from "lucide-react";
import { ConstellationCanvas } from "@/components/atlas/constellation-canvas";
import { buildGraph, groupLabels, groupOrder, type NodeGroup } from "@/components/atlas/graph-model";
import type { GraphData, KnowledgeDocumentSummary } from "@/lib/knowledge-types";

const hues: Record<NodeGroup, string> = {
  core: "var(--iris)",
  primitive: "var(--aqua)",
  security: "var(--rose)",
  ecosystem: "var(--gold)",
  document: "var(--text-3)",
};

type ConstellationProps = {
  graph: GraphData | null;
  documents: KnowledgeDocumentSummary[];
  theme: "dark" | "light";
  onExplore: (concept: string) => void;
  onOpen: (id: string) => void;
};

export function Constellation({ graph, documents, theme, onExplore, onOpen }: ConstellationProps) {
  const [mode, setMode] = useState<"concepts" | "notes">("concepts");
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());

  const model = useMemo(() => buildGraph(graph, documents, mode === "notes"), [documents, graph, mode]);

  const selected = useMemo(() => {
    if (!selectedId) return undefined;
    const nodeIndex = model.index.get(selectedId);
    return nodeIndex === undefined ? undefined : model.nodes[nodeIndex];
  }, [model, selectedId]);

  const related = useMemo(() => {
    if (!selected) return [];
    const nodeIndex = model.index.get(selected.id);
    if (nodeIndex === undefined) return [];
    return (model.neighbours[nodeIndex] ?? [])
      .map((item) => model.nodes[item])
      .sort((a, b) => a.kind.localeCompare(b.kind) || a.label.localeCompare(b.label))
      .slice(0, 12);
  }, [model, selected]);

  const matches = useMemo(() => {
    if (!deferred) return [];
    return model.nodes
      .filter((node) => `${node.label} ${node.category ?? ""} ${node.sourcePath ?? ""}`.toLowerCase().includes(deferred))
      .slice(0, 10);
  }, [deferred, model]);

  const concepts = model.nodes.filter((node) => node.kind === "concept").length;

  return (
    <div className="view">
      <section>
        <header className="page-head">
          <div>
            <span className="eyebrow">Connected knowledge</span>
            <h1 className="title">
              The protocol as a <em>constellation</em>
            </h1>
            <p className="lede">
              Sixteen core concepts, every source note orbiting the ideas it explains. Drag to travel,
              scroll to zoom, click a star to read it.
            </p>
          </div>
          <div className="legend">
            {groupOrder.map((group) => (
              <span key={group} style={{ "--hue": hues[group] } as CSSProperties}>
                <i />
                {groupLabels[group]}
              </span>
            ))}
            {mode === "notes" && (
              <span style={{ "--hue": hues.document } as CSSProperties}>
                <i />
                {groupLabels.document}
              </span>
            )}
          </div>
        </header>

        <div className="graph-bar">
          <div className="switch">
            <button
              type="button"
              className={mode === "concepts" ? "is-on" : ""}
              onClick={() => {
                setMode("concepts");
                setSelectedId("");
              }}
            >
              <Waypoints size={15} /> Concepts <small>{concepts}</small>
            </button>
            <button
              type="button"
              className={mode === "notes" ? "is-on" : ""}
              onClick={() => {
                setMode("notes");
                setSelectedId("");
              }}
            >
              <FileText size={15} /> Every note <small>{(concepts + documents.length).toLocaleString("en-US")}</small>
            </button>
          </div>

          <div className="finder">
            <label className="field">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={mode === "notes" ? "Find a concept or note" : "Find a concept"}
                aria-label="Find a node"
              />
            </label>
            {query && (
              <div className="finder-results">
                {matches.length ? (
                  matches.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(node.id);
                        setQuery("");
                      }}
                      style={{ "--hue": hues[node.group] } as CSSProperties}
                    >
                      <i />
                      <span>{node.label}</span>
                      <small>{node.kind === "concept" ? groupLabels[node.group] : node.category}</small>
                    </button>
                  ))
                ) : (
                  <button type="button" disabled style={{ color: "var(--text-3)" }}>
                    No matching nodes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="constellation">
          <div className="canvas-wrap">
            {graph ? (
              <ConstellationCanvas
                graph={model}
                selectedId={selectedId}
                theme={theme}
                onSelect={setSelectedId}
              />
            ) : (
              <div className="loading">
                <Waypoints size={22} className="spin" />
                <h3>Charting the constellation</h3>
              </div>
            )}
            <div className="canvas-hint">
              <Hand size={13} /> Drag to pan · scroll to zoom · click a node
            </div>
          </div>

          <aside className="pane node-panel" aria-live="polite">
            {selected ? (
              <>
                <span className="node-glyph" style={{ "--hue": hues[selected.group] } as CSSProperties}>
                  {selected.kind === "concept" ? <Waypoints size={19} /> : <BookOpen size={19} />}
                </span>
                <div>
                  <span className="eyebrow">
                    {selected.kind === "concept" ? groupLabels[selected.group] : selected.category}
                  </span>
                  <h3>{selected.label}</h3>
                </div>
                <p>{selected.summary}</p>

                {selected.sourcePath && (
                  <div className="proof">
                    <span>Source path</span>
                    <code>{selected.sourcePath}</code>
                  </div>
                )}

                <div>
                  <span className="eyebrow">Direct connections</span>
                  <div className="node-links">
                    {related.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedId(node.id)}
                        style={{ "--hue": hues[node.group] } as CSSProperties}
                      >
                        <i />
                        <span>{node.label}</span>
                        <small>{node.kind === "concept" ? "concept" : "note"}</small>
                      </button>
                    ))}
                  </div>
                </div>

                {selected.kind === "concept" ? (
                  <button className="btn btn-primary btn-sm" type="button" onClick={() => onExplore(selected.label)}>
                    Explore sources <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={() => selected.documentId && onOpen(selected.documentId)}
                  >
                    Open source note <BookOpen size={15} />
                  </button>
                )}
              </>
            ) : (
              <div className="node-empty">
                <span className="node-glyph" style={{ "--hue": "var(--iris)" } as CSSProperties}>
                  <Waypoints size={19} />
                </span>
                <div>
                  <span className="eyebrow">Whole constellation</span>
                  <h3>Everything in view</h3>
                </div>
                <p>
                  Nothing is selected yet. Hover a star to trace its connections, or click one to keep
                  it in focus and inspect its sources.
                </p>
                <div className="node-overview" aria-label="Graph summary">
                  <span>
                    <b>{concepts}</b> concepts
                  </span>
                  <span>
                    <b>{model.edges.length}</b> connections
                  </span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
