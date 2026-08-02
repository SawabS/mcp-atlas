---
id: "modelcontextprotocol-typescript-sdk-examples-custom-methods-readme-md-f159deac0b"
title: "custom-methods"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/custom-methods/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/custom-methods/README.md"
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

# custom-methods

Bidirectional custom (non-spec) JSON-RPC methods: the server handles a vendor-prefixed `acme/search` request via `server.setRequestHandler` and emits `acme/searchProgress` notifications via `ctx.mcpReq.notify`; the client sends the typed request via
`client.request(method, schema)` and receives the typed notifications via `client.setNotificationHandler('acme/searchProgress', { params })`.

```bash
pnpm tsx examples/custom-methods/client.ts
```

## Related concepts

- [[Architecture]]
