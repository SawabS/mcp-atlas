---
id: "modelcontextprotocol-kotlin-sdk-samples-notebooks-readme-md-a26361218b"
title: "MCP Client Notebook"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/kotlin-sdk"
source_path: "samples/notebooks/README.md"
source_url: "https://github.com/modelcontextprotocol/kotlin-sdk/blob/b133d7ecdd42a498d09dc3e60094fae94e1e899c/samples/notebooks/README.md"
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
---

# MCP Client Notebook

An interactive Kotlin notebook that demonstrates connecting to a remote MCP server and calling tools.

## Overview

This notebook walks through building an MCP client step by step: creating a Ktor HTTP client,
initializing an MCP `Client`, connecting via `StreamableHttpClientTransport`, and interacting with
the server (ping, list tools, call tools). It connects to the public
[Microsoft Learn MCP Server](https://learn.microsoft.com/api/mcp) as an example.

## Prerequisites

- [Kotlin Jupyter kernel](https://github.com/Kotlin/kotlin-jupyter) **or** IntelliJ IDEA with the
  [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)
- Internet access (the notebook connects to an external MCP server)

## How to Run

1. Open `McpClient.ipynb` in IntelliJ IDEA (with Kotlin Notebook plugin) or in Jupyter with the
   Kotlin kernel installed.
2. Run cells sequentially from top to bottom.

## What It Demonstrates

- Adding MCP SDK dependencies in a notebook environment
- Creating a Ktor `HttpClient` with SSE and logging plugins
- Creating an MCP `Client` and connecting via `StreamableHttpClientTransport`
- Sending a `ping` request
- Listing available tools from the remote server
- Calling a tool (`microsoft_docs_search`) and displaying results

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[SDKs]]
