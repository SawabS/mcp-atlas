---
id: "modelcontextprotocol-modelcontextprotocol-docs-specification-2024-11-05-basic-messages-b2065a885f"
title: "Messages"
document_type: "specification"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/specification/2024-11-05/basic/messages.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/specification/2024-11-05/basic/messages.mdx"
commit: "73763114e511106fc07543f6096b3a814b1a3583"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-core"
  - "mcp/category/specification"
concepts:
  - "[[Architecture]]"
---

All messages in MCP **MUST** follow the
[JSON-RPC 2.0](https://www.jsonrpc.org/specification) specification. The protocol defines
three types of messages:

## Requests

Requests are sent from the client to the server or vice versa.

```typescript
{
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    [key: string]: unknown;
  };
}
```

- Requests **MUST** include a string or integer ID.
- Unlike base JSON-RPC, the ID **MUST NOT** be `null`.
- The request ID **MUST NOT** have been previously used by the requestor within the same
  session.

## Responses

Responses are sent in reply to requests.

```typescript
{
  jsonrpc: "2.0";
  id: string | number;
  result?: {
    [key: string]: unknown;
  }
  error?: {
    code: number;
    message: string;
    data?: unknown;
  }
}
```

- Responses **MUST** include the same ID as the request they correspond to.
- Either a `result` or an `error` **MUST** be set. A response **MUST NOT** set both.
- Error codes **MUST** be integers.

## Notifications

Notifications are sent from the client to the server or vice versa. They do not expect a
response.

```typescript
{
  jsonrpc: "2.0";
  method: string;
  params?: {
    [key: string]: unknown;
  };
}
```

- Notifications **MUST NOT** include an ID.

## Related concepts

- [[Architecture]]
