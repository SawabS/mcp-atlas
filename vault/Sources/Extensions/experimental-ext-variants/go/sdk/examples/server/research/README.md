---
id: "modelcontextprotocol-experimental-ext-variants-go-sdk-examples-server-research-readme-2f8cde99b6"
title: "Research Assistant"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/experimental-ext-variants"
source_path: "go/sdk/examples/server/research/README.md"
source_url: "https://github.com/modelcontextprotocol/experimental-ext-variants/blob/cfc05d6f5eb8829f9896d44a6d47360bd15c3b5c/go/sdk/examples/server/research/README.md"
commit: "cfc05d6f5eb8829f9896d44a6d47360bd15c3b5c"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "Apache-2.0"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/extensions"
concepts:
  - "[[Architecture]]"
  - "[[Security]]"
---

# Research Assistant

A variant-aware MCP server that manages context budget by providing the same research tools (`search_papers`, `get_paper`, `summarize`) at different verbosity levels.

Each tool sends progress notifications and log messages as it works, simulating a deep-research workflow where the client can observe each step (e.g. "Searching arXiv", "Resolving references", "Generating summary").

**Patterns demonstrated:** Context budget management with description verbosity control, notification streaming.

## Variants

| Variant | Verbosity | Status | Use Case |
|---|---|---|---|
| `deep-research` | Multi-paragraph with usage examples | Stable | Literature reviews, large context windows |
| `quick-lookup` | Single-sentence descriptions | Stable | Fast Q&A, limited token budgets |
| `synthesis` | Balanced, moderate detail | Experimental | Report generation workflows |

All three variants expose the same three tools with the same behavior — only the description detail level differs.

## Custom Ranking

Clients send a `"contextSize"` hint (`"verbose"`, `"compact"`, or `"standard"`). The ranking function matches the hint to the appropriate variant, falling back to priority order.

## Run

```bash
go run ./examples/server/research
```

The server listens on `http://localhost:8080`.

## Related concepts

- [[Architecture]]
- [[Security]]
