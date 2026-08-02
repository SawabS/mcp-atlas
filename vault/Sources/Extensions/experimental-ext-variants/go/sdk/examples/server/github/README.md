---
id: "modelcontextprotocol-experimental-ext-variants-go-sdk-examples-server-github-readme-md-9400535b2d"
title: "GitHub Developer Platform"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/experimental-ext-variants"
source_path: "go/sdk/examples/server/github/README.md"
source_url: "https://github.com/modelcontextprotocol/experimental-ext-variants/blob/cfc05d6f5eb8829f9896d44a6d47360bd15c3b5c/go/sdk/examples/server/github/README.md"
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
  - "[[Testing]]"
---

# GitHub Developer Platform

A variant-aware MCP server that exposes different tool sets for different agent types, mirroring the GitHub MCP Server pattern described in SEP-2053's Prior Art section.

**Pattern demonstrated:** Different tool sets per variant with custom ranking.

## Variants

| Variant | Tools | Description |
|---|---|---|
| `code-review` | `list_pull_requests`, `get_diff`, `add_review_comment` | PR operations and code review |
| `project-management` | `list_issues`, `create_issue`, `add_label` | Issue tracking and labels |
| `security-readonly` | `list_security_alerts`, `get_advisory` | Security scanning (read-only) |
| `ci-automation` | `list_workflow_runs`, `trigger_workflow` | CI/CD workflow management |

## Custom Ranking

Clients send a `"domain"` hint during initialization. The ranking function boosts variants whose `domain` hint matches the client's requested domain, falling back to priority order.

## Run

```bash
go run ./examples/server/github
```

Connect any MCP client to `http://localhost:8080`.

## Demo

See [mcp-inspector-variants-demo.mp4](mcp-inspector-variants-demo.mp4) for a walkthrough using MCP Inspector.

## Related concepts

- [[Architecture]]
- [[Security]]
- [[Testing]]
