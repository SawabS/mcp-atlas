---
id: "modelcontextprotocol-python-sdk-examples-stories-dual-era-readme-md-6ad9ee9404"
title: "dual-era"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/stories/dual_era/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/stories/dual_era/README.md"
commit: "a4f4ccd091138771535e17191123f20b30fda68e"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/python"
concepts:
  - "[[Architecture]]"
  - "[[Lifecycle]]"
  - "[[Transports]]"
  - "[[Capabilities]]"
  - "[[SDKs]]"
---

# dual-era

One server factory, both protocol eras. A `mode="legacy"` client runs the
`initialize` handshake; a `mode="auto"` client probes `server/discover` and
adopts the 2026 stateless era — the same `greet` tool answers both and reports
which era served it via `ctx.request_context.protocol_version`. **Start here**
when migrating a v1 server: the entry owns the era decision, the server body
stays era-agnostic.

## Run it

```bash
# over HTTP — the same /mcp endpoint serves both eras; the client self-hosts
# the server on a free port, runs, then tears it down
uv run python -m stories.dual_era.client --http
# same, against the lowlevel-API server variant
uv run python -m stories.dual_era.client --http --server server_lowlevel
```

The bare stdio invocation (`uv run python -m stories.dual_era.client`) is
legacy-only until the SDK's stdio entry can negotiate the era, so the modern
leg fails there today — run over `--http`.

## What to look at

- `client.py` — both connections are visible, against the same `targets()`
  factory: `Client(targets(), mode=mode)` (default `"auto"`, the
  discover-then-fallback ladder) and `Client(targets(), mode="legacy")` (forces
  the `initialize` handshake). The era decision is one explicit `mode=` argument
  at construction; no date strings appear in the body.
- `client.py` — `client.protocol_version` / `client.server_info` /
  `client.server_capabilities` are era-neutral: populated by `initialize` *or*
  `server/discover`, whichever ran. On the 2026 era `server_info` comes from
  the optional `serverInfo` `_meta` stamp (`None` for a server that does not
  identify itself); `initialize` always carries it.
- `server.py` — `ctx.request_context.protocol_version` is the era branch key
  (lowlevel: `ctx.protocol_version` directly). Compare against
  `MODERN_PROTOCOL_VERSIONS`, never a date literal.
- **Where to read the negotiated version.** One value, three read paths:
  `client.protocol_version` on the client after connect; `ctx.protocol_version`
  inside a lowlevel handler; `ctx.request_context.protocol_version` inside an
  `MCPServer` handler.

## Caveats

- `ctx.request_context.protocol_version` is the current way to read the
  negotiated version; a later release will shorten it to `ctx.transport.*`.
- Over HTTP the built-in era branch is currently header-only — a 2026 client
  that omits the `MCP-Protocol-Version` header is mis-routed to the legacy
  path. The body-primary classifier lands in a later release.

## Spec

- [Versioning — backward compatibility](https://modelcontextprotocol.io/specification/draft/basic/versioning)
- [`server/discover`](https://modelcontextprotocol.io/specification/draft/server/discover)

## See also

`legacy_routing/` (route eras yourself), `reconnect/` (persist `DiscoverResult`
for zero-RTT reconnect).

## Related concepts

- [[Architecture]]
- [[Lifecycle]]
- [[Transports]]
- [[Capabilities]]
- [[SDKs]]
