---
id: "modelcontextprotocol-typescript-sdk-examples-server-quickstart-readme-md-06b583ada0"
title: "server-quickstart"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/server-quickstart/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/server-quickstart/README.md"
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
---

# server-quickstart

A stdio weather server exposing `get-alerts` and `get-forecast` tools (`src/index.ts`). It was the source for the retired server-quickstart tutorial; the current getting-started tutorial is [Build your first server](../../docs/get-started/first-server.md).

The `package.json` and `tsconfig.json` here are monorepo-internal (`workspace:`/`catalog:` protocols; typecheck-only in CI). To build the server yourself outside the monorepo, copy `src/index.ts` into a standalone project that depends on the published packages.

## Related concepts

- [[Architecture]]
- [[Transports]]
