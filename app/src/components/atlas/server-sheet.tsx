"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type UIEvent } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Box,
  CalendarClock,
  Cloud,
  ExternalLink,
  Fingerprint,
  GitFork,
  Globe,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import type { RegistryServer } from "@/lib/knowledge-types";

type ServerSheetProps = {
  server: RegistryServer;
  onClose: () => void;
  onAsk: (question: string) => void;
};

/**
 * A registry record read as a page rather than a redirect. The body is markdown
 * that Atlas composes from the record, so it renders with the same typography
 * as every other document in the app.
 */
export function ServerSheet({ server, onClose, onAsk }: ServerSheetProps) {
  const [progress, setProgress] = useState(0);
  const sheetRef = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const markdown = useMemo(() => serverMarkdown(server), [server]);
  const transports = useMemo(
    () => [
      ...new Set(
        [...server.remotes.map((item) => item.type), ...server.packages.map((item) => item.transport)].filter(
          (value): value is string => Boolean(value),
        ),
      ),
    ],
    [server],
  );

  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    sheetRef.current?.focus({ preventScroll: true });
    document.body.dataset.locked = "true";
    return () => {
      document.body.dataset.locked = "false";
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, []);

  /* Escape closes this sheet before the shell sees the key. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  const onScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const span = element.scrollHeight - element.clientHeight;
    setProgress(span > 0 ? Math.min(1, element.scrollTop / span) : 0);
  }, []);

  /* Hand off to the Ask panel, which sits below this sheet, so close it first. */
  const ask = () => {
    onClose();
    onAsk(
      `What is the "${server.title}" MCP server (${server.name}), what does it expose, and what should I check before connecting a client to it?`,
    );
  };

  /*
   * Rendered into the body. The registry view animates a transform, which would
   * otherwise become the containing block for this fixed overlay and stretch it
   * to the full height of the page behind it.
   */
  return createPortal(
    <div
      className="scrim"
      role="dialog"
      aria-modal="true"
      aria-label={`${server.title} registry record`}
      onMouseDown={onClose}
    >
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
          <span className="grow">{server.name}</span>
          {server.repositoryUrl && (
            <a
              className="icon-btn"
              href={server.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open the repository"
            >
              <GitFork size={16} />
            </a>
          )}
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </header>

        <div className="sheet-body" onScroll={onScroll}>
          <main>
            <div className="doc-head">
              <span className="badge" data-kind="registry">
                <i />
                registry record
              </span>
              <h1>{server.title}</h1>
              <p className="lede">{server.description || "This record carries no description."}</p>
              <div className="doc-actions">
                <button className="btn btn-sm btn-primary" type="button" onClick={ask}>
                  <Sparkles size={14} /> Ask Atlas about this server
                </button>
                {server.repositoryUrl && (
                  <a className="btn btn-sm" href={server.repositoryUrl} target="_blank" rel="noreferrer">
                    <GitFork size={14} /> Repository
                  </a>
                )}
                {server.websiteUrl && (
                  <a className="btn btn-sm" href={server.websiteUrl} target="_blank" rel="noreferrer">
                    <Globe size={14} /> Website <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            <div className="prose">
              <MessageResponse mode="static">{markdown}</MessageResponse>
            </div>
          </main>

          <aside className="meta-rail" aria-label="Registry details">
            <div className="meta-block">
              <span className="eyebrow">Record</span>
              <div className="meta-item">
                <Fingerprint size={15} />
                <span>
                  <small>Identifier</small>
                  <code>{server.name}</code>
                </span>
              </div>
              <div className="meta-item">
                <Tag size={15} />
                <span>
                  <small>Version</small>
                  <b>{server.version ?? "not reported"}</b>
                </span>
              </div>
              <div className="meta-item">
                <CalendarClock size={15} />
                <span>
                  <small>Last updated</small>
                  <b>
                    {server.updatedAt
                      ? new Date(server.updatedAt).toLocaleDateString("en", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "not reported"}
                  </b>
                </span>
              </div>
            </div>

            {transports.length > 0 && (
              <div className="meta-block">
                <span className="eyebrow">Transports</span>
                <div className="tag-row">
                  {transports.map((kind) => (
                    <span className="tag" key={kind}>
                      <Cloud size={11} />
                      {kind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {server.packages.length > 0 && (
              <div className="meta-block">
                <span className="eyebrow">Distributions</span>
                <div className="tag-row">
                  {[...new Set(server.packages.map((item) => item.type).filter(Boolean))].map((type) => (
                    <span className="tag" key={type}>
                      <Box size={11} />
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="meta-block">
              <span className="eyebrow">Safety</span>
              <p className="meta-note">
                Registry records are third-party metadata. Atlas lists packages and endpoints and never fetches,
                installs, or runs them.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </div>,
    document.body,
  );
}

/* Registry text is untrusted, so neutralise anything that could steer markdown. */
function inline(value: string | null) {
  if (!value) return "";
  return value.replace(/\s+/g, " ").replace(/[\\`*_[\]<>|]/g, (character) => `\\${character}`).trim();
}

function cell(value: string | null) {
  return inline(value) || "not reported";
}

function code(value: string | null) {
  if (!value) return "not reported";
  return `\`${value.replace(/[`|]/g, "")}\``;
}

function serverMarkdown(server: RegistryServer) {
  const lines: string[] = ["## What this server does", ""];
  lines.push(inline(server.description) || "_The registry record carries no description._", "");

  if (server.packages.length) {
    lines.push("## Packaged distributions", "", "| Registry | Identifier | Transport |", "| --- | --- | --- |");
    server.packages.forEach((item) => {
      lines.push(`| ${cell(item.type)} | ${code(item.identifier)} | ${cell(item.transport)} |`);
    });
    lines.push("");
  }

  if (server.remotes.length) {
    lines.push("## Remote endpoints", "", "| Type | URL |", "| --- | --- |");
    server.remotes.forEach((item) => {
      lines.push(`| ${cell(item.type)} | ${code(item.url)} |`);
    });
    lines.push("");
  }

  if (!server.packages.length && !server.remotes.length) {
    lines.push(
      "## Distribution",
      "",
      "This record lists neither a package nor a remote endpoint, so there is no documented way to connect to it yet.",
      "",
    );
  }

  lines.push(
    "## How to read this record",
    "",
    "Registry records are mirrored from the official MCP Registry and are treated as untrusted metadata. The publisher controls every field above. Confirm the repository and the publisher before you point a client at any server listed here.",
  );

  return lines.join("\n");
}
