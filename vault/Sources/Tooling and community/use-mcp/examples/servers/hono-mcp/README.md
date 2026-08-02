---
id: "modelcontextprotocol-use-mcp-examples-servers-hono-mcp-readme-md-79fd0a1702"
title: "Readme"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/use-mcp"
source_path: "examples/servers/hono-mcp/README.md"
source_url: "https://github.com/modelcontextprotocol/use-mcp/blob/40c02d2d982a4fd99d08b931801e10728993c79f/examples/servers/hono-mcp/README.md"
commit: "40c02d2d982a4fd99d08b931801e10728993c79f"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
---

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
