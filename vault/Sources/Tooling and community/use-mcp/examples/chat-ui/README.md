---
id: "modelcontextprotocol-use-mcp-examples-chat-ui-readme-md-f1ea642096"
title: "AI Chat with MCP"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/use-mcp"
source_path: "examples/chat-ui/README.md"
source_url: "https://github.com/modelcontextprotocol/use-mcp/blob/40c02d2d982a4fd99d08b931801e10728993c79f/examples/chat-ui/README.md"
commit: "40c02d2d982a4fd99d08b931801e10728993c79f"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
  - "[[Architecture]]"
  - "[[Authorization]]"
  - "[[Capabilities]]"
---

# AI Chat with MCP

A React-based AI chat application demonstrating [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) integration with multiple AI providers.

This static web application showcases how to use the [`use-mcp`](../../) library to connect to MCP servers, providing extensible AI capabilities through external tools and services. The app supports multiple AI models, stores conversations locally in IndexedDB, and includes OAuth authentication for MCP server connections.

**Live demo**: [chat.use-mcp.dev](https://chat.use-mcp.dev)

## Features

- **MCP Integration**: Connect to MCP servers with OAuth authentication support
- **Multi-model Support**: Anthropic (Claude) and Groq (Llama) models with API key authentication
- **Local Storage**: Conversations stored in browser's IndexedDB
- **Static Deployment**: Builds to static assets for deployment anywhere
- **Modern Stack**: React 19, TypeScript, Tailwind CSS, Vite

## Get started

```sh
pnpm install
pnpm dev
```

Build and deploy:

```sh
pnpm build
pnpm run deploy  # deploys to Cloudflare Pages
```

## Development

- **Dev server**: `pnpm dev` (runs on port 5002)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Test**: `pnpm test` (Playwright E2E tests)

## Related concepts

- [[Architecture]]
- [[Authorization]]
- [[Capabilities]]
