"use client";

import { mermaid } from "@streamdown/mermaid";
import { CheckIcon, CopyIcon, DownloadIcon, Maximize2Icon, XIcon } from "lucide-react";
import {
  isValidElement,
  type ComponentProps,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { CodeBlock, type ExtraProps } from "streamdown";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ActionState = "idle" | "success" | "error";

const languageExtensions: Record<string, string> = {
  bash: "sh",
  c: "c",
  "c#": "cs",
  cpp: "cpp",
  css: "css",
  go: "go",
  html: "html",
  java: "java",
  javascript: "js",
  json: "json",
  jsx: "jsx",
  kotlin: "kt",
  markdown: "md",
  mermaid: "mmd",
  php: "php",
  python: "py",
  ruby: "rb",
  rust: "rs",
  sh: "sh",
  shell: "sh",
  swift: "swift",
  ts: "ts",
  tsx: "tsx",
  typescript: "ts",
  xml: "xml",
  yaml: "yml",
};

function childrenToText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return childrenToText(children.props.children);
  }
  return "";
}

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some browsers expose the API but reject it outside an active gesture.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("The browser denied clipboard access.");
}

function useActionFeedback() {
  const [state, setState] = useState<ActionState>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const report = (nextState: Exclude<ActionState, "idle">) => {
    setState(nextState);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setState("idle"), 1800);
  };

  return [state, report] as const;
}

function ActionIcon({ state, idle }: { state: ActionState; idle: ReactNode }) {
  if (state === "success") return <CheckIcon aria-hidden size={15} />;
  if (state === "error") return <XIcon aria-hidden size={15} />;
  return idle;
}

function CopyCodeButton({ code }: { code: string }) {
  const [state, report] = useActionFeedback();
  const label = state === "success" ? "Code copied" : state === "error" ? "Copy failed" : "Copy code";

  return (
    <button
      aria-label={label}
      data-code-action="copy"
      data-status={state}
      onClick={async () => {
        try {
          await writeClipboard(code);
          report("success");
        } catch {
          report("error");
        }
      }}
      title={label}
      type="button"
    >
      <ActionIcon state={state} idle={<CopyIcon aria-hidden size={15} />} />
      <span className="sr-only" aria-live="polite">{label}</span>
    </button>
  );
}

function DownloadCodeButton({ code, language }: { code: string; language: string }) {
  const [state, report] = useActionFeedback();
  const label = state === "success" ? "Code downloaded" : state === "error" ? "Download failed" : "Download code";

  return (
    <button
      aria-label={label}
      data-code-action="download"
      data-status={state}
      onClick={() => {
        try {
          const extension = languageExtensions[language.toLowerCase()] ?? "txt";
          const url = URL.createObjectURL(new Blob([code], { type: "text/plain;charset=utf-8" }));
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = `example.${extension}`;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          window.setTimeout(() => URL.revokeObjectURL(url), 1000);
          report("success");
        } catch {
          report("error");
        }
      }}
      title={label}
      type="button"
    >
      <ActionIcon state={state} idle={<DownloadIcon aria-hidden size={15} />} />
      <span className="sr-only" aria-live="polite">{label}</span>
    </button>
  );
}

function FullscreenButton({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button aria-label={`Expand ${title}`} data-code-action="fullscreen" title={`Expand ${title}`} type="button">
          <Maximize2Icon aria-hidden size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="code-fullscreen-dialog">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="code-fullscreen-body">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * IndexMarkdownCode (below) replaces streamdown's default `code` renderer
 * entirely, which is also what detects and renders mermaid fences — so
 * without this, a ```mermaid block would just show as highlighted text.
 * This renders the diagram directly against the same mermaid plugin
 * instance streamdown's own plugin config uses.
 */
function MermaidDiagram({ code }: { code: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const id = `mermaid-${useId().replace(/:/g, "")}`;

  // The parent keys this component by `code`, so a new diagram is a fresh
  // mount with fresh initial state — no manual reset needed here.
  useEffect(() => {
    let live = true;
    mermaid
      .getMermaid()
      .render(id, code)
      .then(({ svg: rendered }) => {
        if (live) setSvg(rendered);
      })
      .catch((cause: unknown) => {
        if (live) setError(cause instanceof Error ? cause.message : "Failed to render diagram.");
      });
    return () => {
      live = false;
    };
  }, [code, id]);

  // A diagram that fails to parse still has a source worth reading, so
  // fall back to the plain code view rather than showing nothing.
  if (error) {
    return (
      <CodeBlock code={code} language="mermaid">
        <DownloadCodeButton code={code} language="mermaid" />
        <CopyCodeButton code={code} />
      </CodeBlock>
    );
  }

  const diagram = svg ? (
    <div className="mermaid-block-svg" dangerouslySetInnerHTML={{ __html: svg }} />
  ) : (
    <span className="mermaid-block-status">Rendering diagram…</span>
  );

  return (
    <div className="mermaid-block">
      <div className="mermaid-block-header">
        <span>mermaid</span>
        <div className="mermaid-block-actions">
          <DownloadCodeButton code={code} language="mermaid" />
          <CopyCodeButton code={code} />
          {svg && <FullscreenButton title="mermaid diagram">{diagram}</FullscreenButton>}
        </div>
      </div>
      <div className="mermaid-block-body">{diagram}</div>
    </div>
  );
}

type MarkdownCodeProps = ComponentProps<"code"> & ExtraProps;

export function IndexMarkdownCode({ children, className, node: _node, ...props }: MarkdownCodeProps) {
  void _node;
  const attributes = props as Record<string, unknown>;
  const isBlock = "data-block" in attributes;

  if (!isBlock) {
    return <code className={className} {...props}>{children}</code>;
  }

  const language = className?.match(/language-([\w#+.-]+)/)?.[1] ?? "text";
  const code = childrenToText(children).replace(/\n$/, "");

  if (language === "mermaid") {
    return <MermaidDiagram code={code} key={code} />;
  }

  return (
    <CodeBlock code={code} language={language}>
      <DownloadCodeButton code={code} language={language} />
      <CopyCodeButton code={code} />
      <FullscreenButton title={`${language} code`}>
        <CodeBlock code={code} language={language} />
      </FullscreenButton>
    </CodeBlock>
  );
}
