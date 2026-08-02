---
id: "modelcontextprotocol-java-sdk-docs-development-md-7b827d3bff"
title: "Documentation"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/java-sdk"
source_path: "docs/development.md"
source_url: "https://github.com/modelcontextprotocol/java-sdk/blob/fd004989b9484c9b81be6b03463396797b354804/docs/development.md"
commit: "fd004989b9484c9b81be6b03463396797b354804"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/java"
concepts:
  - "[[Architecture]]"
  - "[[SDKs]]"
---

# Documentation Development

This guide covers how to set up and preview the MCP Java SDK documentation locally.

!!! info "Prerequisites"
    - Python 3.x
    - pip (Python package manager)

## Setup

Install mkdocs-material:

```bash
pip install mkdocs-material
```

## Preview Locally

From the project root directory, run:

```bash
mkdocs serve
```

A local preview of the documentation will be available at `http://localhost:8000`.

### Custom Ports

By default, mkdocs uses port 8000. You can customize the port with the `-a` flag:

```bash
mkdocs serve -a localhost:3333
```

## Building

To build the static site for deployment:

```bash
mkdocs build
```

The built site will be output to the `site/` directory.

## Project Structure

```
docs/
├── index.md            # Overview page
├── quickstart.md       # Quickstart guide
├── client.md           # MCP Client documentation
├── server.md           # MCP Server documentation
├── contributing.md     # Contributing guide
├── development.md      # This page
├── images/             # Images and diagrams
└── stylesheets/        # Custom CSS
mkdocs.yml              # MkDocs configuration
```

## Writing Guidelines

- Documentation pages use standard Markdown with [mkdocs-material extensions](https://squidfunk.github.io/mkdocs-material/reference/)
- Use content tabs (`=== "Tab Label"`) for Maven/Gradle or Sync/Async code examples
- Use admonitions (`!!! tip`, `!!! info`, `!!! warning`) for callouts
- All code blocks should specify a language for syntax highlighting
- Images go in the `docs/images/` directory

## IDE Support

We suggest using extensions on your IDE to recognize and format Markdown. If you're a VSCode user, consider the [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) extension for enhanced Markdown support, and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for code formatting.

## Related concepts

- [[Architecture]]
- [[SDKs]]
