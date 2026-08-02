---
id: "modelcontextprotocol-python-sdk-examples-servers-simple-streamablehttp-stateless-readm-69cfcca6a3"
title: "MCP Simple StreamableHttp Stateless Server Example"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/servers/simple-streamablehttp-stateless/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/servers/simple-streamablehttp-stateless/README.md"
commit: "a4f4ccd091138771535e17191123f20b30fda68e"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/python"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[Testing]]"
  - "[[SDKs]]"
---

# MCP Simple StreamableHttp Stateless Server Example

A stateless MCP server example demonstrating the StreamableHttp transport without maintaining session state. This example is ideal for understanding how to deploy MCP servers in multi-node environments where requests can be routed to any instance.

## Features

- Uses the StreamableHTTP transport in stateless mode (mcp_session_id=None)
- Each request creates a new ephemeral connection
- No session state maintained between requests
- Suitable for deployment in multi-node environments

## Usage

Start the server:

```bash
# Using default port 3000
uv run mcp-simple-streamablehttp-stateless

# Using custom port
uv run mcp-simple-streamablehttp-stateless --port 3000

# Custom logging level
uv run mcp-simple-streamablehttp-stateless --log-level DEBUG

# Enable JSON responses instead of SSE streams
uv run mcp-simple-streamablehttp-stateless --json-response
```

The server exposes a tool named "start-notification-stream" that accepts three arguments:

- `interval`: Time between notifications in seconds (e.g., 1.0)
- `count`: Number of notifications to send (e.g., 5)
- `caller`: Identifier string for the caller

## Client

You can connect to this server using an HTTP client. For now, only the TypeScript SDK has streamable HTTP client examples, or you can use [Inspector](https://github.com/modelcontextprotocol/inspector) for testing.

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[Testing]]
- [[SDKs]]
