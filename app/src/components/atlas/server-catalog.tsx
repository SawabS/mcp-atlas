"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Box, Cloud, GitFork, LoaderCircle, Package, Search, Server } from "lucide-react";
import { loadRegistry } from "@/lib/client-data";
import type { RegistryServer } from "@/lib/knowledge-types";

const PAGE_SIZE = 60;

export function ServerCatalog() {
  const [servers, setServers] = useState<RegistryServer[] | null>(null);
  const [query, setQuery] = useState("");
  const [transport, setTransport] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  useEffect(() => { loadRegistry().then(setServers); }, []);
  const results = useMemo(() => {
    if (!servers) return [];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return servers.filter((server) => {
      const haystack = `${server.title} ${server.name} ${server.description} ${server.packages.map((item) => item.identifier).join(" ")}`.toLowerCase();
      const matchesQuery = terms.every((term) => haystack.includes(term));
      const types = [...server.remotes.map((item) => item.type), ...server.packages.map((item) => item.transport)];
      return matchesQuery && (transport === "all" || types.includes(transport));
    });
  }, [query, servers, transport]);
  const remoteCount = servers?.filter((server) => server.remotes.length).length ?? 0;
  const packageCount = servers?.filter((server) => server.packages.length).length ?? 0;

  return (
    <div className="content-page server-page">
      <header className="page-header"><div><span className="eyebrow">Official Registry mirror</span><h1>Server catalogue</h1><p>Discover packages and remote endpoints without executing collected code.</p></div><div className="registry-mini-stats"><span><Cloud size={16} /><b>{remoteCount.toLocaleString()}</b> remote</span><span><Package size={16} /><b>{packageCount.toLocaleString()}</b> packaged</span></div></header>
      <div className="library-controls"><label className="library-search"><Search size={18} /><input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} placeholder="Search names, packages, descriptions..." /></label><div className="category-filter"><Server size={16} /><select value={transport} onChange={(event) => setTransport(event.target.value)}><option value="all">All transports</option><option value="streamable-http">Streamable HTTP</option><option value="stdio">Standard input/output</option><option value="sse">SSE</option></select></div></div>
      {!servers ? <div className="registry-loader"><LoaderCircle className="animate-spin" /><h2>Loading {19638..toLocaleString()} active servers</h2><p>The catalogue is loaded only when you open this view.</p></div> : <><div className="server-result-count"><span><span className="status-dot" /> Active only</span><b>{results.length.toLocaleString()} matching servers</b></div><div className="server-grid">{results.slice(0, limit).map((server, index) => <ServerCard key={`${server.id}-${server.version}-${index}`} server={server} />)}</div>{results.length > limit && <button className="load-more" type="button" onClick={() => setLimit((value) => value + PAGE_SIZE)}>Show {Math.min(PAGE_SIZE, results.length - limit)} more servers</button>}</>}
    </div>
  );
}

function ServerCard({ server }: { server: RegistryServer }) {
  const href = server.repositoryUrl || server.websiteUrl || server.remotes[0]?.url;
  const types = [...new Set([...server.remotes.map((item) => item.type), ...server.packages.map((item) => item.transport)].filter(Boolean))];
  return <article className="server-card"><header><div className="server-avatar">{server.title.slice(0, 2).toUpperCase()}</div><div><h2>{server.title}</h2><code>{server.name}</code></div>{href && <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${server.title}`}>{server.repositoryUrl ? <GitFork size={16} /> : <ArrowUpRight size={16} />}</a>}</header><p>{server.description}</p><div className="server-tags">{types.map((type) => <span key={type}><Cloud size={12} />{type}</span>)}{server.packages.slice(0, 2).map((item, index) => <span key={`${item.type}-${item.identifier}-${index}`}><Box size={12} />{item.type}</span>)}</div><footer><span>v{server.version ?? "latest"}</span><span>{server.updatedAt ? new Date(server.updatedAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "Registry metadata"}</span></footer></article>;
}
