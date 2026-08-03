"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, FileText, Search, SlidersHorizontal } from "lucide-react";
import type { KnowledgeDocumentSummary } from "@/lib/knowledge-types";

function rank(document: KnowledgeDocumentSummary, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const title = document.title.toLowerCase();
  const path = `${document.repository} ${document.sourcePath}`.toLowerCase();
  const body = `${document.excerpt} ${document.concepts.join(" ")}`.toLowerCase();
  let total = terms.reduce(
    (sum, term) => sum + (title.includes(term) ? 14 : 0) + (path.includes(term) ? 7 : 0) + (body.includes(term) ? 3 : 0),
    0,
  );
  if (title.includes(query.toLowerCase())) total += 20;
  return total;
}

type SpotlightProps = {
  open: boolean;
  documents: KnowledgeDocumentSummary[];
  onClose: () => void;
  onOpen: (id: string) => void;
  onSearchAll: (query: string) => void;
};

export function Spotlight({ open, documents, onClose, onOpen, onSearchAll }: SpotlightProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return documents.filter((document) => document.category === "Specification").slice(0, 6);
    }
    return documents
      .map((document) => ({ document, weight: rank(document, query) }))
      .filter((result) => result.weight > 0)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 8)
      .map((result) => result.document);
  }, [documents, query]);

  if (!open) return null;

  const total = results.length + (query.trim() ? 1 : 0);

  const commit = (position: number) => {
    if (position < results.length) return onOpen(results[position].id);
    if (query.trim()) onSearchAll(query.trim());
  };

  return (
    <div className="spotlight-scrim" role="presentation" onMouseDown={onClose}>
      <section
        className="spotlight"
        role="dialog"
        aria-modal="true"
        aria-label="Search the index"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="spotlight-input">
          <Search size={19} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            placeholder="Search the specification, SDKs, concepts…"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setCursor((value) => (value + 1) % Math.max(total, 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setCursor((value) => (value - 1 + Math.max(total, 1)) % Math.max(total, 1));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                commit(cursor);
              }
            }}
          />
          <kbd>esc</kbd>
        </div>

        <div className="spotlight-list">
          <div className="spotlight-label">{query.trim() ? "Best matches" : "Start with the specification"}</div>
          {results.map((document, position) => (
            <button
              key={document.id}
              type="button"
              data-active={cursor === position}
              onMouseEnter={() => setCursor(position)}
              onClick={() => onOpen(document.id)}
            >
              <span>
                <FileText size={16} />
              </span>
              <span className="spotlight-copy">
                <strong>{document.title}</strong>
                <small>
                  {document.repository.replace("modelcontextprotocol/", "")} / {document.sourcePath}
                </small>
              </span>
              <span className="tag">{document.category}</span>
            </button>
          ))}

          {!results.length && <div className="spotlight-label">No direct matches. Try the full search.</div>}

          {query.trim() && (
            <button
              type="button"
              data-active={cursor === results.length}
              onMouseEnter={() => setCursor(results.length)}
              onClick={() => onSearchAll(query.trim())}
            >
              <span>
                <SlidersHorizontal size={16} />
              </span>
              <span className="spotlight-copy">
                <strong>Search the whole library for “{query.trim()}”</strong>
                <small>Filter by category, authority and concept</small>
              </span>
              <CornerDownLeft size={15} color="var(--text-3)" />
            </button>
          )}
        </div>

        <footer>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> dismiss
          </span>
        </footer>
      </section>
    </div>
  );
}
