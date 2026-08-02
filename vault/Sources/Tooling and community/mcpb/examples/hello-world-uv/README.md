---
id: "modelcontextprotocol-mcpb-examples-hello-world-uv-readme-md-20b5a771aa"
title: "Hello World UV Runtime Example"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/mcpb"
source_path: "examples/hello-world-uv/README.md"
source_url: "https://github.com/modelcontextprotocol/mcpb/blob/70fe3b34cd6dff1b3bba046638edc72a6467a4fb/examples/hello-world-uv/README.md"
commit: "70fe3b34cd6dff1b3bba046638edc72a6467a4fb"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
  - "[[Architecture]]"
  - "[[Testing]]"
---

# Hello World UV Runtime Example

This example demonstrates a minimal MCP server using **UV runtime**.

## What is UV Runtime?

UV runtime lets Claude Desktop automatically manage Python and dependencies for your extension:
- Downloads the correct Python version for the user's platform
- Creates an isolated virtual environment
- Installs dependencies from `pyproject.toml`
- Works cross-platform (Windows, macOS, Linux) without user setup

## Structure

```
hello-world-uv/
├── manifest.json       # server.type = "uv"
├── pyproject.toml      # Dependencies listed here
├── .mcpbignore        # Exclude build artifacts
└── src/
    └── server.py       # MCP server implementation
```

## Key Differences from Python Runtime

**UV Runtime** (this example):
- `server.type = "uv"`
- No bundled dependencies
- `mcp_config` uses `uv run` to auto-resolve deps from `pyproject.toml`
- Small bundle size (~2 KB)
- Works on any platform

**Python Runtime** (traditional):
- `server.type = "python"`
- Must bundle dependencies in `server/lib/`
- Requires `mcp_config` with PYTHONPATH
- Larger bundle size
- Only works with pure Python (no compiled deps)

## Installing

```bash
mcpb pack
```

Install the generated `.mcpb` file in Claude Desktop.

## Testing Locally

```bash
# Install dependencies
uv sync

# Run server
uv run src/server.py
```

## Tools

- **say_hello** - Greets a person by name

## Related concepts

- [[Architecture]]
- [[Testing]]
