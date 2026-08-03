"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Square } from "lucide-react";
import type { ChatStatus } from "ai";
import type { IndexProgress } from "@/lib/knowledge-types";

type ChatProgressProps = {
  progress?: IndexProgress;
  sourceCount: number;
  status: ChatStatus;
  onStop: () => void;
};

const phaseOrder = { retrieving: 0, ranking: 1, drafting: 2 } as const;

export function ChatProgress({ progress, sourceCount, status, onStop }: ChatProgressProps) {
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
    ? "Searching official MCP sources"
    : phase === "ranking"
      ? `Selecting the best ${count || "retrieved"} passages`
      : "Writing the grounded answer";

  const steps = [
    { phase: -1, label: "Request accepted", detail: "Your question is ready for retrieval." },
    { phase: 0, label: "Search the official corpus", detail: "Find relevant passages in the local BM25F index." },
    { phase: 1, label: "Select the evidence", detail: count ? `Keep the ${count} strongest, source-diverse passages.` : "Prefer current, authoritative sources." },
    /*
     * The card stays up through drafting, until the first token arrives, so
     * this last step is the one the reader watches most of the time.
     */
    { phase: 2, label: "Write the answer", detail: count ? `Answer from the ${count} selected passages, citing as it goes.` : "Answer from the selected passages, citing as it goes." },
  ];
  const current = phaseOrder[phase];

  return (
    <section className="chat-progress" data-expanded={expanded}>
      <span className="sr-only" aria-live="polite">{label}</span>
      <div className="chat-progress-head">
        <span className="chat-progress-orbit" aria-hidden="true">
          <span className="chat-progress-orbit-track">
            <i /><i /><i />
          </span>
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
          const stateLabel = state === "complete" ? "Done" : state === "active" ? "In progress" : "Waiting";
          return (
            <div className="chat-progress-step" data-state={state} key={step.label}>
              <span aria-hidden="true" />
              <div>
                <strong>{step.label}<em>{stateLabel}</em></strong>
                <small>{step.detail}</small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
