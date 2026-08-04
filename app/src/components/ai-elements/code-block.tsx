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
 * Mirrors the light/dark tokens in globals.css. Mermaid renders its own SVG
 * fills rather than inheriting CSS, so without this it always draws with its
 * built-in "default" (light, dark-on-white) palette — illegible once that
 * SVG sits inside one of this app's dark cards.
 */
const mermaidThemeVariables = {
  dark: {
    darkMode: true,
    background: "#0a0c17",
    primaryColor: "#161a2e",
    primaryTextColor: "#edeef7",
    primaryBorderColor: "#343a5c",
    secondaryColor: "#0f1122",
    secondaryTextColor: "#edeef7",
    tertiaryColor: "#1c2036",
    tertiaryTextColor: "#edeef7",
    lineColor: "#727890",
    textColor: "#edeef7",
    mainBkg: "#161a2e",
    nodeBorder: "#343a5c",
    clusterBkg: "#0f1122",
    clusterBorder: "#343a5c",
    titleColor: "#edeef7",
    edgeLabelBackground: "#0a0c17",
    actorBkg: "#161a2e",
    actorBorder: "#343a5c",
    actorTextColor: "#edeef7",
    actorLineColor: "#727890",
    signalColor: "#a7acc6",
    signalTextColor: "#edeef7",
    labelBoxBkgColor: "#161a2e",
    labelBoxBorderColor: "#343a5c",
    labelTextColor: "#edeef7",
    loopTextColor: "#a7acc6",
    noteBkgColor: "#3a3320",
    noteTextColor: "#f5e6c8",
    noteBorderColor: "#ffc978",
    activationBkgColor: "#2a2547",
    activationBorderColor: "#8e7bff",
    sequenceNumberColor: "#06070e",
  },
  light: {
    darkMode: false,
    background: "#fdfcfb",
    primaryColor: "#ffffff",
    primaryTextColor: "#101120",
    primaryBorderColor: "#c7c4bd",
    secondaryColor: "#f4f3f0",
    secondaryTextColor: "#101120",
    tertiaryColor: "#eeece7",
    tertiaryTextColor: "#101120",
    lineColor: "#666b80",
    textColor: "#101120",
    mainBkg: "#ffffff",
    nodeBorder: "#c7c4bd",
    clusterBkg: "#f4f3f0",
    clusterBorder: "#c7c4bd",
    titleColor: "#101120",
    edgeLabelBackground: "#fdfcfb",
    actorBkg: "#ffffff",
    actorBorder: "#c7c4bd",
    actorTextColor: "#101120",
    actorLineColor: "#666b80",
    signalColor: "#4b4f64",
    signalTextColor: "#101120",
    labelBoxBkgColor: "#ffffff",
    labelBoxBorderColor: "#c7c4bd",
    labelTextColor: "#101120",
    loopTextColor: "#4b4f64",
    noteBkgColor: "#fbf1da",
    noteTextColor: "#4a3a0c",
    noteBorderColor: "#a9720a",
    activationBkgColor: "#ece8fb",
    activationBorderColor: "#5b45e0",
    sequenceNumberColor: "#ffffff",
  },
} as const;

/** Tracks the `data-theme` the rail's theme toggle stamps on <html>. */
function useColorTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.dataset.theme === "light" ? "light" : "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
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
  const theme = useColorTheme();

  // The parent keys this component by `code`, so a new diagram is a fresh
  // mount with fresh initial state — no manual reset needed here. Theme also
  // triggers a re-render, since a diagram already on screen when the reader
  // flips the toggle should follow it rather than staying stuck in the old
  // palette.
  useEffect(() => {
    let live = true;
    mermaid
      .getMermaid({ theme: "base", themeVariables: mermaidThemeVariables[theme] })
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
  }, [code, id, theme]);

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
