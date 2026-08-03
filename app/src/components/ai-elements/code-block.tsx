"use client";

import { CheckIcon, CopyIcon, DownloadIcon, XIcon } from "lucide-react";
import {
  isValidElement,
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { CodeBlock, type ExtraProps } from "streamdown";

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

type MarkdownCodeProps = ComponentProps<"code"> & ExtraProps;

export function AtlasMarkdownCode({ children, className, node: _node, ...props }: MarkdownCodeProps) {
  void _node;
  const attributes = props as Record<string, unknown>;
  const isBlock = "data-block" in attributes;

  if (!isBlock) {
    return <code className={className} {...props}>{children}</code>;
  }

  const language = className?.match(/language-([\w#+.-]+)/)?.[1] ?? "text";
  const code = childrenToText(children).replace(/\n$/, "");

  return (
    <CodeBlock code={code} language={language}>
      <DownloadCodeButton code={code} language={language} />
      <CopyCodeButton code={code} />
    </CodeBlock>
  );
}
