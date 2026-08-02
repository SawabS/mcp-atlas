---
id: "modelcontextprotocol-typescript-sdk-examples-dual-era-readme-md-813142565b"
title: "dual-era"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/dual-era/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/dual-era/README.md"
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
  - "[[Transports]]"
  - "[[Capabilities]]"
  - "[[Lifecycle]]"
---

# dual-era

One server factory, both protocol eras (2025 `initialize` and 2026-07-28 per-request envelope), both transports (stdio and Streamable HTTP). The client connects once as a plain 2025 client and once with `versionNegotiation: { mode: 'auto' }`; the same `greet` tool answers both
and reports which era served the call.

This is the recommended **first** example to read if you are migrating an existing server to the 2026 era: the entry (`serveStdio` / `createMcpHandler`) owns the era decision, the factory is era-agnostic.

```bash
pnpm tsx examples/dual-era/client.ts                              # stdio
pnpm tsx examples/dual-era/server.ts --http --port 3000           # term 1
pnpm tsx examples/dual-era/client.ts --http http://127.0.0.1:3000/ # term 2
```

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[Capabilities]]
- [[Lifecycle]]
