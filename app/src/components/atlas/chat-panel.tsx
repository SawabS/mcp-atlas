"use client";

import { useEffect, useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Copy, ExternalLink, GripVertical, PanelLeft, PanelRight, PanelRightClose, RotateCcw, Sparkles } from "lucide-react";
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
  const transport = useMemo(() => new DefaultChatTransport({ api: chatEndpoint(), body: { model } }), [model]);
  const { messages, sendMessage, status, stop, error, setMessages } = useChat({ transport });

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
      const maximum = Math.min(720, window.innerWidth - 420);
      onResize(Math.max(360, Math.min(maximum, startWidth + delta)));
    };
    const finish = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish, { once: true });
  };

  const resizeWithKeyboard = (direction: number) => {
    const delta = dock === "right" ? -direction : direction;
    onResize(Math.max(360, Math.min(720, width + delta * 24)));
  };

  return (
    <aside className={`chat-panel dock-${dock} ${open ? "is-open" : ""}`} aria-label="Ask Atlas" aria-hidden={!open} inert={!open}>
      <button className="chat-resize-handle" type="button" aria-label="Resize chat panel" onPointerDown={startResize} onKeyDown={(event) => { if (event.key === "ArrowLeft") resizeWithKeyboard(-1); if (event.key === "ArrowRight") resizeWithKeyboard(1); }}><GripVertical size={15} /></button>
      <header className="chat-header"><div className="atlas-avatar"><Sparkles size={18} /></div><div><strong>Ask Atlas</strong><span><i /> Grounded in MCP sources</span></div><select value={model} onChange={(event) => setModel(event.target.value as "nemotron" | "kimi")} aria-label="Answer model"><option value="nemotron">Nemotron 3 Ultra</option><option value="kimi" disabled={!kimiEnabled}>Kimi K2.6{kimiEnabled ? "" : " (not provisioned)"}</option></select><button type="button" onClick={() => onDockChange(dock === "right" ? "left" : "right")} aria-label={`Dock chat on the ${dock === "right" ? "left" : "right"}`}>{dock === "right" ? <PanelLeft size={18} /> : <PanelRight size={18} />}</button><button type="button" onClick={onClose} aria-label="Close chat"><PanelRightClose size={18} /></button></header>
      <Conversation className="chat-conversation"><ConversationContent className="chat-messages">
        {!messages.length && <ConversationEmptyState icon={<Bot size={27} />} title="Ask anything about MCP" description="Atlas retrieves relevant passages first, then answers with exact source links."><div className="chat-empty"><div className="empty-orbit"><Bot size={25} /></div><h2>What do you want to understand?</h2><p>Ask about protocol behavior, SDK patterns, security, or the Registry.</p><Suggestions>{starterPrompts.map((prompt) => <Suggestion key={prompt} suggestion={prompt} onClick={submit}>{prompt}</Suggestion>)}</Suggestions></div></ConversationEmptyState>}
        {messages.map((message) => {
          const sources = message.parts.filter((part) => part.type === "source-url");
          const texts = message.parts.filter((part) => part.type === "text");
          return <Message from={message.role} key={message.id} className="atlas-message"><div className="message-role">{message.role === "user" ? "You" : <><span><Sparkles size={12} /></span> Atlas</>}</div><MessageContent>{texts.map((part, index) => message.role === "assistant" ? <MessageResponse key={index} linkSafety={citationLinkSafety}>{linkCitations(part.text, sources)}</MessageResponse> : <p key={index}>{part.text}</p>)}</MessageContent>{sources.length > 0 && <Sources><SourcesTrigger count={sources.length} /><SourcesContent>{sources.map((source) => <Source key={source.sourceId} href={source.url} title={source.title}><span className="source-number">{source.sourceId}</span><span>{source.title}</span><ExternalLink size={12} /></Source>)}</SourcesContent></Sources>}{message.role === "assistant" && texts.length > 0 && <MessageActions><MessageAction tooltip="Copy answer" onClick={() => navigator.clipboard.writeText(texts.map((part) => part.text).join("\n"))}><Copy size={14} /></MessageAction></MessageActions>}</Message>;
        })}
        {error && <div className="chat-error"><strong>Atlas could not answer</strong><span>{error.message}</span></div>}
      </ConversationContent><ConversationScrollButton /></Conversation>
      <div className="chat-composer"><PromptInput onSubmit={(message) => submit(message.text)}><PromptInputBody><PromptInputTextarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about MCP..." /></PromptInputBody><PromptInputFooter><PromptInputTools><span className="grounding-chip"><span className="status-dot" /> Source grounding on</span>{messages.length > 0 && <button className="reset-chat" type="button" onClick={() => setMessages([])}><RotateCcw size={13} /> Clear</button>}</PromptInputTools><PromptInputSubmit status={status} onStop={stop} /></PromptInputFooter></PromptInput><p>Atlas can make mistakes. Verify critical details using the linked sources.</p></div>
    </aside>
  );
}
