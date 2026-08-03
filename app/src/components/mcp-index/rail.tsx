"use client";

import type { CSSProperties } from "react";
import { Compass, Library, Moon, Search, Server, Sparkles, Sun, Waypoints } from "lucide-react";
import { Mark } from "@/components/atlas/mark";
import { useScrolled } from "@/components/atlas/motion";

export type AtlasView = "overview" | "library" | "map" | "registry";

export const views: Array<{ id: AtlasView; label: string; icon: typeof Compass }> = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "library", label: "Library", icon: Library },
  { id: "map", label: "Constellation", icon: Waypoints },
  { id: "registry", label: "Registry", icon: Server },
];

type RailProps = {
  view: AtlasView;
  theme: "dark" | "light";
  onNavigate: (view: AtlasView) => void;
  onSearch: () => void;
  onToggleTheme: () => void;
  onAsk: () => void;
};

export function Rail({ view, theme, onNavigate, onSearch, onToggleTheme, onAsk }: RailProps) {
  const elevated = useScrolled(10);
  const index = Math.max(0, views.findIndex((item) => item.id === view));

  return (
    <>
      <header className="rail" data-elevated={elevated}>
        <button className="rail-brand" type="button" onClick={() => onNavigate("overview")} aria-label="MCP Atlas home">
          <Mark />
          <span>
            MCP <em>Atlas</em>
          </span>
        </button>

        <nav
          className="segmented"
          aria-label="Sections"
          style={{ "--count": views.length, "--index": index } as CSSProperties}
        >
          <span className="segmented-thumb" aria-hidden="true" />
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={view === item.id}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="rail-tools">
          <button className="rail-search" type="button" onClick={onSearch} aria-label="Search the atlas">
            <Search size={15} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <button
            className="icon-btn"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "daybreak" : "night"} theme`}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="btn btn-sm btn-primary" type="button" onClick={onAsk}>
            <Sparkles size={15} />
            <span>Ask Atlas</span>
          </button>
        </div>
      </header>

      <nav className="dock" aria-label="Sections">
        {views.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" aria-current={view === item.id} onClick={() => onNavigate(item.id)}>
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
