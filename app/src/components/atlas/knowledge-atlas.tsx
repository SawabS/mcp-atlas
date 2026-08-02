"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Menu, MessageCircleMore, Moon, Search, Sun } from "lucide-react";
import { BrandMark } from "@/components/atlas/brand-mark";
import { ChatPanel } from "@/components/atlas/chat-panel";
import { CommandPalette } from "@/components/atlas/command-palette";
import { ConceptGraph } from "@/components/atlas/concept-graph";
import { DocumentReader } from "@/components/atlas/document-reader";
import { HomeDashboard } from "@/components/atlas/home-dashboard";
import { LibraryView } from "@/components/atlas/library-view";
import { ServerCatalog } from "@/components/atlas/server-catalog";
import { type AtlasView, Sidebar } from "@/components/atlas/sidebar";
import { loadDocuments, loadGraph, loadStats } from "@/lib/client-data";
import type { CorpusStats, GraphData, KnowledgeDocumentSummary } from "@/lib/knowledge-types";

type PendingQuestion = {
  id: number;
  text: string;
};

function GithubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.3-1.5-1.3-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.7 2-1.1-2.7-.3-5.5-1.3-5.5-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.8 5.5-5.5 5.8.4.4.8 1.1.8 2.2v3.2c0 .3.2.6.8.5A11.3 11.3 0 0 0 12 .7Z" />
    </svg>
  );
}

export function KnowledgeAtlas() {
  const [view, setView] = useState<AtlasView>("home");
  const [documents, setDocuments] = useState<KnowledgeDocumentSummary[]>([]);
  const [stats, setStats] = useState<CorpusStats | null>(null);
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryCategory, setLibraryCategory] = useState("All");
  const [pendingQuestion, setPendingQuestion] = useState<PendingQuestion | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [chatDock, setChatDock] = useState<"left" | "right">("right");
  const [chatWidth, setChatWidth] = useState(480);
  const viewContainerRef = useRef<HTMLDivElement>(null);
  const questionIdRef = useRef(0);

  useEffect(() => {
    Promise.all([loadDocuments(), loadStats(), loadGraph()]).then(([documentData, statsData, graphData]) => {
      setDocuments(documentData);
      setStats(statsData);
      setGraph(graphData);
    });
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("mcp-atlas-theme-v1");
    const nextTheme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    const frame = window.requestAnimationFrame(() => setTheme(nextTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSelectedDocument(null);
        setChatOpen(false);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigate = useCallback((nextView: AtlasView) => {
    setView(nextView);
    setSelectedDocument(null);
    setMobileSidebarOpen(false);
    window.requestAnimationFrame(() => viewContainerRef.current?.scrollTo({ top: 0 }));
  }, []);
  const openDocument = useCallback((id: string) => {
    setSearchOpen(false);
    setSelectedDocument(id);
  }, []);
  const openLibrary = useCallback((category?: string) => {
    setView(category === "Registry" ? "servers" : "library");
    setLibraryCategory(category && category !== "Registry" ? category : "All");
    setLibraryQuery("");
  }, []);
  const searchAll = useCallback((query: string) => {
    setLibraryQuery(query);
    setLibraryCategory("All");
    setSearchOpen(false);
    setView("library");
  }, []);
  const exploreConcept = useCallback((concept: string) => {
    setLibraryQuery(concept);
    setLibraryCategory("All");
    setView("library");
  }, []);
  const askAboutDocument = useCallback((question: string) => {
    questionIdRef.current += 1;
    setSelectedDocument(null);
    setPendingQuestion({ id: questionIdRef.current, text: question });
    setChatOpen(true);
  }, []);
  const consumePendingQuestion = useCallback((id: number) => {
    setPendingQuestion((current) => current?.id === id ? null : current);
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem("mcp-atlas-theme-v1", next);
      document.documentElement.dataset.theme = next;
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      return next;
    });
  }, []);

  const shellStyle = { "--chat-width": `${chatWidth}px` } as CSSProperties;

  return (
    <div className={`atlas-shell theme-${theme} ${chatOpen ? "chat-visible" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""} chat-dock-${chatDock}`} style={shellStyle}>
      <Sidebar activeView={view} stats={stats} collapsed={sidebarCollapsed} mobileOpen={mobileSidebarOpen} theme={theme} onCollapse={() => setSidebarCollapsed((value) => !value)} onNavigate={navigate} onSearch={() => setSearchOpen(true)} onToggleTheme={toggleTheme} />
      <button className={`mobile-nav-backdrop ${mobileSidebarOpen ? "is-visible" : ""}`} type="button" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} />
      <main className="atlas-main" aria-hidden={mobileSidebarOpen} inert={mobileSidebarOpen}>
        <div className="mobile-header"><button type="button" aria-label="Open navigation" onClick={() => setMobileSidebarOpen(true)}><Menu size={20} /></button><button className="mobile-brand" type="button" onClick={() => navigate("home")} aria-label="Go to Atlas home"><BrandMark compact /><strong>MCP Atlas</strong></button><div><button type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={toggleTheme}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button><button type="button" aria-label="Search knowledge" onClick={() => setSearchOpen(true)}><Search size={19} /></button></div></div>
        <div className="top-utility"><span><span className="status-dot" /> Synced {stats ? new Date(stats.generatedAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "today"}</span><div><button type="button" onClick={toggleTheme}>{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />} {theme === "dark" ? "Light" : "Dark"}</button><button type="button" onClick={() => setSearchOpen(true)}><Search size={15} /> Search</button></div></div>
        <div className="view-container" ref={viewContainerRef}>
          {view === "home" && <HomeDashboard stats={stats} documents={documents} onOpenLibrary={openLibrary} onOpenDocument={openDocument} />}
          {view === "library" && <LibraryView documents={documents} query={libraryQuery} category={libraryCategory} onQueryChange={setLibraryQuery} onCategoryChange={setLibraryCategory} onOpenDocument={openDocument} />}
          {view === "graph" && <ConceptGraph graph={graph} documents={documents} theme={theme} onExplore={exploreConcept} onOpenDocument={openDocument} />}
          {view === "servers" && <ServerCatalog />}
          <footer className="site-credit">Designed and developed by <a href="https://github.com/SawabS" target="_blank" rel="noreferrer"><GithubMark /> @SawabS</a></footer>
        </div>
        {!chatOpen && <button className="floating-chat" type="button" aria-label="Ask Atlas" onClick={() => setChatOpen(true)}><span><MessageCircleMore size={20} /></span><div><b>Ask Atlas</b><small>Answers with exact sources</small></div></button>}
      </main>
      <ChatPanel open={chatOpen} initialQuestion={pendingQuestion} dock={chatDock} width={chatWidth} onClose={() => setChatOpen(false)} onDockChange={setChatDock} onResize={setChatWidth} onQuestionConsumed={consumePendingQuestion} />
      <CommandPalette open={searchOpen} documents={documents} onClose={() => setSearchOpen(false)} onOpenDocument={openDocument} onSearchAll={searchAll} />
      {selectedDocument && <DocumentReader key={selectedDocument} documentId={selectedDocument} onClose={() => setSelectedDocument(null)} onAsk={askAboutDocument} />}
    </div>
  );
}
