---
id: "modelcontextprotocol-registry-claude-md-0b89691bcd"
title: "CLAUDE.md"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/registry"
source_path: "CLAUDE.md"
source_url: "https://github.com/modelcontextprotocol/registry/blob/0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2/CLAUDE.md"
commit: "0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/registry"
concepts:
  - "[[Architecture]]"
  - "[[Registry]]"
---

# CLAUDE.md
_Guidance for Claude Code (claude.ai/code) when working in this repository. If it's also useful to humans (probably most things!), put the instructions in README.md instead._

Import @README.md

## Important: Publishing MCP servers

The `data/seed.json` file is seed data for local development only. Do NOT create pull requests or commits that add server entries to `data/seed.json` as a way to publish a server to the registry.

To publish an MCP server, use the `mcp-publisher` CLI tool. See `docs/modelcontextprotocol-io/quickstart.mdx` for instructions.

## Related concepts

- [[Architecture]]
- [[Registry]]
