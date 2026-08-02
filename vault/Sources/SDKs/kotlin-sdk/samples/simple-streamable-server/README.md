---
id: "modelcontextprotocol-kotlin-sdk-samples-simple-streamable-server-readme-md-48b1ac1927"
title: "Simple Streamable HTTP Server"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/kotlin-sdk"
source_path: "samples/simple-streamable-server/README.md"
source_url: "https://github.com/modelcontextprotocol/kotlin-sdk/blob/b133d7ecdd42a498d09dc3e60094fae94e1e899c/samples/simple-streamable-server/README.md"
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
  - "[[Security]]"
  - "[[Testing]]"
  - "[[Authorization]]"
  - "[[Capabilities]]"
  - "[[Prompts]]"
---

# Simple Streamable HTTP Server

A minimal MCP server using the recommended Streamable HTTP transport with optional Bearer token authentication.

## Overview

This sample demonstrates a Streamable HTTP MCP server built with Ktor. It exposes tools, a prompt
template, and a resource over HTTP, and optionally supports Bearer token authentication. The
`multi-greet` tool showcases server-to-client logging notifications with streaming delays.

## Prerequisites

- JDK 17+

## Build & Run

### Without authentication

```shell
./gradlew run
```

The server starts on `http://localhost:3001/mcp` by default.

Connect with the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```shell
npx @modelcontextprotocol/inspector
```

In the Inspector UI, select **Streamable HTTP** transport and enter `http://localhost:3001/mcp`.

Pass a port number as an argument to change it:

```shell
./gradlew run --args="8080"
```

### With authentication

```shell
MCP_AUTH_TOKEN=my-secret ./gradlew run --args="--auth"
```

When `--auth` is passed, clients must include an `Authorization: Bearer <token>` header.
The token is read from the `MCP_AUTH_TOKEN` environment variable (required when `--auth` is used).

### Authentication caveats

This sample is intended **for demonstration only**. In production you should:

- Use a proper identity provider instead of a static token.
- Restrict CORS origins to your deployment domain — the sample allows all origins.
- Serve the endpoint over HTTPS.

## MCP Capabilities

### Tools

| Name | Description |
|------|-------------|
| `greet` | Returns a greeting for a given `name`. |
| `multi-greet` | Sends logging notifications between delayed greetings, demonstrating streaming. |

### Prompts

| Name | Description |
|------|-------------|
| `greeting-template` | Generates a friendly greeting message for a given `name`. |

### Resources

| Name | URI | Description |
|------|-----|-------------|
| `Default Greeting` | `https://example.com/greetings/default` | Returns a static "Hello, world!" text. |

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[Security]]
- [[Testing]]
- [[Authorization]]
- [[Capabilities]]
- [[Prompts]]
