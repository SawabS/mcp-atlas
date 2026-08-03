"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Layers, Search, SearchX } from "lucide-react";
import { Reveal } from "@/components/atlas/motion";
import type { KnowledgeDocumentSummary } from "@/lib/knowledge-types";

const categories = [
  "All",
  "Specification",
  "Core documentation",
  "SDKs",
  "Reference servers",
  "Extensions",
  "Registry",
  "Tooling and community",
];

const PAGE = 36;

function score(document: KnowledgeDocumentSummary, terms: string[]) {
  if (!terms.length) return 1;
  const title = document.title.toLowerCase();
  const meta = `${document.repository} ${document.sourcePath} ${document.concepts.join(" ")}`.toLowerCase();
  const body = document.excerpt.toLowerCase();
  return terms.reduce(
    (total, term) =>
      total + (title.includes(term) ? 12 : 0) + (meta.includes(term) ? 5 : 0) + (body.includes(term) ? 2 : 0),
    0,
  );
}

type LibraryProps = {
  documents: KnowledgeDocumentSummary[];
  query: string;
  category: string;
  onQuery: (query: string) => void;
  onCategory: (category: string) => void;
  onOpen: (id: string) => void;
};

export function Library({ documents, query, category, onQuery, onCategory, onOpen }: LibraryProps) {
  const [limit, setLimit] = useState(PAGE);
  const [filterKey, setFilterKey] = useState(`${query}|${category}`);

  // Reset paging whenever the filters change, without an extra render pass.
  if (filterKey !== `${query}|${category}`) {
    setFilterKey(`${query}|${category}`);
    setLimit(PAGE);
  }

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return documents
      .filter((document) => category === "All" || document.category === category)
      .map((document) => ({ document, weight: score(document, terms) }))
      .filter((result) => result.weight > 0)
      .sort((a, b) => (terms.length ? b.weight - a.weight || a.document.title.localeCompare(b.document.title) : 0))
      .map((result) => result.document);
  }, [category, documents, query]);

  return (
    <div className="view">
      <section>
        <header className="page-head">
          <div>
            <span className="eyebrow">Source library</span>
            <h1 className="title">
              Every official document, <em>one search away</em>
            </h1>
            <p className="lede">
              Stable paths, exact commits, and the licence each file was published under.
            </p>
          </div>
          <div className="counter">
            <b>{results.length.toLocaleString("en-US")}</b>
            <span>{results.length === 1 ? "document" : "documents"}</span>
          </div>
        </header>

        <div className="filters">
          <div className="filter-row">
            <label className="field">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => onQuery(event.target.value)}
                placeholder="Search transports, elicitation, Python SDK, OAuth…"
                aria-label="Search documents"
              />
            </label>
            <div className="field">
              <Layers size={16} />
              <select value={category} onChange={(event) => onCategory(event.target.value)} aria-label="Category">
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="chip-row">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${category === item ? "is-on" : ""}`}
                onClick={() => onCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {results.length ? (
          <>
            <div className="card-grid">
              {results.slice(0, limit).map((document, index) => (
                <Reveal key={document.id} delay={Math.min(index, 11) * 34}>
                  <button
                    type="button"
                    className="card doc-card"
                    onClick={() => onOpen(document.id)}
                  >
                    <div className="doc-card-top">
                      <span className="badge" data-kind={document.authority.replace("official-", "")}>
                        <i />
                        {document.authority.replace("official-", "")}
                      </span>
                      <ArrowUpRight size={16} color="var(--text-3)" />
                    </div>
                    <h3>{document.title}</h3>
                    <p>{document.excerpt}</p>
                    <div className="tag-row">
                      {document.concepts.slice(0, 3).map((concept) => (
                        <span className="tag" key={concept}>
                          {concept}
                        </span>
                      ))}
                    </div>
                    <footer>
                      <span>{document.repository.replace("modelcontextprotocol/", "")}</span>
                      <span>{document.wordCount.toLocaleString("en-US")} words</span>
                    </footer>
                  </button>
                </Reveal>
              ))}
            </div>
            {results.length > limit && (
              <button className="btn more" type="button" onClick={() => setLimit((value) => value + PAGE)}>
                Show {Math.min(PAGE, results.length - limit)} more
              </button>
            )}
          </>
        ) : (
          <div className="empty">
            <SearchX size={26} />
            <h3>Nothing matches that yet</h3>
            <p>Try a broader phrase, or clear the category filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
