---
id: "modelcontextprotocol-csharp-sdk-docs-concepts-ping-ping-md-46559ab811"
title: "Ping"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/csharp-sdk"
source_path: "docs/concepts/ping/ping.md"
source_url: "https://github.com/modelcontextprotocol/csharp-sdk/blob/79e13b3e2c35300551ee2af4642e5f35d468ceb5/docs/concepts/ping/ping.md"
commit: "79e13b3e2c35300551ee2af4642e5f35d468ceb5"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/csharp"
concepts:
  - "[[Architecture]]"
---

## Ping

MCP includes a [ping mechanism] that allows either side of a connection to verify that the other side is still responsive. This is useful for connection health monitoring and keep-alive scenarios.

[ping mechanism]: https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/ping

### Pinging from the client

Use the <xref:ModelContextProtocol.Client.McpClient.PingAsync*> method to verify the server is responsive:

```csharp
await client.PingAsync(cancellationToken: cancellationToken);
```

### Automatic ping handling

Incoming ping requests from either side are responded to automatically. No additional configuration is needed&mdash;when a ping request is received, a ping response is sent immediately.

## Related concepts

- [[Architecture]]
