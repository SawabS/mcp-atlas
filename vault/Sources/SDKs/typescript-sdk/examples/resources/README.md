---
id: "modelcontextprotocol-typescript-sdk-examples-resources-readme-md-8c5eabd15c"
title: "resources"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/resources/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/resources/README.md"
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

# resources

Direct resources (a fixed URI string), templated resources (`ResourceTemplate('greeting://{name}')`), and per-resource subscriptions. The client lists both kinds, reads the direct config and a templated greeting, then subscribes to `counter://value` — `subscriptions/listen` on 2026-07-28, `resources/subscribe` on 2025 — calls the `increment` tool, and asserts the `notifications/resources/updated` it produces. Per-request legacy HTTP has no delivery channel, so that leg skips the delivery assertion.

```bash
pnpm tsx examples/resources/client.ts
```

## Related concepts

- [[Architecture]]
