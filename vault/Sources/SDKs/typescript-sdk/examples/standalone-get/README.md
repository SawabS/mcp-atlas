---
id: "modelcontextprotocol-typescript-sdk-examples-standalone-get-readme-md-d4839849d3"
title: "standalone-get"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/standalone-get/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/standalone-get/README.md"
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
  - "[[Resources]]"
---

# standalone-get

Server-initiated `notifications/resources/list_changed` over the **standalone GET** SSE stream (sessionful 2025). The `add_resource` tool registers a new resource on the session's instance, which emits the notification over the GET stream the client opened via
`ClientOptions.listChanged`; the client calls the tool and asserts the notification arrived.

The original timer-driven unsolicited push (server emits on its own schedule) was traded for this tool-triggered approach for CI determinism — the `list_changed`-over-standalone-GET behaviour is still demonstrated; "server pushes on its own schedule" is no longer shown.

**HTTP-only**, sessionful 2025 by definition.

## Related concepts

- [[Architecture]]
- [[Resources]]
