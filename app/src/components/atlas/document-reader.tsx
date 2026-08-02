"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, ExternalLink, FileCode2, GitCommitHorizontal, LoaderCircle, Scale, X } from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import { loadDocument } from "@/lib/client-data";
import type { KnowledgeDocument } from "@/lib/knowledge-types";

type DocumentReaderProps = {
  documentId: string;
  onClose: () => void;
  onAsk: (question: string) => void;
};

export function DocumentReader({ documentId, onClose, onAsk }: DocumentReaderProps) {
  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    loadDocument(documentId).then((value) => active && setDocument(value)).catch((reason) => active && setError(reason instanceof Error ? reason.message : "Could not load this source."));
    return () => { active = false; };
  }, [documentId]);

  if (error) return <div className="reader-overlay"><div className="reader-error"><h2>Source unavailable</h2><p>{error}</p><button type="button" onClick={onClose}>Close</button></div></div>;
  if (!document) return <div className="reader-overlay"><div className="reader-loader"><LoaderCircle className="animate-spin" /><span>Opening source...</span></div></div>;

  return (
    <div className="reader-overlay">
      <article className="document-reader">
        <header className="reader-toolbar">
          <button type="button" onClick={onClose}><ArrowLeft size={17} /> Back to atlas</button>
          <div><span className="status-dot" /> Exact source</div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close document"><X size={18} /></button>
        </header>
        <div className="reader-layout">
          <main className="reader-content">
            <div className="reader-title-block">
              <div className="source-badge"><CheckCircle2 size={14} /> {document.authority}</div>
              <h1>{document.title}</h1>
              <p>{document.repository} / {document.sourcePath}</p>
              <div className="reader-actions">
                <a href={document.sourceUrl} target="_blank" rel="noreferrer">Open exact commit <ExternalLink size={15} /></a>
                <button type="button" onClick={() => onAsk(`Explain the key ideas in ${document.title} and cite this source.`)}><Bot size={15} /> Ask about this</button>
              </div>
            </div>
            <div className="markdown-document">
              <MessageResponse mode="static" lineNumbers>
                {document.content}
              </MessageResponse>
            </div>
          </main>
          <aside className="reader-metadata" aria-label="Source details">
            <span className="eyebrow">Provenance</span>
            <div className="metadata-item"><GitCommitHorizontal size={16} /><span><small>Commit</small><code>{document.commit?.slice(0, 12) ?? "registry"}</code></span></div>
            <div className="metadata-item"><FileCode2 size={16} /><span><small>Source type</small><b>{document.documentType}</b></span></div>
            <div className="metadata-item"><Scale size={16} /><span><small>Licence</small><b>{document.license ?? "Not reported"}</b></span></div>
            <div className="reader-outline"><span className="eyebrow">On this page</span>{document.headings.slice(0, 14).map((heading) => <span key={heading}>{heading}</span>)}</div>
            <div className="reader-concepts"><span className="eyebrow">Connected concepts</span><div>{document.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div></div>
          </aside>
        </div>
      </article>
    </div>
  );
}
