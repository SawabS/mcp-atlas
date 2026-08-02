"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Copy, ExternalLink, GripVertical, PanelLeft, PanelRight, RotateCcw, Sparkles, X } from "lucide-react";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@/components/ai-elements/prompt-input";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { chatEndpoint } from "@/lib/client-data";

const starterPrompts = ["Explain MCP architecture", "Tools versus resources", "Secure remote servers"];
const citationLinkSafety = { enabled: false } as const;

function linkCitations(text: string, sources: Array<{ sourceId: string; url: string }>) {
  const urls = new Map(sources.map((source) => [source.sourceId, source.url]));
  return text.replace(/\[(S\d+)](?!\()/g, (marker, sourceId: string) => {
    const url = urls.get(sourceId);
    return url ? `[${sourceId}](${url})` : marker;
  });
}

type ChatPanelProps = {
  open: boolean;
  initialQuestion: string;
  dock: "left" | "right";
  width: number;
  onClose: () => void;
  onDockChange: (dock: "left" | "right") => void;
  onResize: (width: number) => void;
  onQuestionConsumed: () => void;
};

export function ChatPanel({ open, initialQuestion, dock, width, onClose, onDockChange, onResize, onQuestionConsumed }: ChatPanelProps) {
  const kimiEnabled = process.env.NEXT_PUBLIC_ENABLE_KIMI === "true";
  const [model, setModel] = useState<"nemotron" | "kimi">("nemotron");
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: chatEndpoint(), body: { model } }), [model]);
  const { messages, sendMessage, status, stop, error, setMessages } = useChat({ transport });
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusDelay = window.matchMedia("(min-width: 981px)").matches ? 280 : 0;
    const timeout = window.setTimeout(() => {
      if (focusDelay > 0) {
        panelRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus({ preventScroll: true });
      }
    }, focusDelay);
    return () => {
      window.clearTimeout(timeout);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (open && initialQuestion) {
      sendMessage({ text: initialQuestion });
      onQuestionConsumed();
    }
  }, [initialQuestion, onQuestionConsumed, open, sendMessage]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || status === "streaming" || status === "submitted") return;
    sendMessage({ text: value });
    setInput("");
  };

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    const move = (moveEvent: PointerEvent) => {
      const delta = dock === "right" ? startX - moveEvent.clientX : moveEvent.clientX - startX;
      const maximum = Math.max(400, Math.min(760, window.innerWidth - 96));
      onResize(Math.max(400, Math.min(maximum, startWidth + delta)));
    };
    const finish = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish, { once: true });
  };

  const resizeWithKeyboard = (direction: number) => {
    const delta = dock === "right" ? -direction : direction;
    onResize(Math.max(400, Math.min(760, width + delta * 24)));
  };

  return (
    <aside ref={panelRef} className={`chat-panel dock-${dock} ${open ? "is-open" : ""}`} aria-label="Ask Atlas" aria-hidden={!open} inert={!open}>
      <button className="chat-resize-handle" type="button" aria-label="Resize chat panel" onPointerDown={startResize} onKeyDown={(event) => { if (event.key === "ArrowLeft") resizeWithKeyboard(-1); if (event.key === "ArrowRight") resizeWithKeyboard(1); }}><GripVertical size={15} /></button>
      <header className="chat-header"><div className="atlas-avatar"><Sparkles size={18} /></div><div><strong>Ask Atlas</strong><span><i /> Grounded in exact MCP sources</span></div><select value={model} onChange={(event) => setModel(event.target.value as "nemotron" | "kimi")} aria-label="Answer model"><option value="nemotron">Nemotron 3 Ultra</option><option value="kimi" disabled={!kimiEnabled}>Kimi K2.6{kimiEnabled ? "" : " (not provisioned)"}</option></select><button type="button" onClick={() => onDockChange(dock === "right" ? "left" : "right")} aria-label={`Dock chat on the ${dock === "right" ? "left" : "right"}`}>{dock === "right" ? <PanelLeft size={18} /> : <PanelRight size={18} />}</button><button type="button" onClick={onClose} aria-label="Close chat"><X size={18} /></button></header>
      <Conversation className="chat-conversation"><ConversationContent className="chat-messages">
        {!messages.length && <ConversationEmptyState icon={<Bot size={27} />} title="Ask anything about MCP" description="Atlas retrieves relevant passages first, then answers with exact source links."><div className="chat-empty"><div className="empty-orbit"><Bot size={25} /></div><h2>What do you want to understand?</h2><p>Ask about protocol behavior, SDK patterns, security, or the Registry.</p><Suggestions className="chat-suggestions">{starterPrompts.map((prompt) => <Suggestion key={prompt} suggestion={prompt} onClick={submit}>{prompt}</Suggestion>)}</Suggestions></div></ConversationEmptyState>}
        {messages.map((message, messageIndex) => {
          const sources = message.parts.filter((part) => part.type === "source-url");
          const texts = message.parts.filter((part) => part.type === "text");
          const animateResponse = isBusy && messageIndex === messages.length - 1 && message.role === "assistant";
          return <Message from={message.role} key={message.id} className="atlas-message"><div className="message-role">{message.role === "user" ? "You" : <><span><Sparkles size={12} /></span> Atlas</>}</div><MessageContent>{texts.map((part, index) => message.role === "assistant" ? <MessageResponse key={index} linkSafety={citationLinkSafety} isAnimating={animateResponse} lineNumbers>{linkCitations(part.text, sources)}</MessageResponse> : <p key={index}>{part.text}</p>)}</MessageContent>{sources.length > 0 && <Sources><SourcesTrigger count={sources.length} /><SourcesContent>{sources.map((source) => <Source key={source.sourceId} href={source.url} title={source.title}><span className="source-number">{source.sourceId}</span><span>{source.title}</span><ExternalLink size={12} /></Source>)}</SourcesContent></Sources>}{message.role === "assistant" && texts.length > 0 && <MessageActions><MessageAction tooltip="Copy answer" onClick={() => navigator.clipboard.writeText(texts.map((part) => part.text).join("\n"))}><Copy size={14} /></MessageAction></MessageActions>}</Message>;
        })}
        {isBusy && <div className="chat-thinking" role="status" aria-live="polite"><span className="chat-thinking-dots" aria-hidden="true"><i /><i /><i /></span><span>{status === "submitted" ? "Retrieving the most relevant sources" : "Atlas is writing a grounded answer"}</span></div>}
        {error && <div className="chat-error"><strong>Atlas could not answer</strong><span>{error.message}</span></div>}
      </ConversationContent><ConversationScrollButton /></Conversation>
      <div className="chat-composer"><PromptInput onSubmit={(message) => submit(message.text)}><PromptInputBody><PromptInputTextarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about MCP..." aria-label="Ask Atlas a question" /></PromptInputBody><PromptInputFooter><PromptInputTools><span className="grounding-chip"><span className="status-dot" /> Source grounding on</span>{messages.length > 0 && <button className="reset-chat" type="button" onClick={() => setMessages([])}><RotateCcw size={13} /> Clear</button>}</PromptInputTools><PromptInputSubmit status={status} onStop={stop} disabled={!input.trim() && !isBusy} /></PromptInputFooter></PromptInput><p>Atlas can make mistakes. Verify critical details using the linked sources.</p></div>
    </aside>
  );
}
