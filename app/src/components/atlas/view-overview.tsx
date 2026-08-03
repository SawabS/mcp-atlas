"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  BookOpen,
  GitCommitHorizontal,
  Radio,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { Mark } from "@/components/atlas/mark";
import { Reveal, useLit } from "@/components/atlas/motion";
import type { CorpusStats, KnowledgeDocumentSummary } from "@/lib/knowledge-types";

type OverviewProps = {
  stats: CorpusStats | null;
  documents: KnowledgeDocumentSummary[];
  onBrowse: (category?: string) => void;
  onOpen: (id: string) => void;
  onAsk: (question?: string) => void;
};

export function Overview({ stats, documents, onBrowse, onOpen, onAsk }: OverviewProps) {
  const lit = useLit();

  const featured = useMemo(() => {
    const spec = documents.filter((document) => document.category === "Specification");
    const current = spec.filter((document) => document.sourcePath.includes("2026-07-28"));
    return (current.length ? current : spec).slice(0, 5);
  }, [documents]);

  const ways = [
    {
      label: "Specification",
      hue: "var(--iris)",
      tint: "var(--iris-soft)",
      icon: ScrollText,
      count: stats?.categories.Specification,
      unit: "documents",
      copy: "Read the normative protocol text, revision by revision.",
    },
    {
      label: "SDKs",
      hue: "var(--aqua)",
      tint: "var(--aqua-soft)",
      icon: BookOpen,
      count: stats?.categories.SDKs,
      unit: "documents",
      copy: "Compare official client and server libraries across languages.",
    },
    {
      label: "Reference servers",
      hue: "var(--rose)",
      tint: "var(--rose-soft)",
      icon: Radio,
      count: stats?.categories["Reference servers"],
      unit: "documents",
      copy: "Study the implementations the maintainers ship themselves.",
    },
    {
      label: "Registry",
      hue: "var(--gold)",
      tint: "var(--gold-soft)",
      icon: Boxes,
      count: stats?.registryServers,
      unit: "active servers",
      copy: "Browse the live catalogue of packaged and remote servers.",
    },
  ];

  return (
    <div className="view">
      <section className="hero">
        <Reveal className="hero-copy">
          <span className="eyebrow">
            <i className="spark" /> Model Context Protocol · living atlas
          </span>
          <h1 className="display">
            The protocol,
            <br />
            <em>made navigable.</em>
          </h1>
          <p className="lede">
            Specification, SDKs, reference servers and the live Registry, cross-linked into a single
            atlas where every claim stays pinned to the commit it came from.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" type="button" onClick={() => onBrowse()}>
              Explore the library <ArrowRight size={16} />
            </button>
            <button className="btn" type="button" onClick={() => onAsk()}>
              <Sparkles size={15} /> Ask Atlas anything
            </button>
          </div>
          <dl className="hero-stats">
            <Stat label="Documents" value={stats?.documents} />
            <Stat label="Passages" value={stats?.retrievalChunks} />
            <Stat label="Servers" value={stats?.registryServers} />
            <Stat label="Repositories" value={stats?.repositories} />
          </dl>
        </Reveal>

        <Reveal className="hero-art" delay={140}>
          <Orbit />
        </Reveal>
      </section>

      <Reveal as="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Four ways in</span>
            <h2 className="title">
              Start where your question <em>lives</em>
            </h2>
          </div>
          <button className="link-arrow" type="button" onClick={() => onBrowse()}>
            All documents <ArrowRight size={15} />
          </button>
        </div>
        <div className="ways">
          {ways.map((way) => {
            const Icon = way.icon;
            return (
              <button
                key={way.label}
                type="button"
                className="card way lit"
                onPointerMove={lit}
                onClick={() => onBrowse(way.label)}
                style={{ "--hue": way.hue, "--tint": way.tint } as React.CSSProperties}
              >
                <span className="way-glyph">
                  <Icon size={19} />
                </span>
                <h3>{way.label}</h3>
                <p>{way.copy}</p>
                <span className="way-meta">
                  <b>{way.count ? way.count.toLocaleString("en-US") : "···"}</b>
                  {way.unit}
                  <ArrowRight size={15} />
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <section className="split">
        <Reveal>
          <div className="section-head">
            <div>
              <span className="eyebrow">Current specification</span>
              <h2 className="title">
                Read it from the <em>source</em>
              </h2>
            </div>
          </div>
          <div className="paperlist">
            {(featured.length ? featured : placeholders).map((document, index) => (
              <button
                key={document.id || `placeholder-${index}`}
                type="button"
                onClick={() => document.id && onOpen(document.id)}
                disabled={!document.id}
              >
                <span className="idx">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{document.title}</strong>
                  <small>{document.sourcePath}</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="pane aside-card lit" onPointerMove={lit}>
            <span className="eyebrow">
              <GitCommitHorizontal size={14} /> Provenance
            </span>
            <h3>Nothing here is paraphrased into thin air.</h3>
            <p>
              Every note carries its repository, path, licence and exact commit. Answers cite the passage
              they came from, so you can always check the primary text yourself.
            </p>
            <div className="proof">
              <span>Pinned commit</span>
              <code>{featured[0]?.commit?.slice(0, 24) ?? "73763114e511106fc07543"}</code>
            </div>
            <div className="aside-links">
              <button type="button" onClick={() => onBrowse("Core documentation")}>
                Core documentation <ArrowRight size={15} />
              </button>
              <button type="button" onClick={() => onBrowse("Extensions")}>
                Protocol extensions <ArrowRight size={15} />
              </button>
              <button type="button" onClick={() => onAsk("How does MCP negotiate capabilities during initialization?")}>
                Ask a grounded question <Sparkles size={15} />
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

const placeholders = Array.from({ length: 5 }, (_, index) => ({
  id: "",
  title: "Loading specification sources",
  sourcePath: "docs/specification",
  commit: null as string | null,
  index,
}));

function Stat({ label, value }: { label: string; value?: number }) {
  const shown = useCountUp(value ?? 0);
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value ? shown.toLocaleString("en-US") : "···"}</dd>
    </div>
  );
}

/** Eases a number up to its final value once the data lands. */
function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [duration, target]);

  return value;
}

/** Decorative protocol orbit. */
function Orbit() {
  return (
    <div className="orbit">
      <div className="orbit-halo" />

      <Ring
        inset="4%"
        speed="46s"
        direction="normal"
        hue="var(--iris)"
        bodies={[
          ["18deg", "var(--iris)"],
          ["152deg", "var(--aqua)"],
        ]}
      />
      <Ring
        inset="19%"
        speed="34s"
        direction="reverse"
        hue="var(--aqua)"
        bodies={[
          ["74deg", "var(--aqua)"],
          ["248deg", "var(--rose)"],
        ]}
      />
      <Ring inset="33%" speed="25s" direction="normal" hue="var(--rose)" bodies={[["206deg", "var(--rose)"]]} />

      <div className="orbit-core">
        <Mark />
      </div>

      <span className="orbit-caption drift-a" data-cursor="orbit-label" style={{ top: "6%", left: "2%" }}>
        Tools
      </span>
      <span className="orbit-caption drift-b" data-cursor="orbit-label" style={{ top: "44%", right: "-4%" }}>
        Resources
      </span>
      <span className="orbit-caption drift-c" data-cursor="orbit-label" style={{ bottom: "8%", left: "12%" }}>
        Prompts
      </span>
    </div>
  );
}

/**
 * One orbit: a fixed path plus a separate layer carrying the bodies. They share
 * a period, so they stay in step while the bodies pass in front of the core.
 */
function Ring({
  inset,
  speed,
  direction,
  hue,
  bodies,
}: {
  inset: string;
  speed: string;
  direction: "normal" | "reverse";
  hue: string;
  bodies: Array<[string, string]>;
}) {
  const track = {
    "--inset": inset,
    "--speed": speed,
    "--direction": direction,
    "--hue": hue,
  } as React.CSSProperties;
  return (
    <>
      <div className="orbit-ring" style={track} />
      <div className="orbit-orbiters" style={track} aria-hidden="true">
        {bodies.map(([angle, bodyHue]) => (
          <span key={angle} className="orbit-node" style={{ "--a": angle, "--hue": bodyHue } as React.CSSProperties} />
        ))}
      </div>
    </>
  );
}
