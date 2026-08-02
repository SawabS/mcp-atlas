---
id: "modelcontextprotocol-typescript-sdk-examples-client-quickstart-readme-md-2947beb3b3"
title: "client-quickstart"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/client-quickstart/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/client-quickstart/README.md"
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

# client-quickstart

An LLM-powered chatbot that connects to an MCP server over stdio and calls its tools (`src/index.ts`). It was the source for the retired client-quickstart tutorial; the current getting-started tutorial is [Build your first client](../../docs/get-started/first-client.md).

The `package.json` and `tsconfig.json` here are monorepo-internal (`workspace:`/`catalog:` protocols; typecheck-only in CI). To build the client yourself outside the monorepo, copy `src/index.ts` into a standalone project that depends on the published packages.

## Related concepts

- [[Architecture]]
- [[Transports]]
