---
id: "modelcontextprotocol-modelcontextprotocol-docs-specification-draft-server-discover-mdx-549e15d61b"
title: "Discovery"
document_type: "specification"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/specification/draft/server/discover.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/specification/draft/server/discover.mdx"
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
  - "[[Capabilities]]"
  - "[[Transports]]"
  - "[[Lifecycle]]"
  - "[[Prompts]]"
  - "[[Resources]]"
  - "[[Security]]"
  - "[[Tools]]"
---

<div id="enable-section-numbers" />

`server/discover` lets a client query a server's supported protocol versions,
capabilities, and identity before sending any other requests. Servers **MUST**
implement it.

## Request

The request carries no body parameters beyond the standard `_meta`:

```json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "method": "server/discover",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

## Response

The server replies with its supported protocol versions, capabilities, and
identity. This operation supports [caching](/specification/draft/server/utilities/caching).

```json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "result": {
    "resultType": "complete",
    "supportedVersions": ["2026-07-28"],
    "capabilities": {
      "tools": {},
      "resources": {}
    },
    "_meta": {
      "io.modelcontextprotocol/serverInfo": {
        "name": "ExampleServer",
        "version": "1.0.0"
      }
    },
    "instructions": "This server provides weather and resource utilities.",
    "ttlMs": 3600000,
    "cacheScope": "public"
  }
}
```

## When to Call

Calling `server/discover` is optional for clients — a client may invoke any
RPC inline and handle
[`UnsupportedProtocolVersionError`](/specification/draft/schema#unsupportedprotocolversionerror)
if the server does not support the requested version. However, `server/discover`
is useful in two scenarios:

- **Presenting server information.** While a client doesn't need to call
  `server/discover` to use the server, it's a convenient way to retrieve the
  server's identity, capabilities, and supported versions in a single request.
  For example, a client can present the capabilities a server supports from a
  single `server/discover` response instead of probing with separate
  `tools/list`, `prompts/list`, and `resources/list` requests.
- **stdio backward-compatibility probe.** On stdio, there is no per-request
  HTTP status code to drive fallback. A client that supports both modern
  (per-request `_meta`) and legacy (`initialize` handshake) servers **SHOULD**
  send `server/discover` first; see
  [stdio: Backward Compatibility](/specification/draft/basic/transports/stdio#backward-compatibility)
  for the fallback rules.

See [Protocol Version Negotiation](/specification/draft/basic/versioning#protocol-version-negotiation)
for the full version-selection flow. For HTTP-specific status codes returned for
unknown methods, see the [Protocol Version Header](/specification/draft/basic/transports/streamable-http#protocol-version-header)
section in Transports.

## Data Types

### DiscoverResult

A discovery result includes:

- `supportedVersions`: Protocol versions the server supports. The client should
  choose one of these for subsequent requests.
- `capabilities`: Capabilities the server supports (tools, resources, prompts,
  etc.)
- `_meta['io.modelcontextprotocol/serverInfo']`: Name and version of the server
  software. Servers **SHOULD** include this field.
- `instructions`: Optional natural-language guidance for LLMs on how to use
  this server effectively


  `serverInfo` is self-reported by the server and is not verified by the
  protocol. It is intended for display, logging, and debugging. Clients **SHOULD
  NOT** use it to change their behavior, and **SHOULD NOT** rely on it for
  security decisions.

## Related concepts

- [[Architecture]]
- [[Capabilities]]
- [[Transports]]
- [[Lifecycle]]
- [[Prompts]]
- [[Resources]]
- [[Security]]
- [[Tools]]
