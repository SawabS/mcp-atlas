---
id: "modelcontextprotocol-servers-src-everything-docs-how-it-works-md-54275b42a3"
title: "Everything Server - How It Works"
document_type: "official-documentation"
content_class: "source"
authority: "official-server"
repository: "modelcontextprotocol/servers"
source_path: "src/everything/docs/how-it-works.md"
source_url: "https://github.com/modelcontextprotocol/servers/blob/76d64c822f5125032f89eb71dbdb94e42b434821/src/everything/docs/how-it-works.md"
commit: "76d64c822f5125032f89eb71dbdb94e42b434821"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-server"
  - "mcp/category/reference-servers"
concepts:
  - "[[Architecture]]"
  - "[[Capabilities]]"
  - "[[Elicitation]]"
  - "[[Reference Servers]]"
  - "[[Resources]]"
  - "[[SDKs]]"
  - "[[Sampling]]"
  - "[[Transports]]"
---

# Everything Server - How It Works

**[Architecture](architecture.md)
| [Project Structure](structure.md)
| [Startup Process](startup.md)
| [Server Features](features.md)
| [Extension Points](extension.md)
| How It Works**

# Conditional Tool Registration

### Module: `server/index.ts`

- Some tools require client support for the capability they demonstrate. These are:
  - `get-roots-list`
  - `trigger-elicitation-request`
  - `trigger-sampling-request`
- Client capabilities aren't known until after initilization handshake is complete.
- Most tools are registered immediately during the Server Factory execution, prior to client connection.
- To defer registration of these commands until client capabilities are known, a `registerConditionalTools(server)` function is invoked from an `onintitialized` handler.

## Resource Subscriptions

### Module: `resources/subscriptions.ts`

- Tracks subscribers per URI: `Map<uri, Set<sessionId>>`.
- Installs handlers via `setSubscriptionHandlers(server)` to process subscribe/unsubscribe requests and keep the map updated.
- Updates are started/stopped on demand by the `toggle-subscriber-updates` tool, which calls `beginSimulatedResourceUpdates(server, sessionId)` and `stopSimulatedResourceUpdates(sessionId)`.
- `cleanup(sessionId?)` calls `stopSimulatedResourceUpdates(sessionId)` to clear intervals and remove session‑scoped state.

## Session‑scoped Resources

### Module: `resources/session.ts`

- `getSessionResourceURI(name: string)`: Builds a session resource URI: `demo://resource/session/<name>`.
- `registerSessionResource(server, resource, type, payload)`: Registers a resource with the given `uri`, `name`, and `mimeType`, returning a `resource_link`. The content is served from memory for the life of the session only. Supports `type: "text" | "blob"` and returns data in the corresponding field.
- Intended usage: tools can create and expose per-session artifacts without persisting them. For example, `tools/gzip-file-as-resource.ts` compresses fetched content, registers it as a session resource with `mimeType: application/gzip`, and returns either a `resource_link` or an inline `resource` based on `outputType`.

## Simulated Logging

### Module: `server/logging.ts`

- Periodically sends randomized log messages at different levels. Messages can include the session ID for clarity during demos.
- Started/stopped on demand via the `toggle-simulated-logging` tool, which calls `beginSimulatedLogging(server, sessionId?)` and `stopSimulatedLogging(sessionId?)`. Note that transport disconnect triggers `cleanup()` which also stops any active intervals.
- Uses `server.sendLoggingMessage({ level, data }, sessionId?)` so that the client’s configured minimum logging level is respected by the SDK.

## Related concepts

- [[Architecture]]
- [[Capabilities]]
- [[Elicitation]]
- [[Reference Servers]]
- [[Resources]]
- [[SDKs]]
- [[Sampling]]
- [[Transports]]
