---
id: "modelcontextprotocol-kotlin-sdk-samples-kotlin-mcp-server-readme-md-2601b3ffde"
title: "Kotlin MCP Server"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/kotlin-sdk"
source_path: "samples/kotlin-mcp-server/README.md"
source_url: "https://github.com/modelcontextprotocol/kotlin-sdk/blob/b133d7ecdd42a498d09dc3e60094fae94e1e899c/samples/kotlin-mcp-server/README.md"
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
  - "[[Transports]]"
  - "[[Testing]]"
  - "[[Architecture]]"
  - "[[Capabilities]]"
  - "[[SDKs]]"
---

# Kotlin MCP Server

A sample MCP server demonstrating multiple transport modes: STDIO, SSE (plain), and SSE (Ktor
plugin).

> **Note:** The SSE transport modes are provided for backward compatibility. For new projects,
> consider using the [simple-streamable-server](../simple-streamable-server) sample, which uses the
> recommended Streamable HTTP transport.

## Overview

This sample registers a prompt, a tool, and a resource, then lets you choose how to expose them.
STDIO mode is the default and is best for process-based clients. The two SSE modes show how to
serve MCP over HTTP using either a manual Ktor routing setup or the built-in `mcp { }` Ktor plugin.

## Prerequisites

- JDK 17+
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) (optional, for testing)

## Build & Run

### STDIO mode (default)

```shell
./gradlew run
```

Or explicitly:

```shell
./gradlew run --args="--stdio"
```

Connect with the MCP Inspector:

```shell
npx @modelcontextprotocol/inspector --config samples/kotlin-mcp-server/mcp-inspector-config.json --server stdio-server
```

### SSE with Ktor plugin

```shell
./gradlew run --args="--sse-server-ktor 3002"
```

Connect with the MCP Inspector:

```shell
npx @modelcontextprotocol/inspector --config samples/kotlin-mcp-server/mcp-inspector-config.json --server sse-ktor-server
```

### SSE with plain configuration

> **Known issue:** This mode may not work correctly at this time.

```shell
./gradlew run --args="--sse-server 3001"
```

Connect with the MCP Inspector:

```shell
npx @modelcontextprotocol/inspector --config samples/kotlin-mcp-server/mcp-inspector-config.json --server sse-server
```

## MCP Capabilities

### Tools

| Name              | Description                                          |
|-------------------|------------------------------------------------------|
| `kotlin-sdk-tool` | A test tool that returns a "Hello, world!" greeting. |

### Prompts

| Name               | Description                                                                        |
|--------------------|------------------------------------------------------------------------------------|
| `Kotlin Developer` | Generates a prompt to develop a small Kotlin application for a given project name. |

### Resources

| Name         | URI                   | Description                                             |
|--------------|-----------------------|---------------------------------------------------------|
| `Web Search` | `https://search.com/` | A placeholder resource demonstrating resource handling. |

## Related concepts

- [[Transports]]
- [[Testing]]
- [[Architecture]]
- [[Capabilities]]
- [[SDKs]]
