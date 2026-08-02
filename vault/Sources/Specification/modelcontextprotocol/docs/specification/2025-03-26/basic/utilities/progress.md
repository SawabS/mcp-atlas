---
id: "modelcontextprotocol-modelcontextprotocol-docs-specification-2025-03-26-basic-utilitie-a0f82b2375"
title: "Progress"
document_type: "specification"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/specification/2025-03-26/basic/utilities/progress.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/specification/2025-03-26/basic/utilities/progress.mdx"
commit: "73763114e511106fc07543f6096b3a814b1a3583"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-core"
  - "mcp/category/specification"
concepts:
  - "[[Security]]"
---

The Model Context Protocol (MCP) supports optional progress tracking for long-running
operations through notification messages. Either side can send progress notifications to
provide updates about operation status.

## Progress Flow

When a party wants to _receive_ progress updates for a request, it includes a
`progressToken` in the request metadata.

- Progress tokens **MUST** be a string or integer value
- Progress tokens can be chosen by the sender using any means, but **MUST** be unique
  across all active requests.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "some_method",
  "params": {
    "_meta": {
      "progressToken": "abc123"
    }
  }
}
```

The receiver **MAY** then send progress notifications containing:

- The original progress token
- The current progress value so far
- An optional "total" value
- An optional "message" value

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "abc123",
    "progress": 50,
    "total": 100,
    "message": "Reticulating splines..."
  }
}
```

- The `progress` value **MUST** increase with each notification, even if the total is
  unknown.
- The `progress` and the `total` values **MAY** be floating point.
- The `message` field **SHOULD** provide relevant human readable progress information.

## Behavior Requirements

1. Progress notifications **MUST** only reference tokens that:
   - Were provided in an active request
   - Are associated with an in-progress operation

2. Receivers of progress requests **MAY**:
   - Choose not to send any progress notifications
   - Send notifications at whatever frequency they deem appropriate
   - Omit the total value if unknown

```mermaid
sequenceDiagram
    participant Sender
    participant Receiver

    Note over Sender,Receiver: Request with progress token
    Sender->>Receiver: Method request with progressToken

    Note over Sender,Receiver: Progress updates
    loop Progress Updates
        Receiver-->>Sender: Progress notification (0.2/1.0)
        Receiver-->>Sender: Progress notification (0.6/1.0)
        Receiver-->>Sender: Progress notification (1.0/1.0)
    end

    Note over Sender,Receiver: Operation complete
    Receiver->>Sender: Method response
```

## Implementation Notes

- Senders and receivers **SHOULD** track active progress tokens
- Both parties **SHOULD** implement rate limiting to prevent flooding
- Progress notifications **MUST** stop after completion

## Related concepts

- [[Security]]
