---
id: "modelcontextprotocol-python-sdk-examples-servers-everything-server-readme-md-5ea4643c73"
title: "MCP Everything Server"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/servers/everything-server/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/servers/everything-server/README.md"
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
  - "[[Testing]]"
  - "[[Reference Servers]]"
  - "[[SDKs]]"
---

# MCP Everything Server

A comprehensive MCP server implementing all protocol features for conformance testing.

## Overview

The Everything Server is a reference implementation that demonstrates all features of the Model Context Protocol (MCP). It is designed to be used with the [MCP Conformance Test Framework](https://github.com/modelcontextprotocol/conformance) to validate MCP client and server implementations.

## Installation

From the python-sdk root directory:

```bash
uv sync --frozen
```

## Usage

### Running the Server

Start the server with default settings (port 3001):

```bash
uv run -m mcp_everything_server
```

Or with custom options:

```bash
uv run -m mcp_everything_server --port 3001 --log-level DEBUG
```

The server will be available at: `http://localhost:3001/mcp`

### Command-Line Options

- `--port` - Port to listen on (default: 3001)
- `--log-level` - Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL (default: INFO)

## Running Conformance Tests

See the [MCP Conformance Test Framework](https://github.com/modelcontextprotocol/conformance) for instructions on running conformance tests against this server.

## Related concepts

- [[Architecture]]
- [[Testing]]
- [[Reference Servers]]
- [[SDKs]]
