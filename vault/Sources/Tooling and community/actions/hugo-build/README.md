---
id: "modelcontextprotocol-actions-hugo-build-readme-md-ca3679f19b"
title: "hugo-build"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/actions"
source_path: "hugo-build/README.md"
source_url: "https://github.com/modelcontextprotocol/actions/blob/2c9cb4f4db3d54f0fa17d3232ec93c0b56facb1c/hugo-build/README.md"
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

# hugo-build

Installs Go + Hugo (extended edition) and builds a Hugo site. Preview mode
includes drafts and future-dated posts; production mode does not.

## What it does

1. Sets up Go (for Hugo modules)
2. Downloads and installs Hugo extended from GitHub releases
3. Runs `hugo --gc --minify --baseURL <base-url>` in the working directory,
   adding `--buildDrafts --buildFuture` when `mode: preview`

Output lands in `<working-directory>/public`.

## Prerequisites

- The caller must have already checked out the Hugo site source. This action
  does **not** run `actions/checkout`.

## Required secrets

None.

## Caller workflow requirements

| | |
|---|---|
| **Permissions** | `contents: read` (for checkout, not for this action) |
| **Checkout** | Caller must checkout before calling |

## Usage

```yaml
- uses: actions/checkout@v6
  with:
    submodules: recursive
    fetch-depth: 0

- uses: modelcontextprotocol/actions/hugo-build@main
  with:
    working-directory: blog
    mode: preview   # or: production
    base-url: /
```

Then deploy `blog/public` however you like (Cloudflare Pages, GitHub Pages, etc.)

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `working-directory` | | `.` | Directory containing `hugo.toml` |
| `mode` | | `preview` | `preview` → development env, `--buildDrafts --buildFuture`. `production` → production env, no drafts/future. |
| `base-url` | | `/` | Hugo `--baseURL` |
| `hugo-version` | | `0.148.0` | Hugo extended version |
| `go-version` | | `1.24` | Go version for Hugo modules |

## Outputs

| Output | Description |
|---|---|
| `public-dir` | Path to built site (`<working-directory>/public`) |
