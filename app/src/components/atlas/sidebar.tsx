"use client";

import {
  BookOpenText,
  GitBranch,
  Home,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Server,
  Sparkles,
  Sun,
} from "lucide-react";
import { BrandMark } from "@/components/atlas/brand-mark";
import type { CorpusStats } from "@/lib/knowledge-types";

export type AtlasView = "home" | "library" | "graph" | "servers";

const links: Array<{ id: AtlasView; label: string; icon: typeof Home }> = [
  { id: "home", label: "Overview", icon: Home },
  { id: "library", label: "Knowledge", icon: BookOpenText },
  { id: "graph", label: "Concept graph", icon: GitBranch },
  { id: "servers", label: "Server registry", icon: Server },
];

type SidebarProps = {
  activeView: AtlasView;
  stats: CorpusStats | null;
  collapsed: boolean;
  mobileOpen: boolean;
  theme: "dark" | "light";
  onCollapse: () => void;
  onNavigate: (view: AtlasView) => void;
  onSearch: () => void;
  onToggleTheme: () => void;
};

export function Sidebar({
  activeView,
  stats,
  collapsed,
  mobileOpen,
  theme,
  onCollapse,
  onNavigate,
  onSearch,
  onToggleTheme,
}: SidebarProps) {
  return (
    <aside className={`atlas-sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}>
      <button className="sidebar-brand" type="button" onClick={() => onNavigate("home")} aria-label="Go to Atlas home">
        <BrandMark compact={collapsed} />
        {!collapsed && (
          <div>
            <div className="brand-title">MCP Atlas</div>
            <div className="brand-subtitle">Living protocol knowledge</div>
          </div>
        )}
      </button>

      <button className="search-launch" type="button" onClick={onSearch}>
        <Search size={17} />
        {!collapsed && <span>Search everything</span>}
        {!collapsed && <kbd>⌘ K</kbd>}
      </button>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              className={activeView === link.id ? "is-active" : ""}
              key={link.id}
              type="button"
              onClick={() => onNavigate(link.id)}
              aria-label={link.label}
            >
              <Icon size={18} />
              {!collapsed && <span>{link.label}</span>}
              {link.id === "servers" && !collapsed && stats && (
                <small>{stats.registryServers.toLocaleString()}</small>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="sidebar-pulse-card">
          <div className="pulse-card-icon"><Sparkles size={15} /></div>
          <span className="eyebrow">Knowledge pulse</span>
          <strong>{stats?.retrievalChunks.toLocaleString() ?? "..."} grounded passages</strong>
          <p>Every answer traces back to an exact official source.</p>
        </div>
      )}

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sync-status">
            <span className="status-dot" />
            <div><strong>Corpus online</strong><small>{stats?.repositories ?? 42} repositories</small></div>
          </div>
        )}
        <button className="collapse-button" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="collapse-button" type="button" onClick={onCollapse} aria-label="Toggle sidebar">
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
    </aside>
  );
}
