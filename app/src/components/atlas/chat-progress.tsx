"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Square } from "lucide-react";
import type { ChatStatus } from "ai";
import type { AtlasProgress } from "@/lib/knowledge-types";

type ChatProgressProps = {
  hasText: boolean;
  progress?: AtlasProgress;
  sourceCount: number;
  status: ChatStatus;
  onStop: () => void;
};

const phaseOrder = { retrieving: 0, ranking: 1, drafting: 2 } as const;

export function ChatProgress({ hasText, progress, sourceCount, status, onStop }: ChatProgressProps) {
  const [expanded, setExpanded] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(0);
  const detailsId = useId();
  const phase = progress?.phase ?? (status === "submitted" ? "retrieving" : "drafting");
  const count = progress?.sourceCount ?? sourceCount;

  useEffect(() => {
    startedAt.current = performance.now();
    const timer = window.setInterval(() => {
      setElapsed(Math.max(1, Math.floor((performance.now() - startedAt.current) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const label = phase === "retrieving"
    ? "Searching the local knowledge index"
    : phase === "ranking"
      ? `Reviewing ${count || "the"} closest official passages`
      : hasText
        ? "Streaming a source-linked answer"
        : `Composing from ${count || "retrieved"} sources`;

  const steps = [
    { phase: -1, label: "Question received", detail: "The request stays inside this conversation." },
    { phase: 0, label: "Retrieve passages", detail: "Search the server-side BM25F index." },
    { phase: 1, label: "Rank evidence", detail: count ? `Selected ${count} passages with source diversity.` : "Prefer current and authoritative sources." },
    { phase: 2, label: "Draft with citations", detail: "Stream claims with exact S1, S2 source links." },
  ];
  const current = phaseOrder[phase];

  return (
    <section className="chat-progress" data-expanded={expanded}>
      <span className="sr-only" aria-live="polite">{label}</span>
      <div className="chat-progress-head">
        <span className="chat-progress-orbit" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <button
          aria-controls={detailsId}
          aria-expanded={expanded}
          className="chat-progress-toggle"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          <span>
            <strong>{label}</strong>
            <small>{elapsed ? `${elapsed}s elapsed` : "Starting now"}</small>
          </span>
          <ChevronDown aria-hidden="true" size={15} />
        </button>
        <button className="chat-progress-stop" onClick={onStop} type="button">
          <Square aria-hidden="true" size={10} fill="currentColor" />
          <span>Stop</span>
        </button>
      </div>

      <div className="chat-progress-steps" hidden={!expanded} id={detailsId}>
        {steps.map((step) => {
          const state = step.phase < current ? "complete" : step.phase === current ? "active" : "pending";
          return (
            <div className="chat-progress-step" data-state={state} key={step.label}>
              <span aria-hidden="true" />
              <div>
                <strong>{step.label}</strong>
                <small>{step.detail}</small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
