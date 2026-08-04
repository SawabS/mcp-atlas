"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type UIEvent } from "react";
import { defaultUrlTransform } from "streamdown";
import {
  ArrowLeft,
  ExternalLink,
  FileCode2,
  GitCommitHorizontal,
  LoaderCircle,
  Scale,
  Sparkles,
  X,
} from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import { loadDocument } from "@/lib/client-data";
import { documentAssetUrl } from "@/lib/display-text";
import type { KnowledgeDocument } from "@/lib/knowledge-types";

type ReaderProps = {
  documentId: string;
  onClose: () => void;
  onAsk: (question: string) => void;
  onConcept: (concept: string) => void;
};

export function Reader({ documentId, onClose, onAsk, onConcept }: ReaderProps) {
  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    loadDocument(documentId)
      .then((value) => live && setDocument(value))
      .catch((reason) => live && setError(reason instanceof Error ? reason.message : "This source could not be loaded."));
    return () => {
      live = false;
    };
  }, [documentId]);

  useEffect(() => {
    sheetRef.current?.focus({ preventScroll: true });
  }, [document]);

  const onScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const span = element.scrollHeight - element.clientHeight;
    setProgress(span > 0 ? Math.min(1, element.scrollTop / span) : 0);
  }, []);

  const jumpTo = useCallback((heading: string) => {
    const container = contentRef.current;
    if (!container) return;
    const match = [...container.querySelectorAll("h1, h2, h3, h4")].find(
      (element) => element.textContent?.trim() === heading,
    );
    match?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="scrim" role="dialog" aria-modal="true" aria-label="Source document" onMouseDown={onClose}>
      <article
        className="sheet"
        ref={sheetRef}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        style={{ "--p": progress } as CSSProperties}
      >
        <span className="sheet-progress" aria-hidden="true" />

        <header className="sheet-bar">
          <button className="btn btn-sm" type="button" onClick={onClose}>
            <ArrowLeft size={15} /> Back
          </button>
          <span className="grow">{document ? `${document.repository} / ${document.sourcePath}` : "Loading source…"}</span>
          {document && (
            <a className="icon-btn" href={document.sourceUrl} target="_blank" rel="noreferrer" aria-label="Open on GitHub">
              <ExternalLink size={16} />
            </a>
          )}
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </header>

        {error ? (
          <div className="empty">
            <h3>Source unavailable</h3>
            <p>{error}</p>
            <button className="btn btn-sm" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : !document ? (
          <div className="loading">
            <LoaderCircle size={20} className="spin" />
            <h3>Opening the source</h3>
            <div className="shimmer" />
          </div>
        ) : (
          <div className="sheet-body" onScroll={onScroll}>
            <div>
              <div className="doc-head">
                <span className="badge" data-kind={document.authority.replace("official-", "")}>
                  <i />
                  {document.authority.replace("official-", "")}
                </span>
                <h1>{document.title}</h1>
                <p className="lede">{document.excerpt.slice(0, 220)}…</p>
                <div className="doc-actions">
                  <a className="btn btn-sm" href={document.sourceUrl} target="_blank" rel="noreferrer">
                    View exact commit <ExternalLink size={14} />
                  </a>
                  <button
                    className="btn btn-sm btn-primary"
                    type="button"
                    onClick={() => onAsk(`Explain the key ideas in "${document.title}" and cite this source.`)}
                  >
                    <Sparkles size={14} /> Ask about this
                  </button>
                </div>
              </div>

              <div className="prose" ref={contentRef}>
                <MessageResponse
                  mode="static"
                  urlTransform={(url, key, node) => defaultUrlTransform(documentAssetUrl(url, document), key, node)}
                >
                  {document.content}
                </MessageResponse>
              </div>
            </div>

            <aside className="meta-rail" aria-label="Source details">
              <div className="meta-block">
                <span className="eyebrow">Provenance</span>
                <div className="meta-item">
                  <GitCommitHorizontal size={15} />
                  <span>
                    <small>Commit</small>
                    <code>{document.commit?.slice(0, 12) ?? "registry"}</code>
                  </span>
                </div>
                <div className="meta-item">
                  <FileCode2 size={15} />
                  <span>
                    <small>Source type</small>
                    <b>{document.documentType}</b>
                  </span>
                </div>
                <div className="meta-item">
                  <Scale size={15} />
                  <span>
                    <small>Licence</small>
                    <b>{document.license ?? "Not reported"}</b>
                  </span>
                </div>
              </div>

              {document.headings.length > 0 && (
                <div className="meta-block">
                  <span className="eyebrow">On this page</span>
                  <nav className="doc-outline">
                    {document.headings.slice(0, 18).map((heading, position) => (
                      <a
                        key={`${heading}-${position}`}
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          jumpTo(heading);
                        }}
                      >
                        {heading}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {document.concepts.length > 0 && (
                <div className="meta-block">
                  <span className="eyebrow">Connected concepts</span>
                  <div className="tag-row">
                    {document.concepts.map((concept) => (
                      <button className="chip" type="button" key={concept} onClick={() => onConcept(concept)}>
                        {concept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
      </article>
    </div>
  );
}
