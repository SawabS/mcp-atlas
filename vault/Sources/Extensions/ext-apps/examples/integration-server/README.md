---
id: "modelcontextprotocol-ext-apps-examples-integration-server-readme-md-7b55b38261"
title: "Example: Integration Test Server"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/ext-apps"
source_path: "examples/integration-server/README.md"
source_url: "https://github.com/modelcontextprotocol/ext-apps/blob/92f46a574568a3ddac7600343b7d3c4c4ed7b588/examples/integration-server/README.md"
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
  - "[[SDKs]]"
  - "[[Testing]]"
---

# Example: Integration Test Server

An MCP App example used for E2E integration testing.

## Overview

This example demonstrates all App SDK communication APIs and is used by the E2E test suite to verify host-app interactions:

- Tool registration with a linked UI resource
- React UI using the [`useApp()`](https://apps.extensions.modelcontextprotocol.io/api/functions/_modelcontextprotocol_ext-apps_react.useApp.html) hook
- App communication APIs: [`callServerTool`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html#callservertool), [`sendMessage`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html#sendmessage), [`sendLog`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html#sendlog), [`openLink`](https://apps.extensions.modelcontextprotocol.io/api/classes/app.App.html#openlink)

## Key Files

- [`server.ts`](server.ts) - MCP server with tool and resource registration
- [`mcp-app.html`](mcp-app.html) / [`src/mcp-app.tsx`](src/mcp-app.tsx) - React UI using `useApp()` hook

## Getting Started

```bash
npm install
npm run dev
```

## How It Works

1. The server registers a `get-time` tool with metadata linking it to a UI HTML resource (`ui://get-time/mcp-app.html`).
2. When the tool is invoked, the Host renders the UI from the resource.
3. The UI uses the MCP App SDK API to communicate with the host and call server tools.

## Related concepts

- [[Architecture]]
- [[SDKs]]
- [[Testing]]
