"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Graph from "graphology";
import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl,
  useCamera,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from "@react-sigma/core";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { Focus, Maximize2, Minimize2, Minus, Pause, Play, Plus } from "lucide-react";
import type { AtlasGraphEdge, AtlasGraphGroup, AtlasGraphNode } from "@/components/atlas/graph-types";

type GraphTheme = "dark" | "light";

type ConceptGraphCanvasProps = {
  nodes: AtlasGraphNode[];
  edges: AtlasGraphEdge[];
  selectedId: string;
  theme: GraphTheme;
  onSelect: (id: string) => void;
};

const groupColors: Record<GraphTheme, Record<AtlasGraphGroup, string>> = {
  dark: {
    core: "#6ea8fe",
    primitive: "#4cc9f0",
    security: "#a78bfa",
    ecosystem: "#f59e0b",
    document: "#526784",
  },
  light: {
    core: "#2563eb",
    primitive: "#0891b2",
    security: "#7c3aed",
    ecosystem: "#c76a00",
    document: "#91a4bd",
  },
};

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function buildGraph(nodes: AtlasGraphNode[], edges: AtlasGraphEdge[], theme: GraphTheme) {
  const graph = new Graph({ type: "undirected", multi: false, allowSelfLoops: false });
  const concepts = nodes.filter((node) => node.kind === "concept");
  const conceptPositions = new Map<string, { x: number; y: number }>();

  concepts.forEach((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(concepts.length, 1) - Math.PI / 2;
    const position = { x: Math.cos(angle) * 18, y: Math.sin(angle) * 18 };
    conceptPositions.set(node.id, position);
  });

  const firstConceptByDocument = new Map<string, string>();
  edges.forEach((edge) => {
    if (edge.source.startsWith("doc:") && edge.target.startsWith("concept:") && !firstConceptByDocument.has(edge.source)) {
      firstConceptByDocument.set(edge.source, edge.target);
    }
  });

  nodes.forEach((node, index) => {
    const seed = hash(node.id);
    const anchor = conceptPositions.get(firstConceptByDocument.get(node.id) ?? "");
    const angle = ((seed % 3600) / 3600) * Math.PI * 2;
    const distance = 2.4 + ((seed >>> 8) % 620) / 100;
    const fallbackAngle = (Math.PI * 2 * index) / Math.max(nodes.length, 1);
    const x = node.kind === "concept" ? conceptPositions.get(node.id)?.x ?? 0 : (anchor?.x ?? Math.cos(fallbackAngle) * 24) + Math.cos(angle) * distance;
    const y = node.kind === "concept" ? conceptPositions.get(node.id)?.y ?? 0 : (anchor?.y ?? Math.sin(fallbackAngle) * 24) + Math.sin(angle) * distance;
    graph.addNode(node.id, {
      ...node,
      x,
      y,
      size: node.kind === "concept" ? 10 : 2.4,
      color: groupColors[theme][node.group],
    });
  });

  edges.forEach((edge, index) => {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target) && !graph.hasEdge(edge.source, edge.target)) {
      graph.addUndirectedEdgeWithKey(`edge:${index}:${edge.source}:${edge.target}`, edge.source, edge.target, {
        color: theme === "dark" ? "rgba(105, 137, 180, 0.25)" : "rgba(87, 111, 145, 0.22)",
        size: edge.source.startsWith("concept:") && edge.target.startsWith("concept:") ? 1.4 : 0.55,
      });
    }
  });

  concepts.forEach((node) => {
    graph.setNodeAttribute(node.id, "size", 9 + Math.min(graph.degree(node.id) * 0.32, 8));
  });

  return graph;
}

export function ConceptGraphCanvas({ nodes, edges, selectedId, theme, onSelect }: ConceptGraphCanvasProps) {
  const graph = useMemo(() => buildGraph(nodes, edges, theme), [edges, nodes, theme]);
  const settings = useMemo(() => ({
    allowInvalidContainer: true,
    defaultEdgeColor: theme === "dark" ? "#334a68" : "#a1b2c8",
    defaultNodeColor: groupColors[theme].document,
    edgeReducer: null,
    hideEdgesOnMove: nodes.length > 600,
    hideLabelsOnMove: true,
    labelColor: { color: theme === "dark" ? "#dbe8fb" : "#17243a" },
    labelDensity: 1,
    labelFont: "IBM Plex Sans, system-ui, sans-serif",
    labelGridCellSize: 110,
    labelRenderedSizeThreshold: 6,
    nodeReducer: null,
    renderEdgeLabels: false,
    stagePadding: 54,
    zIndex: true,
  }), [nodes.length, theme]);

  return (
    <SigmaContainer graph={graph} settings={settings} className="atlas-sigma" style={{ height: "100%", width: "100%" }}>
      <GraphController selectedId={selectedId} theme={theme} nodeCount={nodes.length} onSelect={onSelect} />
      <ControlsContainer position="bottom-right" className="atlas-graph-controls">
        <ZoomControl labels={{ zoomIn: "Zoom in", zoomOut: "Zoom out", reset: "Fit entire graph" }}>
          <Plus key="in" size={17} />
          <Minus key="out" size={17} />
          <Focus key="fit" size={16} />
        </ZoomControl>
        <FullScreenControl labels={{ enter: "Enter full screen", exit: "Exit full screen" }}>
          <Maximize2 key="enter" size={16} />
          <Minimize2 key="exit" size={16} />
        </FullScreenControl>
      </ControlsContainer>
    </SigmaContainer>
  );
}

function GraphController({ selectedId, theme, nodeCount, onSelect }: { selectedId: string; theme: GraphTheme; nodeCount: number; onSelect: (id: string) => void }) {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  const { reset } = useCamera({ duration: 350 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const draggedNode = useRef<string | null>(null);
  const { start, stop, isRunning } = useWorkerLayoutForceAtlas2({
    settings: {
      adjustSizes: false,
      barnesHutOptimize: nodeCount > 250,
      gravity: nodeCount > 250 ? 1.8 : 2.8,
      linLogMode: nodeCount > 250,
      scalingRatio: nodeCount > 250 ? 12 : 7,
      slowDown: nodeCount > 250 ? 7 : 4,
      strongGravityMode: true,
    },
  });

  useEffect(() => {
    start();
    const timeout = window.setTimeout(() => {
      stop();
      reset();
    }, nodeCount > 250 ? 2600 : 1050);
    return () => {
      window.clearTimeout(timeout);
      stop();
    };
  }, [nodeCount, reset, start, stop]);

  useEffect(() => {
    const graph = sigma.getGraph();
    const activeNode = hoveredNode ?? selectedId;
    const neighbors = activeNode && graph.hasNode(activeNode) ? new Set(graph.neighbors(activeNode)) : new Set<string>();
    setSettings({
      nodeReducer: (node, data) => {
        if (!activeNode) return data;
        if (node === activeNode) return { ...data, color: groupColors[theme][data.group as AtlasGraphGroup], highlighted: true, size: Number(data.size) * 1.28, zIndex: 3 };
        if (neighbors.has(node)) return { ...data, color: groupColors[theme][data.group as AtlasGraphGroup], zIndex: 2 };
        return { ...data, color: theme === "dark" ? "#263750" : "#cad4e1", label: "", zIndex: 0 };
      },
      edgeReducer: (edge, data) => {
        if (!activeNode) return data;
        const [source, target] = graph.extremities(edge);
        const related = source === activeNode || target === activeNode;
        return related
          ? { ...data, color: theme === "dark" ? "#79b7ff" : "#2563eb", size: Math.max(Number(data.size), 1.8), zIndex: 2 }
          : { ...data, color: theme === "dark" ? "rgba(66, 86, 116, 0.11)" : "rgba(142, 157, 177, 0.13)", size: 0.35, zIndex: 0 };
      },
    });
    sigma.refresh();
  }, [hoveredNode, selectedId, setSettings, sigma, theme]);

  useEffect(() => {
    if (!selectedId || !sigma.getGraph().hasNode(selectedId)) return;
    const position = sigma.getNodeDisplayData(selectedId);
    if (position) {
      sigma.getCamera().animate({ x: position.x, y: position.y, ratio: Math.min(sigma.getCamera().ratio, 0.72) }, { duration: 420 });
    }
  }, [selectedId, sigma]);

  useEffect(() => {
    registerEvents({
      enterNode: ({ node }) => {
        setHoveredNode(node);
        sigma.getContainer().style.cursor = "pointer";
        sigma.refresh();
      },
      leaveNode: () => {
        setHoveredNode(null);
        sigma.getContainer().style.cursor = "grab";
        sigma.refresh();
      },
      clickNode: ({ node }) => onSelect(node),
      doubleClickNode: ({ node, event }) => {
        event.preventSigmaDefault();
        const position = sigma.getNodeDisplayData(node);
        if (position) sigma.getCamera().animate({ x: position.x, y: position.y, ratio: 0.35 }, { duration: 420 });
      },
      downNode: ({ node }) => {
        stop();
        draggedNode.current = node;
        sigma.getGraph().setNodeAttribute(node, "fixed", true);
        sigma.getCamera().disable();
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      mousemovebody: (event) => {
        if (!draggedNode.current) return;
        const position = sigma.viewportToGraph(event);
        sigma.getGraph().mergeNodeAttributes(draggedNode.current, position);
      },
      mouseup: () => {
        draggedNode.current = null;
        sigma.getCamera().enable();
      },
      clickStage: () => {
        setHoveredNode(null);
        sigma.refresh();
      },
    });
  }, [onSelect, registerEvents, sigma, stop]);

  return (
    <ControlsContainer position="top-right" className="atlas-layout-control">
      <button type="button" onClick={() => isRunning ? stop() : start()} title={isRunning ? "Pause force layout" : "Resume force layout"} aria-label={isRunning ? "Pause force layout" : "Resume force layout"}>
        {isRunning ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button type="button" onClick={() => reset()} title="Reset graph camera" aria-label="Reset graph camera"><Focus size={16} /></button>
    </ControlsContainer>
  );
}
