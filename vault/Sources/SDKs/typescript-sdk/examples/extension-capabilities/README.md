---
id: "modelcontextprotocol-typescript-sdk-examples-extension-capabilities-readme-md-401edccb38"
title: "extension-capabilities"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/extension-capabilities/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/extension-capabilities/README.md"
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
  - "[[Capabilities]]"
  - "[[Lifecycle]]"
---

# extension-capabilities

The server declares one extension capability, `com.example/feature-flags`, with
a small settings object via `server.registerCapabilities({ extensions: { … } })`.
The client connects once per era leg and asserts the entry and its settings are
advertised — by the `initialize` result on the legacy leg and by
`server/discover` on the modern leg.

```bash
pnpm tsx examples/extension-capabilities/client.ts          # modern (server/discover)
pnpm tsx examples/extension-capabilities/client.ts --legacy # 2025 initialize handshake
```

## Related concepts

- [[Architecture]]
- [[Capabilities]]
- [[Lifecycle]]
