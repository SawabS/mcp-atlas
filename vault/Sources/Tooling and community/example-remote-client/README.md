---
id: "modelcontextprotocol-example-remote-client-readme-md-63fed31266"
title: "NOTE: this is a work in progress"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/example-remote-client"
source_path: "README.md"
source_url: "https://github.com/modelcontextprotocol/example-remote-client/blob/f1736b32b5a7fbbe587956e4c7f6a3d2c2b0a32e/README.md"
commit: "f1736b32b5a7fbbe587956e4c7f6a3d2c2b0a32e"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: null
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
  - "[[Architecture]]"
  - "[[Capabilities]]"
  - "[[SDKs]]"
  - "[[Testing]]"
  - "[[Transports]]"
---

# NOTE: this is a work in progress

# Example Remote MCP Client

A React TypeScript application for connecting to multiple MCP (Model Context Protocol) servers and providing a conversational interface with tool calling capabilities.

## Features

- 🔗 Multi-server MCP connections (HTTP/SSE transports)
- 🤖 Inference provider abstraction (starting with OpenRouter)
- 💬 Conversational interface with agent loops
- 🛠️ Real-time tool call visualization
- 🔍 MCP debugging and message tracing
- 📱 Responsive UI with left sidebar and chat interface

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

## Architecture

The application is built with a modular architecture using React hooks and providers:

- **InferenceProvider** - Abstraction for LLM inference (OpenRouter, etc.)
- **MCPProvider** - Multi-server MCP connection management
- **AgentLoop** - Tool calling and conversation flow
- **UI Components** - Modular, reusable interface components

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **MCP TypeScript SDK** for protocol implementation
- **Vitest** for testing

## Project Status

This is an active development project serving as both:
- A public example implementation of MCP client features
- A prototyping testbed for MCP protocol changes

## Related concepts

- [[Architecture]]
- [[Capabilities]]
- [[SDKs]]
- [[Testing]]
- [[Transports]]
