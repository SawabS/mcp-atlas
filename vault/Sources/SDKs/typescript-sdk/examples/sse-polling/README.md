---
id: "modelcontextprotocol-typescript-sdk-examples-sse-polling-readme-md-cf018aa34f"
title: "sse-polling"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/sse-polling/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/sse-polling/README.md"
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

# sse-polling

SEP-1699 server-initiated SSE disconnection + client reconnection with `Last-Event-ID` replay. **Sessionful 2025** by definition (the feature lives on `NodeStreamableHTTPServerTransport` + an `EventStore`). `eventStore` resumability is a 2025-session concern with no 2026-07-28
per-request equivalent.

The `long-operation` tool emits two log notifications, calls `ctx.http?.closeSSE()` mid-stream, emits two more while the client is disconnected, then returns. The client transport reconnects after `retryInterval` (300 ms) with `Last-Event-ID`; the event store replays the buffered
events. The client asserts the result arrived AND the post-disconnect log was delivered.

```bash
pnpm --filter @mcp-examples/sse-polling server -- --http --port 3001    # term 1
pnpm --filter @mcp-examples/sse-polling client -- --http http://127.0.0.1:3001/mcp    # term 2
```

## Related concepts

- [[Architecture]]
- [[Transports]]
