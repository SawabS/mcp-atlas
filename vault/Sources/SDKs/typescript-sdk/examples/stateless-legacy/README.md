---
id: "modelcontextprotocol-typescript-sdk-examples-stateless-legacy-readme-md-91b6148d6f"
title: "stateless-legacy"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/stateless-legacy/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/stateless-legacy/README.md"
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
  - "[[Transports]]"
  - "[[Architecture]]"
---

# stateless-legacy

The minimal `createMcpHandler` deployment, on its default posture: 2026-07-28 traffic served per request, 2025-era traffic served stateless from the same factory. This is the one-liner replacement for the 1.x "new transport + new server per POST" stateless idiom.

**HTTP-only** by definition; see `dual-era/` for the stdio analogue.

## Related concepts

- [[Transports]]
- [[Architecture]]
