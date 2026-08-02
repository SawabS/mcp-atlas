---
id: "modelcontextprotocol-ext-apps-examples-basic-server-svelte-readme-md-b68afdb1a2"
title: "Example: Basic Server (Svelte)"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/ext-apps"
source_path: "examples/basic-server-svelte/README.md"
source_url: "https://github.com/modelcontextprotocol/ext-apps/blob/92f46a574568a3ddac7600343b7d3c4c4ed7b588/examples/basic-server-svelte/README.md"
commit: "92f46a574568a3ddac7600343b7d3c4c4ed7b588"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/extensions"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[SDKs]]"
---

# Example: Basic Server (Svelte)

An MCP App example with a Svelte 5 UI using runes for reactivity.

> [!TIP]
> Looking for a vanilla JavaScript example? See [`basic-server-vanillajs`](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples/basic-server-vanillajs)!

## MCP Client Configuration

Add to your MCP client configuration (stdio transport):

```json
{
  "mcpServers": {
    "basic-svelte": {
      "command": "npx",
      "args": [
        "-y",
        "--silent",
        "--registry=https://registry.npmjs.org/",
        "@modelcontextprotocol/server-basic-svelte",
        "--stdio"
      ]
    }
  }
}
```

### Local Development

To test local modifications, use this configuration (replace `~/code/ext-apps` with your clone path):

```json
{
  "mcpServers": {
    "basic-svelte": {
      "command": "bash",
      "args": [
        "-c",
        "cd ~/code/ext-apps/examples/basic-server-svelte && npm run build >&2 && node dist/index.js --stdio"
      ]
    }
  }
}
```

## Overview

- Tool registration with a linked UI resource
- Svelte 5 UI using the [`App`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html) class
- App communication APIs: [`callServerTool`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html#callservertool), [`sendMessage`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html#sendmessage), [`sendLog`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html#sendlog), [`openLink`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html#openlink)

## Key Files

- [`server.ts`](server.ts) - MCP server with tool and resource registration
- [`mcp-app.html`](mcp-app.html) / [`src/App.svelte`](src/App.svelte) - Svelte 5 UI using `App` class

## Getting Started

```bash
npm install
npm run dev
```

## How It Works

1. The server registers a `get-time` tool with metadata linking it to a UI HTML resource (`ui://get-time/mcp-app.html`).
2. When the tool is invoked, the Host renders the UI from the resource.
3. The UI uses the MCP App SDK API to communicate with the host and call server tools.

## Build System

This example bundles into a single HTML file using Vite with `vite-plugin-singlefile` — see [`vite.config.ts`](vite.config.ts). This allows all UI content to be served as a single MCP resource. Alternatively, MCP apps can load external resources by defining [`_meta.ui.csp.resourceDomains`](https://apps.extensions.modelcontextprotocol.io/api/interfaces/app.McpUiResourceCsp.html#resourcedomains) in the UI resource metadata.

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[SDKs]]
