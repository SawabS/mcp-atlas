"use client";

import { ArrowRight, BookMarked, Braces, Database, Radio, ShieldCheck, Sparkles } from "lucide-react";
import type { CorpusStats, KnowledgeDocumentSummary } from "@/lib/knowledge-types";

const prompts = [
  "How does capability negotiation work?",
  "Compare tools, resources, and prompts",
  "How should I secure a remote MCP server?",
];

type HomeDashboardProps = {
  stats: CorpusStats | null;
  documents: KnowledgeDocumentSummary[];
  onOpenLibrary: (category?: string) => void;
  onOpenDocument: (id: string) => void;
  onAsk: (question: string) => void;
};

export function HomeDashboard({ stats, documents, onOpenLibrary, onOpenDocument, onAsk }: HomeDashboardProps) {
  const featured = documents.filter((document) => document.sourcePath.includes("2026-07-28") && document.category === "Specification").slice(0, 4);
  const categoryCards = [
    { label: "Specification", value: stats?.categories.Specification, icon: Braces, color: "mint" },
    { label: "SDKs", value: stats?.categories.SDKs, icon: BookMarked, color: "blue" },
    { label: "Reference servers", value: stats?.categories["Reference servers"], icon: Radio, color: "orange" },
    { label: "Registry", value: stats?.registryServers, icon: Database, color: "violet" },
  ];

  return (
    <div className="dashboard-page">
      <section className="hero-panel">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="hero-kicker"><span className="live-spark" /> Official MCP knowledge, mapped</div>
          <h1>Understand the protocol.<br /><span>Follow every connection.</span></h1>
          <p>Explore the specification, SDKs, servers, and Registry through a source-linked knowledge atlas built for people and AI.</p>
          <div className="hero-actions">
            <button className="primary-action" type="button" onClick={() => onAsk(prompts[0])}><Sparkles size={17} /> Ask Atlas</button>
            <button className="secondary-action" type="button" onClick={() => onOpenLibrary()}><BookMarked size={17} /> Browse knowledge</button>
          </div>
          <div className="trust-row"><ShieldCheck size={15} /><span>Answers grounded in exact commits</span><i /><span>{stats?.retrievalChunks.toLocaleString() ?? "..."} searchable passages</span></div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-one"><span /></div>
          <div className="orbit orbit-two"><span /></div>
          <div className="orbit orbit-three"><span /></div>
          <div className="protocol-core"><Braces size={31} /><small>MCP</small></div>
          <div className="orbit-label label-tools">Tools</div>
          <div className="orbit-label label-resources">Resources</div>
          <div className="orbit-label label-prompts">Prompts</div>
          <div className="orbit-label label-sampling">Sampling</div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">Explore the corpus</span><h2>Four ways into MCP</h2></div><button type="button" onClick={() => onOpenLibrary()}>View all documents <ArrowRight size={15} /></button></div>
        <div className="category-grid">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            return (
              <button key={card.label} className={`category-card accent-${card.color}`} type="button" onClick={() => onOpenLibrary(card.label)}>
                <span className="category-icon"><Icon size={21} /></span>
                <strong>{card.label}</strong>
                <p>{card.label === "Registry" ? "Discover active community and official MCP servers." : `Navigate ${card.value?.toLocaleString() ?? "..."} source-linked documents.`}</p>
                <span className="category-meta"><b>{card.value?.toLocaleString() ?? "..."}</b> {card.label === "Registry" ? "active servers" : "documents"}<ArrowRight size={15} /></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="dashboard-split">
        <div className="section-block compact-block">
          <div className="section-heading"><div><span className="eyebrow">Current specification</span><h2>Start with the source</h2></div></div>
          <div className="featured-list">
            {featured.map((document, index) => (
              <button key={document.id} type="button" onClick={() => onOpenDocument(document.id)}>
                <span className="featured-index">0{index + 1}</span>
                <span><strong>{document.title}</strong><small>{document.sourcePath}</small></span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className="ask-card">
          <div className="ask-card-head"><div className="atlas-avatar"><Sparkles size={20} /></div><div><span className="eyebrow">Atlas assistant</span><h2>Ask the protocol</h2></div></div>
          <p>Get a focused answer with exact source links and commit-level provenance.</p>
          <div className="prompt-stack">
            {prompts.map((prompt) => <button key={prompt} type="button" onClick={() => onAsk(prompt)}><span>{prompt}</span><ArrowRight size={15} /></button>)}
          </div>
        </div>
      </section>
    </div>
  );
}
