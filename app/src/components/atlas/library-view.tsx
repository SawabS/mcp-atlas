"use client";

import { useMemo } from "react";
import { ArrowUpRight, FileText, Filter, Search } from "lucide-react";
import type { KnowledgeDocumentSummary } from "@/lib/knowledge-types";

const categories = ["All", "Specification", "Core documentation", "SDKs", "Reference servers", "Registry", "Extensions", "Tooling and community"];

function score(document: KnowledgeDocumentSummary, query: string) {
  if (!query) return 1;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const title = document.title.toLowerCase();
  const metadata = `${document.repository} ${document.sourcePath} ${document.concepts.join(" ")}`.toLowerCase();
  const excerpt = document.excerpt.toLowerCase();
  return terms.reduce((total, term) => total + (title.includes(term) ? 10 : 0) + (metadata.includes(term) ? 5 : 0) + (excerpt.includes(term) ? 2 : 0), 0);
}

type LibraryViewProps = {
  documents: KnowledgeDocumentSummary[];
  query: string;
  category: string;
  onQueryChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onOpenDocument: (id: string) => void;
};

export function LibraryView({ documents, query, category, onQueryChange, onCategoryChange, onOpenDocument }: LibraryViewProps) {
  const results = useMemo(() => documents
    .filter((document) => category === "All" || document.category === category)
    .map((document) => ({ document, score: score(document, query.trim()) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => query.trim() ? b.score - a.score || a.document.title.localeCompare(b.document.title) : 0)
    .slice(0, 160)
    .map((result) => result.document), [category, documents, query]);

  return (
    <div className="content-page library-page">
      <header className="page-header"><div><span className="eyebrow">Source library</span><h1>Knowledge explorer</h1><p>Search official documentation with stable paths and exact commit links.</p></div><div className="page-count"><b>{results.length}</b><span>results shown</span></div></header>
      <div className="library-controls">
        <label className="library-search"><Search size={18} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search tools, transports, Python SDK..." /></label>
        <div className="category-filter"><Filter size={16} /><select value={category} onChange={(event) => onCategoryChange(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
      </div>
      <div className="filter-chips">{categories.slice(0, 7).map((item) => <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => onCategoryChange(item)}>{item}</button>)}</div>
      <div className="document-grid">
        {results.map((document) => (
          <button className="document-card" key={document.id} type="button" onClick={() => onOpenDocument(document.id)}>
            <div className="document-card-top"><span className={`source-badge authority-${document.authority.replace("official-", "")}`}><FileText size={13} /> {document.authority.replace("official-", "")}</span><ArrowUpRight size={17} /></div>
            <h2>{document.title}</h2>
            <p>{document.excerpt}</p>
            <div className="concept-tags">{document.concepts.slice(0, 3).map((concept) => <span key={concept}>{concept}</span>)}</div>
            <footer><span>{document.repository.replace("modelcontextprotocol/", "")}</span><span>{document.wordCount.toLocaleString()} words</span></footer>
          </button>
        ))}
      </div>
      {!results.length && <div className="empty-state"><Search size={28} /><h2>No matching sources</h2><p>Try a broader phrase or another category.</p></div>}
    </div>
  );
}
