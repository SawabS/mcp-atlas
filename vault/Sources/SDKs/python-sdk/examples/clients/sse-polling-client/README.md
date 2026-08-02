---
id: "modelcontextprotocol-python-sdk-examples-clients-sse-polling-client-readme-md-26f408cf66"
title: "MCP SSE Polling Demo Client"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/clients/sse-polling-client/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/clients/sse-polling-client/README.md"
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
---

# MCP SSE Polling Demo Client

Demonstrates client-side auto-reconnect for the SSE polling pattern (SEP-1699).

## Features

- Connects to SSE polling demo server
- Automatically reconnects when server closes SSE stream
- Resumes from Last-Event-ID to avoid missing messages
- Respects server-provided retry interval

## Usage

```bash
# First start the server:
uv run mcp-sse-polling-demo --port 3000

# Then run this client:
uv run mcp-sse-polling-client --url http://localhost:3000/mcp

# Custom options:
uv run mcp-sse-polling-client --url http://localhost:3000/mcp --items 20 --checkpoint-every 5
```

## Options

- `--url`: Server URL (default: <http://localhost:3000/mcp>)
- `--items`: Number of items to process (default: 10)
- `--checkpoint-every`: Checkpoint interval (default: 3)
- `--log-level`: Logging level (default: DEBUG)

## Related concepts

- [[Architecture]]
