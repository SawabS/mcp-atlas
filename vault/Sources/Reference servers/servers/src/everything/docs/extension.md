---
id: "modelcontextprotocol-servers-src-everything-docs-extension-md-b8449ffd03"
title: "Everything Server - Extension Points"
document_type: "official-documentation"
content_class: "source"
authority: "official-server"
repository: "modelcontextprotocol/servers"
source_path: "src/everything/docs/extension.md"
source_url: "https://github.com/modelcontextprotocol/servers/blob/76d64c822f5125032f89eb71dbdb94e42b434821/src/everything/docs/extension.md"
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
  - "[[Reference Servers]]"
---

# Everything Server - Extension Points

**[Architecture](architecture.md)
| [Project Structure](structure.md)
| [Startup Process](startup.md)
| [Server Features](features.md)
| Extension Points
| [How It Works](how-it-works.md)**

## Adding Tools

- Create a new file under `tools/` with your `registerXTool(server)` function that registers the tool via `server.registerTool(...)`.
- Export and call it from `tools/index.ts` inside `registerTools(server)`.

## Adding Prompts

- Create a new file under `prompts/` with your `registerXPrompt(server)` function that registers the prompt via `server.registerPrompt(...)`.
- Export and call it from `prompts/index.ts` inside `registerPrompts(server)`.

## Adding Resources

- Create a new file under `resources/` with your `registerXResources(server)` function using `server.registerResource(...)` (optionally with `ResourceTemplate`).
- Export and call it from `resources/index.ts` inside `registerResources(server)`.

## Related concepts

- [[Architecture]]
- [[Reference Servers]]
