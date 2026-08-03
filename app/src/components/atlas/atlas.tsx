"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Ask } from "@/components/atlas/ask";
import { Constellation } from "@/components/atlas/view-constellation";
import { Library } from "@/components/atlas/view-library";
import { Overview } from "@/components/atlas/view-overview";
import { Reader } from "@/components/atlas/reader";
import { Registry } from "@/components/atlas/view-registry";
import { Rail, type AtlasView } from "@/components/atlas/rail";
import { Sky } from "@/components/atlas/sky";
import { Spotlight } from "@/components/atlas/spotlight";
import { loadDocuments, loadGraph, loadStats } from "@/lib/client-data";
import type { CorpusStats, GraphData, KnowledgeDocumentSummary } from "@/lib/knowledge-types";

type Seed = { id: number; text: string };

export function Atlas() {
  const [view, setView] = useState<AtlasView>("overview");
  const [documents, setDocuments] = useState<KnowledgeDocumentSummary[]>([]);
  const [stats, setStats] = useState<CorpusStats | null>(null);
  const [graph, setGraph] = useState<GraphData | null>(null);

  const [openDocument, setOpenDocument] = useState<string | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [seed, setSeed] = useState<Seed | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const seedId = useRef(0);

  useEffect(() => {
    let live = true;
    Promise.all([loadDocuments(), loadStats(), loadGraph()])
      .then(([documentData, statsData, graphData]) => {
        if (!live) return;
        setDocuments(documentData);
        setStats(statsData);
        setGraph(graphData);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("mcp-atlas-theme-v1");
    const next =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    applyTheme(next);
    const frame = window.requestAnimationFrame(() => setTheme(next));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSpotlightOpen((open) => !open);
        return;
      }
      if (event.key !== "Escape") return;
      if (spotlightOpen) return setSpotlightOpen(false);
      if (openDocument) return setOpenDocument(null);
      if (askOpen) return setAskOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [askOpen, openDocument, spotlightOpen]);

  useEffect(() => {
    document.body.dataset.locked = String(Boolean(openDocument || spotlightOpen));
  }, [openDocument, spotlightOpen]);

  const navigate = useCallback((next: AtlasView) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const browse = useCallback(
    (nextCategory?: string) => {
      if (nextCategory === "Registry") return navigate("registry");
      setCategory(nextCategory ?? "All");
      setQuery("");
      navigate("library");
    },
    [navigate],
  );

  const search = useCallback(
    (text: string) => {
      setQuery(text);
      setCategory("All");
      setSpotlightOpen(false);
      navigate("library");
    },
    [navigate],
  );

  const ask = useCallback((question?: string) => {
    if (question) {
      seedId.current += 1;
      setSeed({ id: seedId.current, text: question });
      setOpenDocument(null);
    }
    setAskOpen(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem("mcp-atlas-theme-v1", next);
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <>
      <Sky />
      <div className="atlas">
        <Rail
          view={view}
          theme={theme}
          onNavigate={navigate}
          onSearch={() => setSpotlightOpen(true)}
          onToggleTheme={toggleTheme}
          onAsk={() => ask()}
        />

        <main className="stage">
          {view === "overview" && (
            <Overview stats={stats} documents={documents} onBrowse={browse} onOpen={setOpenDocument} onAsk={ask} />
          )}
          {view === "library" && (
            <Library
              documents={documents}
              query={query}
              category={category}
              onQuery={setQuery}
              onCategory={setCategory}
              onOpen={setOpenDocument}
            />
          )}
          {view === "map" && (
            <Constellation
              graph={graph}
              documents={documents}
              theme={theme}
              onExplore={search}
              onOpen={setOpenDocument}
            />
          )}
          {view === "registry" && <Registry />}
        </main>

        <footer className="foot">
          <span>
            {stats
              ? `Corpus synced ${new Date(stats.generatedAt).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })} · ${stats.repositories} official repositories`
              : "Source-linked knowledge for the Model Context Protocol"}
          </span>
          <span>
            Designed and developed by{" "}
            <a href="https://github.com/SawabS" target="_blank" rel="noreferrer">
              <GithubMark />
              @SawabS
            </a>
          </span>
        </footer>
      </div>

      {!askOpen && (
        <button className="ask-fab" type="button" onClick={() => ask()} aria-label="Ask Atlas">
          <span className="ask-fab-glyph">
            <Sparkles size={17} />
          </span>
          <div>
            <b>Ask Atlas</b>
            <small>Grounded in exact sources</small>
          </div>
        </button>
      )}

      <Ask open={askOpen} seed={seed} onClose={() => setAskOpen(false)} onSeedUsed={() => setSeed(null)} />

      <Spotlight
        key={spotlightOpen ? "spotlight-open" : "spotlight-closed"}
        open={spotlightOpen}
        documents={documents}
        onClose={() => setSpotlightOpen(false)}
        onOpen={(id) => {
          setSpotlightOpen(false);
          setOpenDocument(id);
        }}
        onSearchAll={search}
      />

      {openDocument && (
        <Reader
          key={openDocument}
          documentId={openDocument}
          onClose={() => setOpenDocument(null)}
          onAsk={ask}
          onConcept={(concept) => {
            setOpenDocument(null);
            search(concept);
          }}
        />
      )}
    </>
  );
}

function applyTheme(theme: "dark" | "light") {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function GithubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.3-1.5-1.3-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.7 2-1.1-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.2c0 .3.2.6.8.5A11.3 11.3 0 0 0 12 .7Z" />
    </svg>
  );
}
