---
id: "modelcontextprotocol-typescript-sdk-examples-subscriptions-readme-md-0e48b68925"
title: "subscriptions"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/subscriptions/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/subscriptions/README.md"
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
  - "[[Tools]]"
  - "[[Transports]]"
---

# subscriptions

`subscriptions/listen` change-notification streams (protocol revision 2026-07-28). The server publishes `tools/list_changed`; the client receives it both via the auto-opened stream (`ClientOptions.listChanged`, the same option a 2025-era client sets) and a manual
`client.listen()` call.

The publish surface differs by entry: over HTTP (`createMcpHandler`) the example calls `handler.notify.toolsChanged()` on the cross-request `ServerEventBus`; over stdio (`serveStdio`) it toggles a `RegisteredTool` on the pinned instance, whose `tools/list_changed` the entry's
listen router fans onto every open subscription.

```bash
# stdio (the client spawns the server itself):
pnpm tsx examples/subscriptions/client.ts

# Streamable HTTP (two terminals):
pnpm tsx examples/subscriptions/server.ts --http --port 3000
pnpm tsx examples/subscriptions/client.ts --http http://127.0.0.1:3000/
```

## Related concepts

- [[Architecture]]
- [[Tools]]
- [[Transports]]
