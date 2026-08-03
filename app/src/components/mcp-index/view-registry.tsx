"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Box, Cloud, GitFork, LoaderCircle, Package, Search, Signal } from "lucide-react";
import { Reveal } from "@/components/mcp-index/motion";
import { ServerSheet } from "@/components/mcp-index/server-sheet";
import { loadRegistry } from "@/lib/client-data";
import type { RegistryServer } from "@/lib/knowledge-types";

const PAGE = 48;

export function Registry({ onAsk }: { onAsk: (question: string) => void }) {
  const [servers, setServers] = useState<RegistryServer[] | null>(null);
  const [query, setQuery] = useState("");
  const [transport, setTransport] = useState("all");
  const [limit, setLimit] = useState(PAGE);
  const [filterKey, setFilterKey] = useState("|all");
  const [open, setOpen] = useState<RegistryServer | null>(null);

  if (filterKey !== `${query}|${transport}`) {
    setFilterKey(`${query}|${transport}`);
    setLimit(PAGE);
  }

  useEffect(() => {
    let live = true;
    loadRegistry()
      .then((data) => live && setServers(data))
      .catch(() => live && setServers([]));
    return () => {
      live = false;
    };
  }, []);

  const results = useMemo(() => {
    if (!servers) return [];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return servers.filter((server) => {
      const haystack =
        `${server.title} ${server.name} ${server.description} ${server.packages.map((item) => item.identifier).join(" ")}`.toLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return false;
      if (transport === "all") return true;
      const kinds = [...server.remotes.map((item) => item.type), ...server.packages.map((item) => item.transport)];
      return kinds.includes(transport);
    });
  }, [query, servers, transport]);

  const remotes = servers?.filter((server) => server.remotes.length).length ?? 0;
  const packaged = servers?.filter((server) => server.packages.length).length ?? 0;

  return (
    <div className="view">
      <section>
        <header className="page-head">
          <div>
            <span className="eyebrow">Official registry mirror</span>
            <h1 className="title">
              The living catalogue of <em>servers</em>
            </h1>
            <p className="lede">
              Metadata only. Packages and endpoints are listed, never fetched or executed.
            </p>
          </div>
          <div className="counter">
            <b>{servers ? results.length.toLocaleString("en-US") : "···"}</b>
            <span>active servers</span>
          </div>
        </header>

        <div className="filters">
          <div className="filter-row">
            <label className="field">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search names, packages, descriptions…"
                aria-label="Search servers"
              />
            </label>
            <div className="field">
              <Signal size={16} />
              <select value={transport} onChange={(event) => setTransport(event.target.value)} aria-label="Transport">
                <option value="all">All transports</option>
                <option value="streamable-http">Streamable HTTP</option>
                <option value="stdio">Standard I/O</option>
                <option value="sse">Server-sent events</option>
              </select>
            </div>
          </div>
          {servers && (
            <div className="legend">
              <span>
                <Cloud size={13} /> {remotes.toLocaleString("en-US")} remote endpoints
              </span>
              <span>
                <Package size={13} /> {packaged.toLocaleString("en-US")} packaged distributions
              </span>
            </div>
          )}
        </div>

        {!servers ? (
          <div className="loading">
            <LoaderCircle size={22} className="spin" />
            <h3>Loading the registry</h3>
            <p>Nineteen thousand records, fetched only when you open this view.</p>
            <div className="shimmer" />
          </div>
        ) : results.length ? (
          <>
            <div className="card-grid">
              {results.slice(0, limit).map((server, index) => (
                <Reveal key={`${server.id}-${index}`} delay={Math.min(index, 11) * 30}>
                  <ServerCard server={server} onOpen={() => setOpen(server)} />
                </Reveal>
              ))}
            </div>
            {results.length > limit && (
              <button className="btn more" type="button" onClick={() => setLimit((value) => value + PAGE)}>
                Show {Math.min(PAGE, results.length - limit).toLocaleString("en-US")} more
              </button>
            )}
          </>
        ) : (
          <div className="empty">
            <Search size={26} />
            <h3>No servers match</h3>
            <p>Try a shorter query or a different transport.</p>
          </div>
        )}
      </section>

      {open && <ServerSheet server={open} onClose={() => setOpen(null)} onAsk={onAsk} />}
    </div>
  );
}

function ServerCard({
  server,
  onOpen,
}: {
  server: RegistryServer;
  onOpen: () => void;
}) {
  const href = server.repositoryUrl || server.websiteUrl || server.remotes[0]?.url || undefined;
  const kinds = [
    ...new Set(
      [...server.remotes.map((item) => item.type), ...server.packages.map((item) => item.transport)].filter(Boolean),
    ),
  ].slice(0, 3);

  return (
    <article className="card server-card">
      {/*
       * The whole card opens the record. The outbound link stays above it so
       * both destinations remain reachable by pointer and by keyboard.
       */}
      <button className="server-open" type="button" onClick={onOpen}>
        <span className="sr-only">Open the {server.title} registry record</span>
      </button>

      <div className="server-head">
        <span className="server-avatar">{server.title.slice(0, 2).toUpperCase()}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3>{server.title}</h3>
          <code>{server.name}</code>
        </div>
        {href && (
          <a
            className="icon-btn server-link"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${server.title} on ${server.repositoryUrl ? "GitHub" : "the web"}`}
          >
            {server.repositoryUrl ? <GitFork size={15} /> : <ArrowUpRight size={15} />}
          </a>
        )}
      </div>
      <p>{server.description}</p>
      <div className="tag-row">
        {kinds.map((kind) => (
          <span className="tag" key={kind}>
            <Cloud size={11} />
            {kind}
          </span>
        ))}
        {server.packages.slice(0, 2).map((item, index) => (
          <span className="tag" key={`${item.type}-${index}`}>
            <Box size={11} />
            {item.type}
          </span>
        ))}
      </div>
      <footer>
        <span>v{server.version ?? "latest"}</span>
        <span>
          {server.updatedAt
            ? new Date(server.updatedAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
            : "registry metadata"}
        </span>
      </footer>
    </article>
  );
}
