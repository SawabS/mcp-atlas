---
id: "modelcontextprotocol-go-sdk-internal-docs-quick-start-src-md-603593bea5"
title: "Quick Start"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/go-sdk"
source_path: "internal/docs/quick_start.src.md"
source_url: "https://github.com/modelcontextprotocol/go-sdk/blob/0c004ee48a11d6752eed40b1b7a5cdee58a55acd/internal/docs/quick_start.src.md"
commit: "0c004ee48a11d6752eed40b1b7a5cdee58a55acd"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/go"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
---

# Quick Start

%toc

## Installation

```
go get github.com/modelcontextprotocol/go-sdk
```

## Getting started

To get started creating an MCP server, create an `mcp.Server` instance, add
features to it, and then run it over an `mcp.Transport`. For example, this
server adds a single simple tool, and then connects it to clients over
stdin/stdout:

%include ../readme/server/server.go -

To communicate with that server, create an `mcp.Client` and connect it to the
corresponding server, by running the server command and communicating over its
stdin/stdout:

%include ../readme/client/client.go -

The [`examples/`](https://github.com/modelcontextprotocol/go-sdk/tree/main/examples) directory contains more example clients and
servers.

## Related concepts

- [[Architecture]]
- [[Transports]]
