---
id: "modelcontextprotocol-mcpb-examples-readme-md-fdea1ecf9d"
title: "MCPB Examples"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/mcpb"
source_path: "examples/README.md"
source_url: "https://github.com/modelcontextprotocol/mcpb/blob/70fe3b34cd6dff1b3bba046638edc72a6467a4fb/examples/README.md"
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
  - "[[Security]]"
  - "[[Testing]]"
---

# MCPB Examples

This directory contains example MCP Bundles that demonstrate the MCPB format and manifest structure. These are **reference implementations** designed to illustrate how to build MCPB extensions.

## ⚠️ Not Production Ready

**Important:** These examples are **NOT intended for production use**. They serve as:

- Demonstrations of the MCPB manifest format
- Templates for building your own extensions
- Simple MCP server implementations for testing

But, the MCP servers themselves are not robust secure production ready servers and should not be relied upon for production use.

## Examples Included

| Example               | Type    | Demonstrates                                |
| --------------------- | ------- | ------------------------------------------- |
| `hello-world-node`    | Node.js | Basic MCP server with simple time tool      |
| `chrome-applescript`  | Node.js | Browser automation via AppleScript          |
| `file-manager-python` | Python  | File system operations and path handling    |
| `calculator-rust`     | Binary  | Compiled Rust binary as MCP Bundle          |

## Usage

Each example includes its own `manifest.json` and can be packed with:

```bash
dxt pack examples/hello-world-node
```

Use these as starting points for your own extensions, but ensure you implement proper security measures before deploying to users.

## Related concepts

- [[Architecture]]
- [[Security]]
- [[Testing]]
