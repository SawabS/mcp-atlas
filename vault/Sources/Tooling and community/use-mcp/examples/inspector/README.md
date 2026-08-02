---
id: "modelcontextprotocol-use-mcp-examples-inspector-readme-md-f3fd03445b"
title: "MCP Inspector"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/use-mcp"
source_path: "examples/inspector/README.md"
source_url: "https://github.com/modelcontextprotocol/use-mcp/blob/40c02d2d982a4fd99d08b931801e10728993c79f/examples/inspector/README.md"
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
  - "[[Resources]]"
  - "[[Testing]]"
---

# MCP Inspector

A minimal demo showcasing the `use-mcp` React hook for connecting to Model Context Protocol (MCP) servers.

## Features

- Connect to any MCP server via URL
- View available tools and their schemas
- Browse and read server resources
- Interact with server-provided prompts
- Real-time connection status monitoring
- Debug logging for troubleshooting
- Clean, minimal UI focused on MCP functionality

## Getting Started

0. Make sure you've built the parent `use-mcp` directory at least once!
```bash
cd ../.. && pnpm build && cd -
```

Alternatively, run `pnpm dev` in the parent directory in a second terminal if you want to iterate on both the library and the example together.

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open your browser and navigate to the displayed local URL

4. Enter an MCP server URL to test the connection and explore available tools, resources, and prompts

## What This Demonstrates

This example shows how easy it is to integrate MCP servers into a React application using the `use-mcp` hook. The core functionality is just:

```tsx
import { useMcp } from 'use-mcp/react'

const connection = useMcp({
  url: 'your-mcp-server-url',
  debug: true,
  autoRetry: false
})

// Access connection.state, connection.tools, connection.resources, 
// connection.prompts, connection.error, etc.
```

The `McpServers` component wraps this hook to provide a complete UI for server management, tool inspection, resource browsing, and prompt interaction.

## Supported MCP Features

- **Tools**: Execute server-provided tools with custom arguments and view results
- **Resources**: Browse available resources and read their contents (text or binary)
- **Resource Templates**: View dynamic resource templates with URI patterns
- **Prompts**: Interact with server prompts, provide arguments, and view generated messages

Note: Not all MCP servers implement all features. The inspector will gracefully handle servers that only support a subset of the MCP specification.

## Related concepts

- [[Architecture]]
- [[Resources]]
- [[Testing]]
