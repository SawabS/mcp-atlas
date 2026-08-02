---
id: "modelcontextprotocol-actions-readme-md-29e5b68baa"
title: "actions"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/actions"
source_path: "README.md"
source_url: "https://github.com/modelcontextprotocol/actions/blob/2c9cb4f4db3d54f0fa17d3232ec93c0b56facb1c/README.md"
commit: "2c9cb4f4db3d54f0fa17d3232ec93c0b56facb1c"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
---

# actions

GitHub Actions relevant to the management of MCP repositories.

## Actions

| Action | Description |
|---|---|
| [`cloudflare-pages-preview/deploy`](cloudflare-pages-preview/README.md) | Deploy a static HTML directory to Cloudflare Pages under a per-PR branch alias, inject noindex headers, and post a sticky PR comment with preview URLs |
| [`cloudflare-pages-preview/cleanup`](cloudflare-pages-preview/README.md) | Delete Cloudflare Pages deployments for a closed PR's branch alias and update the sticky comment |
| [`hugo-build`](hugo-build/README.md) | Install Go + Hugo extended and build a Hugo site (preview or production mode) |
| [`slash-commands`](slash-commands/README.md) | Handle `/lgtm` (core-maintainers only: label + approve + auto-merge), `/hold`, and `/stageblog` PR slash commands; invalidate approval on push |
