---
id: "modelcontextprotocol-kotlin-sdk-samples-readme-md-c8749545eb"
title: "Kotlin MCP SDK Samples"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/kotlin-sdk"
source_path: "samples/README.md"
source_url: "https://github.com/modelcontextprotocol/kotlin-sdk/blob/b133d7ecdd42a498d09dc3e60094fae94e1e899c/samples/README.md"
commit: "b133d7ecdd42a498d09dc3e60094fae94e1e899c"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/kotlin"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[SDKs]]"
  - "[[Prompts]]"
  - "[[Security]]"
  - "[[Tools]]"
---

# Kotlin MCP SDK Samples

Runnable projects demonstrating MCP server and client implementations with the
[Kotlin MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk).
For background on the protocol itself, see the [MCP documentation](https://modelcontextprotocol.io/introduction).

## Overview

| Sample                                                 | Type              | Transport       | MCP Features                       |
|--------------------------------------------------------|-------------------|-----------------|------------------------------------|
| [simple-streamable-server](./simple-streamable-server) | Server            | Streamable HTTP | Tools, Resources, Prompts, Logging |
| [kotlinlang-mcp-server](./kotlinlang-mcp-server)       | Server            | Streamable HTTP | Tools                              |
| [kotlin-mcp-server](./kotlin-mcp-server)               | Server            | STDIO, SSE      | Tools, Resources, Prompts          |
| [weather-stdio-server](./weather-stdio-server)         | Server            | STDIO           | Tools                              |
| [kotlin-mcp-client](./kotlin-mcp-client)               | Client            | STDIO           | Tool discovery & invocation        |
| [notebooks](./notebooks)                               | Client (Notebook) | Streamable HTTP | Tool discovery & invocation        |

## Getting Started

- **Building a server?** Start with [simple-streamable-server](./simple-streamable-server) — it
  uses the recommended Streamable HTTP transport and covers tools, resources, prompts, and logging.
- **Building a client?** Open the [notebooks](./notebooks) sample for a step-by-step walkthrough,
  or see [kotlin-mcp-client](./kotlin-mcp-client) for a full CLI client with Anthropic API
  integration.

## Samples

### Simple Streamable HTTP Server

A minimal Streamable HTTP server with optional Bearer token authentication. Demonstrates tools
(`greet`, `multi-greet`), a prompt template, a resource, and server-to-client logging notifications.
[Read more →](./simple-streamable-server)

### Kotlinlang MCP Server

A Streamable HTTP server that exposes the official Kotlin documentation (kotlinlang.org) to LLM
clients — full-text search via Algolia and page retrieval in markdown. Demonstrates wrapping a real
external API in an MCP server with in-memory caching.
[Read more →](./kotlinlang-mcp-server)

### Kotlin MCP Server

A multi-transport server supporting STDIO, SSE (plain), and SSE (Ktor plugin). Useful for exploring
different transport modes side by side.
[Read more →](./kotlin-mcp-server)

### Weather STDIO Server

A focused STDIO server that exposes weather forecast and alert tools backed by the weather.gov API.
Includes Claude Desktop integration instructions.
[Read more →](./weather-stdio-server)

### Kotlin MCP Client

An interactive CLI client that connects to any MCP server over STDIO and routes queries through
Anthropic's Claude API, bridging MCP tools with LLM conversations.
[Read more →](./kotlin-mcp-client)

### MCP Client Notebook

A Kotlin notebook that connects to a remote MCP server via Streamable HTTP and demonstrates ping,
tool listing, and tool invocation — all in an interactive cell-by-cell format.
[Read more →](./notebooks)

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[SDKs]]
- [[Prompts]]
- [[Security]]
- [[Tools]]
