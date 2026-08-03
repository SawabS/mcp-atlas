"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowRight, Check, ChevronDown, Copy, ExternalLink, RotateCcw, Sparkles, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";
import { ChatProgress } from "@/components/mcp-index/chat-progress";
import {
  indexMessageComponents,
  CitationSourcesProvider,
} from "@/components/mcp-index/citation-link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mark } from "@/components/mcp-index/mark";
import { ProviderMark, providerName, type Provider } from "@/components/mcp-index/provider-mark";
import { getSourceIdentity, SourceGlyph } from "@/components/mcp-index/source-identity";
import { chatEndpoint } from "@/lib/client-data";
import { displayMarkdown, displayText } from "@/lib/display-text";
import type { IndexUIMessage } from "@/lib/knowledge-types";

const seeds = [
  "How does the stateless protocol handshake work?",
  "Tools versus resources: when do I use each?",
  "How should I secure a remote MCP server?",
];

type ModelKey = "nemotron" | "kimi" | "deepseek" | "glm";

const models: Array<{ key: ModelKey; label: string; provider: Provider }> = [
  { key: "nemotron", label: "Nemotron 3 Ultra", provider: "nvidia" },
  { key: "kimi", label: "Kimi K2.6", provider: "moonshot" },
  { key: "deepseek", label: "DeepSeek V4 Flash", provider: "deepseek" },
  { key: "glm", label: "GLM 5.2", provider: "zai" },
];

const linkSafety = { enabled: false } as const;

/** Route errors arrive as a JSON envelope; show the sentence, not the wrapper. */
function readableError(message: string) {
  const trimmed = message.trim();
  if (!trimmed.startsWith("{")) return trimmed;
  try {
    const parsed = JSON.parse(trimmed) as { error?: string };
    return parsed.error ?? trimmed;
  } catch {
    return trimmed;
  }
}

/** Every [S…] label the answer actually used, once the invented ones are gone. */
function citedIds(text: string, known: Set<string>): Set<string> {
  const found = new Set<string>();
  for (const match of text.matchAll(/\[(S\d+)]/gi)) {
    const id = match[1].toUpperCase();
    if (known.has(id)) found.add(id);
  }
  return found;
}

/**
 * Turns citation markers into links to the exact passage.
 *
 * Models occasionally cite a label that was never supplied, or staple the whole
 * list onto one sentence. Unknown labels are dropped rather than left as literal
 * text, and a run of markers is de-duplicated so it reads as a reference list.
 */
function linkCitations(text: string, sources: Array<{ sourceId: string; url: string }>) {
  const urls = new Map(sources.map((source) => [source.sourceId.toUpperCase(), source.url]));
  return (
    text
      // "[S1, S2]" and "[S1; S2]" mean the same as "[S1][S2]".
      .replace(/\[(S\d+(?:\s*[,;]\s*S\d+)+)]/gi, (_match, group: string) =>
        group
          .split(/\s*[,;]\s*/)
          .map((id) => `[${id.trim().toUpperCase()}]`)
          .join(""),
      )
      .replace(/(?:\[S\d+](?!\())+/gi, (run) => {
        const ids = [...new Set((run.match(/S\d+/gi) ?? []).map((id) => id.toUpperCase()))];
        return ids
          .filter((id) => urls.has(id))
          .map((id) => `[${id}](${urls.get(id)})`)
          .join("");
      })
  );
}

type AskProps = {
  open: boolean;
  seed: { id: number; text: string } | null;
  readyModels: string[];
  onClose: () => void;
  onSeedUsed: () => void;
};

export function Ask({ open, seed, readyModels, onClose, onSeedUsed }: AskProps) {
  /* Resolved on the server from the configured keys. Empty means unknown. */
  const ready = useMemo(() => new Set(readyModels), [readyModels]);
  const [model, setModel] = useState<ModelKey>("nemotron");
  const [input, setInput] = useState("");
  const [width, setWidth] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const usedSeed = useRef<number | null>(null);
  const panelRef = useRef<HTMLElement>(null);

  const active = models.find((option) => option.key === model) ?? models[0];
  const transport = useMemo(() => new DefaultChatTransport({ api: chatEndpoint(), body: { model } }), [model]);
  const { messages, sendMessage, status, stop, error, setMessages } = useChat<IndexUIMessage>({ transport });
  const busy = status === "submitted" || status === "streaming";
  /*
   * While a turn is in flight the last message is the user's until the model
   * opens its own, so the live answer is only ever the trailing assistant one.
   */
  const lastMessage = messages.at(-1);
  const liveMessage = lastMessage?.role === "assistant" ? lastMessage : undefined;
  const liveSources = liveMessage?.parts.filter((part) => part.type === "source-url") ?? [];
  const liveProgress = liveMessage?.parts
    .filter((part) => part.type === "data-progress")
    .at(-1)?.data;
  const liveHasText = Boolean(
    liveMessage?.parts.some((part) => part.type === "text" && part.text.trim()),
  );
  /*
   * Retrieval streams its sources before the model writes a word, so the panel
   * would otherwise open with a source list and no answer. The progress card
   * stands in for the whole pre-answer window, from submit to first token, and
   * gives way the moment prose starts arriving.
   */
  const showRetrievalProgress = busy && !liveHasText;

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus({ preventScroll: true });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || !seed || usedSeed.current === seed.id) return;
    usedSeed.current = seed.id;
    onSeedUsed();
    sendMessage({ text: seed.text });
  }, [onSeedUsed, open, seed, sendMessage]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput("");
  };

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      window.setTimeout(() => setCopied((current) => (current === id ? null : current)), 1600);
    });
  };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = panelRef.current?.getBoundingClientRect().width ?? 460;
    const move = (moveEvent: PointerEvent) => {
      const next = startWidth + (startX - moveEvent.clientX);
      setWidth(Math.max(360, Math.min(760, next)));
    };
    const finish = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", move);
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish, { once: true });
  };

  if (!open) return null;

  return (
    <>
      <div className="ask-scrim" role="presentation" onClick={onClose} />
      <aside
        ref={panelRef}
        className="ask"
        aria-label="Ask Index"
        style={width ? ({ width: `${width}px` } as CSSProperties) : undefined}
      >
        <button className="ask-drag" type="button" aria-label="Resize panel" onPointerDown={startResize} />

        <header className="ask-head">
          <Mark />
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>Ask Index</strong>
          </div>
          <Select value={model} onValueChange={(value) => setModel(value as ModelKey)}>
            <SelectTrigger className="model-select" size="sm" aria-label="Answer model">
              <SelectValue>
                <ProviderMark provider={active.provider} />
                <span className="model-name">{active.label}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="model-menu">
              {models.map((option) => {
                const unavailable = ready.size > 0 && !ready.has(option.key);
                return (
                  <SelectItem key={option.key} value={option.key} disabled={unavailable}>
                    <ProviderMark provider={option.provider} size={24} />
                    <span className="model-option">
                      <b>{option.label}</b>
                      <small>
                        {providerName[option.provider]}
                        {unavailable ? " (no key configured)" : ""}
                      </small>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {messages.length > 0 && (
            <button className="icon-btn" type="button" onClick={() => setMessages([])} aria-label="Clear conversation">
              <RotateCcw size={16} />
            </button>
          )}
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </header>

        <Conversation className="ask-body">
          <ConversationContent className="flex flex-col gap-7 p-4">
            {!messages.length && (
              <div className="ask-empty">
                <span className="ask-halo">
                  <Sparkles size={26} />
                </span>
                <h3>What would you like to understand?</h3>
                <p>Index retrieves the closest official passages first, then answers with links you can verify.</p>
                <div className="ask-seeds">
                  {seeds.map((text) => (
                    <button key={text} type="button" onClick={() => submit(text)}>
                      {text}
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, position) => {
              const sources = message.parts.filter((part) => part.type === "source-url");
              const attributions = message.parts
                .filter((part) => part.type === "data-source")
                .map((part) => part.data);
              const attributionById = new Map(
                attributions.map((source) => [source.sourceId.toUpperCase(), source]),
              );
              const texts = message.parts.filter((part) => part.type === "text");
              const streaming = busy && position === messages.length - 1 && message.role === "assistant";
              const plain = texts.map((part) => part.text).join("\n");
              const known = new Set(sources.map((source) => source.sourceId.toUpperCase()));
              const used = citedIds(plain, known);

              /*
               * An assistant turn that has retrieved but not yet written is
               * represented by the progress card below, not by an empty bubble.
               */
              if (streaming && !plain.trim()) return null;

              /*
               * Sources land while the answer is still being written. Holding
               * them back until the turn settles keeps the reading order
               * answer first, evidence after.
               */
              const showSources = sources.length > 0 && !streaming;

              return (
                <div className={`turn ${message.role === "user" ? "is-user" : ""}`} key={message.id}>
                  <span className="turn-who">
                    {message.role === "user" ? (
                      "You"
                    ) : (
                      <>
                        <Sparkles size={11} /> Index
                      </>
                    )}
                  </span>

                  {message.role === "user" ? (
                    <p
                      style={{
                        alignSelf: "flex-end",
                        maxWidth: "88%",
                        padding: "11px 15px",
                        borderRadius: "16px 16px 4px 16px",
                        border: "1px solid var(--line)",
                        background: "var(--glass-2)",
                        fontSize: 14,
                      }}
                    >
                      {texts.map((part) => displayText(part.text)).join("\n")}
                    </p>
                  ) : (
                    <div className="answer">
                      <CitationSourcesProvider sources={attributions}>
                        {texts.map((part, index) => (
                          <MessageResponse
                            components={indexMessageComponents}
                            key={index}
                            linkSafety={linkSafety}
                            isAnimating={streaming}
                          >
                            {displayMarkdown(linkCitations(part.text, sources))}
                          </MessageResponse>
                        ))}
                      </CitationSourcesProvider>
                    </div>
                  )}

                  {showSources && (
                    <Sources className="sources-block">
                      <SourcesTrigger className="sources-toggle source-summary" count={sources.length}>
                        <span className="source-stack" aria-hidden="true">
                          {sources.slice(0, 3).map((source) => (
                            <span key={source.sourceId}><SourceGlyph url={source.url} size={11} /></span>
                          ))}
                        </span>
                        <span>Sources</span>
                        <small>{used.size} cited · {sources.length} reviewed</small>
                        <ChevronDown aria-hidden="true" size={13} />
                      </SourcesTrigger>
                      <SourcesContent className="flex w-full flex-col gap-1.5">
                        {/*
                         * All retrieved passages are listed, with the ones the
                         * answer actually leaned on marked, so it stays obvious
                         * what was read versus what was used.
                         */}
                        {sources.map((source) => {
                          const details = attributionById.get(source.sourceId.toUpperCase());
                          const title = displayText(details?.title ?? source.title ?? source.sourceId);
                          const heading = displayText(details?.heading ?? "");
                          const description = heading && heading !== title ? `${title}, ${heading}` : title;
                          const identity = getSourceIdentity(source.url);
                          const cited = used.has(source.sourceId.toUpperCase());
                          return (
                            <Source
                              className="source-link"
                              data-cited={cited}
                              key={source.sourceId}
                              href={source.url}
                              title={cited ? `Cited in this answer: ${description}` : description}
                            >
                              <span className="source-icon"><SourceGlyph url={source.url} size={14} /></span>
                              <span className="source-num">{source.sourceId}</span>
                              <span className="source-copy">
                                <strong>{description}</strong>
                                <small>
                                  {identity.label}
                                  {details?.sourcePath ? ` · ${details.sourcePath}` : ` · ${identity.host}`}
                                </small>
                                {details?.excerpt && <span>{details.excerpt}</span>}
                              </span>
                              {cited && <span className="source-tag">cited</span>}
                              <ExternalLink size={12} />
                            </Source>
                          );
                        })}
                      </SourcesContent>
                    </Sources>
                  )}

                  {message.role === "assistant" && plain && !streaming && (
                    <button
                      className="sources-toggle"
                      type="button"
                      onClick={() => copy(message.id, displayMarkdown(plain))}
                    >
                      {copied === message.id ? <Check size={13} /> : <Copy size={13} />}
                      {copied === message.id ? "Copied" : "Copy answer"}
                    </button>
                  )}
                </div>
              );
            })}

            {showRetrievalProgress && (
              <ChatProgress
                onStop={stop}
                progress={liveProgress}
                sourceCount={liveSources.length}
                status={status}
              />
            )}

            {error && (
              <div className="ask-error">
                <strong>Index could not answer.</strong> {readableError(error.message)}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="ask-foot">
          <PromptInput onSubmit={(message) => submit(message.text ?? "")}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about the protocol…"
                aria-label="Ask Index a question"
              />
            </PromptInputBody>
            <PromptInputFooter className="justify-end">
              <PromptInputTools />
              <PromptInputSubmit status={status} onStop={stop} disabled={!input.trim() && !busy} />
            </PromptInputFooter>
          </PromptInput>
          <p>Index can be wrong. Check the linked sources for anything load-bearing.</p>
        </div>
      </aside>
    </>
  );
}
