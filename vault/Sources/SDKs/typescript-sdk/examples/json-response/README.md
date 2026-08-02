---
id: "modelcontextprotocol-typescript-sdk-examples-json-response-readme-md-a2c02b334f"
title: "json-response"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/json-response/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/json-response/README.md"
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
---

# json-response

`createMcpHandler({ responseMode: 'json' })` — a single `application/json` body per request instead of an SSE stream. Useful for serverless / edge runtimes that can't hold a stream open. Mid-call notifications are dropped.

**HTTP-only** by definition.

## Related concepts

- [[Architecture]]
