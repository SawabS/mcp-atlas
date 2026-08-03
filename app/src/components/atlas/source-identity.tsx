import { Blocks, Globe2 } from "lucide-react";

type SourceIdentity = {
  host: string;
  label: string;
  kind: "github" | "registry" | "web";
};

export function getSourceIdentity(url: string): SourceIdentity {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "github.com" || host.endsWith(".github.com")) {
      return { host, label: "GitHub", kind: "github" };
    }
    if (host === "registry.modelcontextprotocol.io") {
      return { host, label: "MCP Registry", kind: "registry" };
    }
    return { host, label: host, kind: "web" };
  } catch {
    return { host: "Source", label: "Source", kind: "web" };
  }
}

export function SourceGlyph({ url, size = 15 }: { url: string; size?: number }) {
  const { kind } = getSourceIdentity(url);
  if (kind === "github") {
    return (
      <svg aria-hidden="true" fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
        <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.29-5.29-1.29-5.29-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.72 5.39-5.31 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
      </svg>
    );
  }
  if (kind === "registry") return <Blocks aria-hidden="true" size={size} />;
  return <Globe2 aria-hidden="true" size={size} />;
}
