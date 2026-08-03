"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Crosshair, Minus, Plus } from "lucide-react";
import type { AtlasGraph, NodeGroup } from "@/components/atlas/graph-model";

type Camera = { x: number; y: number; scale: number };

/**
 * Fraction of a pulse cycle spent travelling the link. The remainder is the
 * flare handed to the node at the far end, which decays to nothing before the
 * next pulse leaves, so the loop never snaps.
 */
const TRAVEL = 0.82;

type ConstellationCanvasProps = {
  graph: AtlasGraph;
  selectedId: string;
  theme: "dark" | "light";
  onSelect: (id: string) => void;
};

export function ConstellationCanvas({ graph, selectedId, theme, onSelect }: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera>({ x: 0, y: 0, scale: 0.5 });
  const targetRef = useRef<Camera>({ x: 0, y: 0, scale: 0.5 });
  const hoverRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 1, height: 1 });
  const graphRef = useRef(graph);
  const selectedRef = useRef(selectedId);
  const paletteRef = useRef(readPalette(theme));

  useEffect(() => {
    graphRef.current = graph;
  }, [graph]);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  const bounds = useMemo(() => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    graph.nodes.forEach((node) => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x);
      maxY = Math.max(maxY, node.y);
    });
    if (!graph.nodes.length) return { minX: -1, minY: -1, maxX: 1, maxY: 1 };
    return { minX, minY, maxX, maxY };
  }, [graph]);

  const fit = useCallback(() => {
    const { width, height } = sizeRef.current;
    const spanX = Math.max(bounds.maxX - bounds.minX, 1);
    const spanY = Math.max(bounds.maxY - bounds.minY, 1);
    const scale = Math.min((width - 120) / spanX, (height - 120) / spanY);
    targetRef.current = {
      x: -(bounds.minX + bounds.maxX) / 2,
      y: -(bounds.minY + bounds.maxY) / 2,
      scale: Math.max(0.06, Math.min(2.2, scale)),
    };
  }, [bounds]);

  useEffect(() => {
    paletteRef.current = readPalette(theme);
  }, [theme]);

  /* Size + device pixel ratio */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    resize();
    fit();
    cameraRef.current = { ...targetRef.current };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [fit]);

  /* Focus the selection */
  useEffect(() => {
    if (!selectedId) return;
    const nodeIndex = graph.index.get(selectedId);
    if (nodeIndex === undefined) return;
    const node = graph.nodes[nodeIndex];
    targetRef.current = {
      x: -node.x,
      y: -node.y,
      scale: Math.max(cameraRef.current.scale, node.kind === "concept" ? 0.42 : 0.8),
    };
  }, [graph, selectedId]);

  /* Render loop */
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frame = 0;
    const start = performance.now();

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const time = (now - start) / 1000;
      const camera = cameraRef.current;
      const target = targetRef.current;
      camera.x += (target.x - camera.x) * 0.12;
      camera.y += (target.y - camera.y) * 0.12;
      camera.scale += (target.scale - camera.scale) * 0.12;

      const { width, height } = sizeRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const palette = paletteRef.current;
      const { nodes, edges, neighbours, index } = graphRef.current;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(
        dpr * camera.scale,
        0,
        0,
        dpr * camera.scale,
        dpr * (width / 2 + camera.x * camera.scale),
        dpr * (height / 2 + camera.y * camera.scale),
      );

      const activeIndex = hoverRef.current ?? index.get(selectedRef.current) ?? null;
      const related = new Set<number>();
      if (activeIndex !== null && neighbours[activeIndex]) {
        neighbours[activeIndex].forEach((item) => related.add(item));
      }

      const wobble = (i: number) => Math.sin(time * 0.5 + nodes[i].phase * Math.PI * 2) * 3;

      /*
       * How brightly each node is lit by a pulse that has just reached it.
       * Filled while the active node's links are drawn, read when nodes are.
       */
      const arrival = new Map<number, number>();

      /* Edges, dim pass */
      context.lineWidth = 1 / camera.scale;
      context.strokeStyle = palette.faint;
      context.beginPath();
      edges.forEach((edge) => {
        if (activeIndex !== null && (edge.source === activeIndex || edge.target === activeIndex)) return;
        const a = nodes[edge.source];
        const b = nodes[edge.target];
        if (!edge.strong && camera.scale < 0.24) return;
        context.moveTo(a.x, a.y + wobble(edge.source));
        context.lineTo(b.x, b.y + wobble(edge.target));
      });
      context.stroke();

      /* Edges, active pass: the lit links plus the energy running along them */
      if (activeIndex !== null) {
        const colour = palette[nodes[activeIndex].group];
        const source = nodes[activeIndex];
        const sx = source.x;
        const sy = source.y + wobble(activeIndex);

        context.lineWidth = 1.6 / camera.scale;
        context.strokeStyle = withAlpha(colour, 0.75);
        context.beginPath();
        edges.forEach((edge) => {
          if (edge.source !== activeIndex && edge.target !== activeIndex) return;
          const a = nodes[edge.source];
          const b = nodes[edge.target];
          context.moveTo(a.x, a.y + wobble(edge.source));
          context.lineTo(b.x, b.y + wobble(edge.target));
        });
        context.stroke();

        /*
         * A pulse leaves the active node, travels the link, then hands its
         * remaining energy to the far node as a short flare. Each link is
         * offset so the pulses do not fire in unison.
         */
        context.save();
        context.fillStyle = colour;
        context.shadowColor = colour;
        context.shadowBlur = 12 / camera.scale;
        edges.forEach((edge, e) => {
          if (edge.source !== activeIndex && edge.target !== activeIndex) return;
          const farIndex = edge.source === activeIndex ? edge.target : edge.source;
          const far = nodes[farIndex];
          const phase = (time * 0.5 + (e % 9) / 9) % 1;

          if (phase >= TRAVEL) {
            const decay = 1 - (phase - TRAVEL) / (1 - TRAVEL);
            arrival.set(farIndex, Math.max(arrival.get(farIndex) ?? 0, decay));
            return;
          }

          const progress = phase / TRAVEL;
          context.globalAlpha = Math.min(1, Math.sin(Math.PI * progress) * 1.8);
          context.beginPath();
          context.arc(
            sx + (far.x - sx) * progress,
            sy + (far.y + wobble(farIndex) - sy) * progress,
            2.4 / camera.scale,
            0,
            Math.PI * 2,
          );
          context.fill();
        });
        context.restore();
      }

      /* Document nodes */
      nodes.forEach((node, i) => {
        if (node.kind !== "document") return;
        const dim = activeIndex !== null && i !== activeIndex && !related.has(i);
        const lit = arrival.get(i) ?? 0;
        const radius = Math.max(1.1, (node.radius + lit * 1.6) / camera.scale);

        context.save();
        if (lit > 0) {
          context.shadowColor = palette[nodes[activeIndex ?? i].group];
          context.shadowBlur = (lit * 14) / camera.scale;
        }
        context.fillStyle = dim && lit === 0 ? palette.ghost : related.has(i) ? palette.note : palette.noteSoft;
        context.beginPath();
        context.arc(node.x, node.y + wobble(i), radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });

      /*
       * Concept nodes carry no ambient glow. Only the node under the pointer
       * lights up, plus whichever neighbour a pulse has just reached.
       */
      nodes.forEach((node, i) => {
        if (node.kind !== "concept") return;
        const dim = activeIndex !== null && i !== activeIndex && !related.has(i);
        const colour = palette[node.group];
        const isActive = i === activeIndex;
        const lit = arrival.get(i) ?? 0;
        const radius = (node.radius + (isActive ? 3.4 : 0) + lit * 1.8) / camera.scale;

        context.save();
        context.globalAlpha = dim ? 0.4 : 1;
        context.shadowBlur = ((isActive ? 24 : 0) + lit * 20) / camera.scale;
        context.shadowColor = colour;
        context.fillStyle = colour;
        context.beginPath();
        context.arc(node.x, node.y + wobble(i), radius, 0, Math.PI * 2);
        context.fill();
        context.restore();

        if (isActive) {
          context.lineWidth = 1.2 / camera.scale;
          context.strokeStyle = withAlpha(colour, 0.5);
          context.beginPath();
          context.arc(node.x, node.y + wobble(i), radius + (10 + Math.sin(time * 2) * 3) / camera.scale, 0, Math.PI * 2);
          context.stroke();
        }
      });

      /* Labels, set on a soft plate so they stay legible over note clouds */
      context.save();
      context.textAlign = "center";
      context.textBaseline = "top";

      // Draw the active label first, then anything that still has room.
      const order = nodes.map((_, i) => i).sort((a, b) => Number(b === activeIndex) - Number(a === activeIndex));
      const placed: Array<[number, number, number, number]> = [];

      order.forEach((i) => {
        const node = nodes[i];
        const isActive = i === activeIndex;
        if (node.kind === "document" && !isActive) return;
        const dim = activeIndex !== null && !isActive && !related.has(i);
        const size = (node.kind === "concept" ? 13 : 11.5) / camera.scale;
        context.font = `${node.kind === "concept" ? 500 : 400} ${size}px ${palette.font}`;
        const label = node.label.length > 42 ? `${node.label.slice(0, 40)}…` : node.label;
        const y = node.y + wobble(i) + (node.radius + 8) / camera.scale;

        const half = context.measureText(label).width / 2 + 6 / camera.scale;
        const rect: [number, number, number, number] = [node.x - half, y, node.x + half, y + size * 1.4];
        const collides = placed.some(
          ([left, top, right, bottom]) => rect[0] < right && rect[2] > left && rect[1] < bottom && rect[3] > top,
        );
        if (collides && !isActive) return;
        placed.push(rect);

        if (!dim) {
          const padding = 6 / camera.scale;
          const width = context.measureText(label).width;
          context.fillStyle = withAlpha(palette.paper, 0.72);
          context.beginPath();
          context.roundRect(
            node.x - width / 2 - padding,
            y - padding * 0.6,
            width + padding * 2,
            size * 1.3 + padding,
            5 / camera.scale,
          );
          context.fill();
        }

        context.fillStyle = dim ? palette.ghostText : isActive ? palette.text : palette.label;
        context.fillText(label, node.x, y);
      });
      context.restore();
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Pointer interaction */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;

    const toWorld = (event: PointerEvent | WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      const camera = cameraRef.current;
      const { width, height } = sizeRef.current;
      return {
        x: (event.clientX - rect.left - width / 2) / camera.scale - camera.x,
        y: (event.clientY - rect.top - height / 2) / camera.scale - camera.y,
      };
    };

    const pick = (event: PointerEvent) => {
      const point = toWorld(event);
      const { nodes } = graphRef.current;
      const tolerance = 10 / cameraRef.current.scale;
      let best: number | null = null;
      let bestDistance = Infinity;
      for (let i = 0; i < nodes.length; i += 1) {
        const dx = nodes[i].x - point.x;
        const dy = nodes[i].y - point.y;
        const distance = Math.hypot(dx, dy);
        const reach = nodes[i].radius / cameraRef.current.scale + tolerance;
        if (distance < reach && distance < bestDistance) {
          best = i;
          bestDistance = distance;
        }
      }
      return best;
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (dragging) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        lastX = event.clientX;
        lastY = event.clientY;
        const camera = cameraRef.current;
        camera.x += dx / camera.scale;
        camera.y += dy / camera.scale;
        targetRef.current = { ...camera };
        return;
      }
      const hit = pick(event);
      hoverRef.current = hit;
      canvas.style.cursor = hit === null ? "grab" : "pointer";
    };

    const onPointerUp = (event: PointerEvent) => {
      if (dragging && moved < 5) {
        const hit = pick(event);
        if (hit !== null) onSelect(graphRef.current.nodes[hit].id);
      }
      dragging = false;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const camera = cameraRef.current;
      const before = toWorld(event);
      const next = Math.max(0.05, Math.min(3.4, camera.scale * Math.exp(-event.deltaY * 0.0016)));
      camera.scale = next;
      const after = toWorld(event);
      camera.x += after.x - before.x;
      camera.y += after.y - before.y;
      targetRef.current = { ...camera };
    };

    const onLeave = () => {
      hoverRef.current = null;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [onSelect]);

  const zoom = (factor: number) => {
    const camera = cameraRef.current;
    targetRef.current = { ...camera, scale: Math.max(0.05, Math.min(3.4, camera.scale * factor)) };
  };

  return (
    <>
      <canvas ref={canvasRef} aria-label="Interactive knowledge constellation" />
      <div className="canvas-tools">
        <button className="icon-btn" type="button" onClick={() => zoom(1.35)} aria-label="Zoom in">
          <Plus size={16} />
        </button>
        <button className="icon-btn" type="button" onClick={() => zoom(0.74)} aria-label="Zoom out">
          <Minus size={16} />
        </button>
        <button className="icon-btn" type="button" onClick={fit} aria-label="Fit the whole graph">
          <Crosshair size={15} />
        </button>
      </div>
    </>
  );
}

type Palette = Record<NodeGroup, string> & {
  faint: string;
  note: string;
  noteSoft: string;
  ghost: string;
  ghostText: string;
  label: string;
  text: string;
  paper: string;
  font: string;
};

function readPalette(theme: "dark" | "light"): Palette {
  const fallback: Palette = {
    core: "#8e7bff",
    primitive: "#55e0d5",
    security: "#ff8cae",
    ecosystem: "#ffc978",
    document: "#8b91ad",
    faint: "rgba(140,150,190,0.16)",
    note: "#c9cde3",
    noteSoft: "rgba(150,158,196,0.62)",
    ghost: "rgba(120,128,165,0.18)",
    ghostText: "rgba(120,128,165,0.3)",
    label: "#a7acc6",
    text: "#edeef7",
    paper: "#06070e",
    font: "ui-sans-serif, system-ui, sans-serif",
  };

  if (typeof window === "undefined") return fallback;

  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, backup: string) => styles.getPropertyValue(name).trim() || backup;
  const light = theme === "light";

  return {
    core: read("--iris", fallback.core),
    primitive: read("--aqua", fallback.primitive),
    security: read("--rose", fallback.security),
    ecosystem: read("--gold", fallback.ecosystem),
    document: read("--text-3", fallback.document),
    faint: light ? "rgba(60,70,110,0.16)" : "rgba(150,165,215,0.14)",
    note: read("--text-2", fallback.note),
    noteSoft: light ? "rgba(90,98,130,0.55)" : "rgba(150,158,196,0.55)",
    ghost: light ? "rgba(90,98,130,0.14)" : "rgba(120,128,165,0.16)",
    ghostText: light ? "rgba(90,98,130,0.28)" : "rgba(120,128,165,0.28)",
    label: read("--text-3", fallback.label),
    text: read("--text", fallback.text),
    paper: read("--paper", fallback.paper),
    font: read("--font-sans-stack", fallback.font) || fallback.font,
  };
}

function withAlpha(colour: string, alpha: number) {
  if (colour.startsWith("#")) {
    const hex = colour.slice(1);
    const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
    const value = parseInt(full.slice(0, 6), 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  }
  if (colour.startsWith("rgb")) {
    const parts = colour.replace(/rgba?\(|\)/g, "").split(/[\s,/]+/).filter(Boolean);
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
  }
  return colour;
}
