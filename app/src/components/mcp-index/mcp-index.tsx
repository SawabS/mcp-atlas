"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LoaderCircle, Sparkles } from "lucide-react";
import { CursorAura } from "@/components/mcp-index/cursor-aura";
import { Overview } from "@/components/mcp-index/view-overview";
import { Rail, type IndexView } from "@/components/mcp-index/rail";
import { Sky } from "@/components/mcp-index/sky";
import { loadDocuments, loadGraph, loadStats } from "@/lib/client-data";
import type { CorpusStats, GraphData, KnowledgeDocumentSummary } from "@/lib/knowledge-types";

/*
 * Every view but Overview, plus the Ask panel (markdown + math + mermaid +
 * code-highlighting) and the command palette, is code-split so a first-time
 * visitor's initial bundle is just the Overview. Each chunk fetches the
 * moment its view is navigated to, or the first time Ask/Spotlight opens.
 */
const viewLoading = () => (
  <div className="loading">
    <LoaderCircle size={22} className="spin" />
  </div>
);

const Library = dynamic(() => import("@/components/mcp-index/view-library").then((m) => m.Library), {
  loading: viewLoading,
});
const Constellation = dynamic(
  () => import("@/components/mcp-index/view-constellation").then((m) => m.Constellation),
  { loading: viewLoading },
);
const Registry = dynamic(() => import("@/components/mcp-index/view-registry").then((m) => m.Registry), {
  loading: viewLoading,
});
const Reader = dynamic(() => import("@/components/mcp-index/reader").then((m) => m.Reader), {
  loading: viewLoading,
});
const Ask = dynamic(() => import("@/components/mcp-index/ask").then((m) => m.Ask), {
  loading: viewLoading,
});
const Spotlight = dynamic(() => import("@/components/mcp-index/spotlight").then((m) => m.Spotlight));

type Seed = { id: number; text: string };

export function McpIndex({ readyModels }: { readyModels: string[] }) {
  const [view, setView] = useState<IndexView>("overview");
  const [documents, setDocuments] = useState<KnowledgeDocumentSummary[]>([]);
  const [stats, setStats] = useState<CorpusStats | null>(null);
  const [graph, setGraph] = useState<GraphData | null>(null);

  const [openDocument, setOpenDocument] = useState<string | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightMounted, setSpotlightMounted] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [askMounted, setAskMounted] = useState(false);
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
    const stored = window.localStorage.getItem("mcp-index-theme-v1");
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
        setSpotlightMounted(true);
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

  const navigate = useCallback((next: IndexView) => {
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
    setAskMounted(true);
    setAskOpen(true);
  }, []);

  const openSpotlight = useCallback(() => {
    setSpotlightMounted(true);
    setSpotlightOpen(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem("mcp-index-theme-v1", next);
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <>
      <Sky />
      <CursorAura />
      <div className="mcp-index">
        <Rail
          view={view}
          theme={theme}
          onNavigate={navigate}
          onSearch={openSpotlight}
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
          {view === "registry" && <Registry onAsk={ask} />}
        </main>

        <footer className="foot">
          <span>
            {stats
              ? `Corpus synced ${new Date(stats.generatedAt).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })} · ${stats.repositories} official repositories`
              : "Source-linked knowledge for the Model Context Protocol"}
          </span>
          <span className="foot-credit">
            <span>Designed and developed by</span>
            <a href="https://github.com/SawabS" target="_blank" rel="noreferrer">
              <GithubMark />
              @SawabS
            </a>
          </span>
        </footer>
      </div>

      {!askOpen && (
        <button className="ask-fab" type="button" onClick={() => ask()} aria-label="Ask Index">
          <span className="ask-fab-glyph">
            <Sparkles size={17} />
          </span>
          <div>
            <b>Ask Index</b>
            <small>Grounded in exact sources</small>
          </div>
        </button>
      )}

      {askMounted && (
        <Ask
          open={askOpen}
          seed={seed}
          readyModels={readyModels}
          onClose={() => setAskOpen(false)}
          onSeedUsed={() => setSeed(null)}
        />
      )}

      {spotlightMounted && (
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
      )}

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
    <svg className="foot-github" aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z" />
    </svg>
  );
}
