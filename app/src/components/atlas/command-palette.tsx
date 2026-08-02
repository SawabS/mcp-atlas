"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, FileText, Search, X } from "lucide-react";
import type { KnowledgeDocumentSummary } from "@/lib/knowledge-types";

function scoreDocument(document: KnowledgeDocumentSummary, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const title = document.title.toLowerCase();
  const path = `${document.repository} ${document.sourcePath}`.toLowerCase();
  const body = `${document.excerpt} ${document.concepts.join(" ")}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 12;
    if (path.includes(term)) score += 7;
    if (body.includes(term)) score += 3;
  }
  if (title.includes(query.toLowerCase())) score += 18;
  return score;
}

type CommandPaletteProps = {
  open: boolean;
  documents: KnowledgeDocumentSummary[];
  onClose: () => void;
  onOpenDocument: (id: string) => void;
  onSearchAll: (query: string) => void;
};

export function CommandPalette({ open, documents, onClose, onOpenDocument, onSearchAll }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);
  const close = () => {
    setQuery("");
    onClose();
  };
  const results = useMemo(() => {
    if (!query.trim()) return documents.slice(0, 7);
    return documents
      .map((document) => ({ document, score: scoreDocument(document, query) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map((result) => result.document);
  }, [documents, query]);
  if (!open) return null;

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={close}>
      <section className="command-palette" role="dialog" aria-modal="true" aria-label="Search MCP knowledge" onMouseDown={(event) => event.stopPropagation()}>
        <div className="command-input-row">
          <Search size={20} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search specifications, SDKs, concepts..."
            onKeyDown={(event) => {
              if (event.key === "Escape") close();
              if (event.key === "Enter" && query.trim()) onSearchAll(query);
            }}
          />
          <button type="button" onClick={close} aria-label="Close search"><X size={18} /></button>
        </div>
        <div className="command-results">
          <div className="command-section-label">{query ? "Best matches" : "Start here"}</div>
          {results.map((document) => (
            <button key={document.id} type="button" onClick={() => onOpenDocument(document.id)}>
              <span className="result-icon"><FileText size={17} /></span>
              <span className="result-copy"><strong>{document.title}</strong><small>{document.repository} / {document.sourcePath}</small></span>
              <span className="authority-pill">{document.authority.replace("official-", "")}</span>
              <ArrowRight size={15} />
            </button>
          ))}
          {query && (
            <button className="search-all-row" type="button" onClick={() => onSearchAll(query)}>
              <span>See all results for “{query}”</span><ArrowRight size={16} />
            </button>
          )}
        </div>
        <footer><span><kbd>↵</kbd> open search</span><span><kbd>esc</kbd> close</span></footer>
      </section>
    </div>
  );
}
