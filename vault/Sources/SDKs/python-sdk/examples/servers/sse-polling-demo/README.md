---
id: "modelcontextprotocol-python-sdk-examples-servers-sse-polling-demo-readme-md-257ef38801"
title: "MCP SSE Polling Demo Server"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/servers/sse-polling-demo/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/servers/sse-polling-demo/README.md"
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

# MCP SSE Polling Demo Server

Demonstrates the SSE polling pattern with server-initiated stream close for long-running tasks (SEP-1699).

## Features

- Priming events (automatic with EventStore)
- Server-initiated stream close via `close_sse_stream()` callback
- Client auto-reconnect with Last-Event-ID
- Progress notifications during long-running tasks
- Configurable retry interval

## Usage

```bash
# Start server on default port
uv run mcp-sse-polling-demo --port 3000

# Custom retry interval (milliseconds)
uv run mcp-sse-polling-demo --port 3000 --retry-interval 100
```

## Tool: process_batch

Processes items with periodic checkpoints that trigger SSE stream closes:

- `items`: Number of items to process (1-100, default: 10)
- `checkpoint_every`: Close stream after this many items (1-20, default: 3)

## Client

Use the companion `mcp-sse-polling-client` to test:

```bash
uv run mcp-sse-polling-client --url http://localhost:3000/mcp
```

## Related concepts

- [[Architecture]]
