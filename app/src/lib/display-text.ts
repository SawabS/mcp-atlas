import type {
  GraphData,
  KnowledgeDocument,
  KnowledgeDocumentSummary,
  RegistryServer,
} from "@/lib/knowledge-types";

const decorativeEmoji = /(?:\p{Extended_Pictographic}\uFE0F?|[\uFE0F\u200D\u2713\u2717\u2611\u2610\u2715\u2726\u26F6])/gu;

export function withoutDecorativeEmoji(value: string) {
  return value.replace(decorativeEmoji, "");
}

export function displayText(value: string) {
  return withoutDecorativeEmoji(value)
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .trim();
}

export function displayMarkdown(value: string) {
  return withoutDecorativeEmoji(value);
}

type MarkdownSource = Pick<KnowledgeDocument, "repository" | "sourcePath" | "commit">;

const protectedMarkdown = /```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`/g;

/**
 * The source corpus contains MDX written for documentation-site components.
 * Streamdown intentionally renders Markdown rather than arbitrary React MDX,
 * so translate the small presentation vocabulary into portable Markdown while
 * leaving fenced and inline code byte-for-byte intact.
 */
export function displaySourceMarkdown(value: string, source?: MarkdownSource) {
  const segments: string[] = [];
  const protectedValue = withoutDecorativeEmoji(value).replace(protectedMarkdown, (segment) => {
    const token = `\u0000INDEX_SEGMENT_${segments.length}\u0000`;
    segments.push(segment);
    return token;
  });

  let markdown = protectedValue
    .replace(/<Card\b([^>]*)>([\s\S]*?)<\/Card\s*>/gi, (_match, attributes: string, body: string) => {
      const title = componentAttribute(attributes, "title") || "Learn more";
      const href = componentAttribute(attributes, "href");
      const heading = href ? `[${title}](${resolveComponentHref(href, source)})` : title;
      const copy = dedentComponentBody(body);
      return `\n### ${heading}${copy ? `\n\n${copy}` : ""}\n`;
    })
    .replace(/<Card\b([^>]*)\/>/gi, (_match, attributes: string) => {
      const title = componentAttribute(attributes, "title") || "Learn more";
      const href = componentAttribute(attributes, "href");
      return href ? `\n- [${title}](${resolveComponentHref(href, source)})\n` : `\n- ${title}\n`;
    })
    .replace(
      /<(Tab|Step|Accordion)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi,
      (_match, name: string, attributes: string, body: string) => {
        const title = componentAttribute(attributes, "title") || componentAttribute(attributes, "value") || name;
        return `\n#### ${title}\n\n${dedentComponentBody(body)}\n`;
      },
    )
    .replace(
      /<(Warning|Info|Note|Tip|Danger)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi,
      (_match, name: string, body: string) => {
        const copy = dedentComponentBody(body).replace(/\n/g, "\n> ");
        return `\n> **${name}:** ${copy}\n`;
      },
    )
    .replace(/<(Badge|Tooltip)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi, "$2")
    .replace(/<Icon\b[^>]*\/?>/gi, "")
    .replace(/<(?:Badge|Tooltip)\b[^>]*\/>/gi, "")
    .replace(/^\s*<\/?(?:CardGroup|Columns?|Tabs|Steps|AccordionGroup)\b[^>]*>\s*$/gim, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n");

  segments.forEach((segment, index) => {
    markdown = markdown.replace(`\u0000INDEX_SEGMENT_${index}\u0000`, segment);
  });
  return markdown;
}

function componentAttribute(attributes: string, name: string) {
  const match = attributes.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return match?.[1] ?? match?.[2] ?? "";
}

function dedentComponentBody(value: string) {
  const lines = value.replace(/^\n+|\n+$/g, "").split("\n");
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(indent)).join("\n").trim();
}

function resolveComponentHref(href: string, source?: MarkdownSource) {
  if (/^(?:https?:|mailto:|#)/i.test(href)) return href;
  if (href.startsWith("/docs/")) return `https://modelcontextprotocol.io${href}`;
  if (!source) return href;

  const revision = source.commit || "main";
  const base = source.sourcePath.split("/").slice(0, -1);
  const parts = (href.startsWith("/") ? href.slice(1).split("/") : [...base, ...href.split("/")]).filter(Boolean);
  const resolved: string[] = [];
  parts.forEach((part) => {
    if (part === ".") return;
    if (part === "..") resolved.pop();
    else resolved.push(part);
  });
  return `https://github.com/${source.repository}/blob/${revision}/${resolved.join("/")}`;
}

function displayDocumentSummary<T extends KnowledgeDocumentSummary>(document: T): T {
  return {
    ...document,
    title: withoutEmDash(displayText(document.title)),
    excerpt: withoutEmDash(displayText(document.excerpt)),
    headings: document.headings.map((heading) => withoutEmDash(displayText(heading))).filter(Boolean),
  };
}

export function displayDocuments(documents: KnowledgeDocumentSummary[]) {
  return documents.map(displayDocumentSummary);
}

export function displayDocument(document: KnowledgeDocument): KnowledgeDocument {
  return {
    ...displayDocumentSummary(document),
    content: displaySourceMarkdown(document.content, document),
  };
}

export function displayGraph(graph: GraphData): GraphData {
  return {
    ...graph,
    nodes: graph.nodes.map((node) => ({
      ...node,
      label: withoutEmDash(displayText(node.label)),
      summary: withoutEmDash(displayText(node.summary)),
    })),
  };
}

/*
 * House style has no em dash, so titles, excerpts, headings, graph copy and
 * registry text are normalised on the way to the screen.
 *
 * The one exception is the reader's document body in displayDocument. That is
 * the quotation itself, shown next to a "View exact commit" link, so it stays
 * byte for byte as published.
 */
function withoutEmDash(value: string) {
  return value
    .replace(/\s*[—―]\s*/g, ", ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",");
}

export function displayRegistry(servers: RegistryServer[]): RegistryServer[] {
  return servers.map((server) => ({
    ...server,
    title: withoutEmDash(displayText(server.title)),
    description: withoutEmDash(displayText(server.description)),
  }));
}

export function documentAssetUrl(url: string, document: KnowledgeDocument) {
  if (!url.startsWith("/images/") || !document.commit) return url;

  let assetRoot = "";
  if (document.repository === "modelcontextprotocol/modelcontextprotocol") {
    assetRoot = document.sourcePath.startsWith("blog/") ? "blog/static" : "docs";
  } else if (document.repository === "modelcontextprotocol/java-sdk") {
    assetRoot = "docs";
  } else if (document.repository === "modelcontextprotocol/inspector") {
    assetRoot = "clients/tui";
  }

  const path = `${assetRoot}${url}`.replace(/^\//, "");
  return `https://raw.githubusercontent.com/${document.repository}/${document.commit}/${path}`;
}
