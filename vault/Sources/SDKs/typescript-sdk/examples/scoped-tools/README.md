---
id: "modelcontextprotocol-typescript-sdk-examples-scoped-tools-readme-md-3249607fc8"
title: "scoped-tools — per-tool scope enforced in the tool handler"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/scoped-tools/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/scoped-tools/README.md"
commit: "cc4b41617ce3601b1290d67216ea0b194a3cd9ac"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/typescript"
concepts:
  - "[[Architecture]]"
  - "[[Authorization]]"
  - "[[Security]]"
  - "[[Transports]]"
---

# scoped-tools — per-tool scope enforced in the tool handler

Demonstrates per-tool OAuth scope enforcement on a `createMcpHandler`
deployment: the HTTP gate does **bearer-verify + 401 only**, and each tool
handler checks `ctx.http?.authInfo?.scopes` for the scope it needs. The scope
decision lives next to the code it guards — the handler is the only place that
authoritatively knows which tool is executing — instead of in middleware that
would have to re-derive the operation from the request body.

`server.ts` runs a minimal demo Authorization Server alongside the MCP Resource
Server. `client.ts` connects with a `files:read` token, calls `list-files`
(works), then calls `write-file` → the handler returns `{ isError: true }` with
`insufficient_scope: requires files:write`.

The transport's automatic `403 insufficient_scope` **step-up** flow (SEP-2350 —
scope union, refresh-bypass, `maxStepUpRetries`) applies when the RS responds
`403` at the HTTP layer; that path is exercised by
`test/e2e/scenarios/client-auth.test.ts`.

```bash
pnpm --filter @mcp-examples/scoped-tools server -- --http --port 3000
pnpm --filter @mcp-examples/scoped-tools client -- --http http://127.0.0.1:3000/mcp
```

> DEMO ONLY — the bundled AS auto-approves and grants whatever scope is asked
> for. Do not deploy.

## Related concepts

- [[Architecture]]
- [[Authorization]]
- [[Security]]
- [[Transports]]
