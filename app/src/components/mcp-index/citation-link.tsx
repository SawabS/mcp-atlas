"use client";

import {
  Children,
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ExternalLink } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { getSourceIdentity, SourceGlyph } from "@/components/mcp-index/source-identity";
import type { IndexSourceAttribution } from "@/lib/knowledge-types";

const EMPTY_SOURCES = new Map<string, IndexSourceAttribution>();
const CitationSourcesContext = createContext(EMPTY_SOURCES);

export function CitationSourcesProvider({
  children,
  sources,
}: {
  children: ReactNode;
  sources: IndexSourceAttribution[];
}) {
  const value = useMemo(
    () => new Map(sources.map((source) => [source.sourceId.toUpperCase(), source])),
    [sources],
  );
  return <CitationSourcesContext.Provider value={value}>{children}</CitationSourcesContext.Provider>;
}

function childText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
    .join("")
    .trim();
}

export function IndexAnswerLink({ children, href = "", ...props }: ComponentProps<"a">) {
  const sources = useContext(CitationSourcesContext);
  const label = childText(children).toUpperCase();
  const source = /^S\d+$/.test(label) ? sources.get(label) : undefined;

  if (!source) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  const identity = getSourceIdentity(source.url);
  const description = source.heading && source.heading !== source.title
    ? `${source.title}, ${source.heading}`
    : source.title;

  return (
    <HoverCard closeDelay={100} openDelay={180}>
      <HoverCardTrigger asChild>
        <a
          {...props}
          aria-label={`${label}, ${description}, ${identity.label}`}
          className="citation-chip"
          href={source.url}
          rel="noreferrer"
          target="_blank"
        >
          <SourceGlyph url={source.url} size={11} />
          <span>{identity.label}</span>
          <b>{label}</b>
        </a>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="citation-preview" sideOffset={8}>
        <div className="citation-preview-site">
          <span><SourceGlyph url={source.url} size={14} /></span>
          <div>
            <strong>{identity.label}</strong>
            <small>{identity.host}</small>
          </div>
          <b>{label}</b>
        </div>
        <strong className="citation-preview-title">{description}</strong>
        <p>{source.excerpt}</p>
        <a className="citation-preview-open" href={source.url} rel="noreferrer" target="_blank">
          Open exact source <ExternalLink size={12} />
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}

export const indexMessageComponents = { a: IndexAnswerLink };
