---
id: "modelcontextprotocol-registry-docs-design-ecosystem-vision-md-1a600d4659"
title: "Ecosystem Vision"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/registry"
source_path: "docs/design/ecosystem-vision.md"
source_url: "https://github.com/modelcontextprotocol/registry/blob/0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2/docs/design/ecosystem-vision.md"
commit: "0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/registry"
concepts:
  - "[[Registry]]"
  - "[[Architecture]]"
  - "[[Security]]"
  - "[[Capabilities]]"
---

# Ecosystem Vision

How the MCP Registry fits into the broader ecosystem and our vision for the future.

## The Registry Ecosystem

The MCP registry provides MCP clients with a list of MCP servers, like an app store for MCP servers. (In the future it might do more, like also hosting a list of clients).

There are two parts to the registry project:

1. 🟦 **The MCP registry spec**: An [API specification](../reference/api/) that allows anyone to implement a registry.
2. 🟥 **The Official MCP registry**: A hosted registry following the MCP registry spec at [`registry.modelcontextprotocol.io`](https://registry.modelcontextprotocol.io). This serves as the **authoritative repository** for publicly-available MCP servers. Server creators publish once, and all consumers (MCP clients, aggregators, marketplaces) reference the same canonical data. This is owned by the MCP open-source community, backed by major trusted contributors to the MCP ecosystem such as Anthropic, GitHub, PulseMCP and Microsoft.

The registry is built around the [`server.json`](../reference/server-json/) format - a standardized way to describe MCP servers that works across discovery, initialization, and packaging scenarios.

In time, we expect the ecosystem to look a bit like this:

![](./ecosystem-diagram.excalidraw.svg)

Note that MCP registries are _metaregistries_. They host metadata about packages, but not the package code or binaries. Instead, they reference other package registries (like NPM, PyPi or Docker) for this.

Additionally, we expect clients pull from _subregistries_. These subregistries add value to the registry ecosystem by providing curation, or extending it with additional metadata. The Official MCP registry expects a lot of API requests from ETL jobs from these subregistries.

## Registry vs Package Registry

Key distinction: MCP Registries are **metaregistries**.

- **Package registries** (npm, PyPI, Docker Hub) host actual code/binaries
- **The MCP Registry** hosts metadata pointing to those packages

```
MCP Registry: "weather-server v1.2.0 is at npm:weather-mcp"
NPM Registry: [actual weather-mcp package code]
```

## Official vs Community Registries

**Official MCP Registry** (`registry.modelcontextprotocol.io`):
- Canonical source for publicly-available servers
- Community-owned, backed by trusted contributors
- Focuses on discoverability and basic metadata

**Subregistries** (Smithery, PulseMCP, etc.):
- Add value through curation, ratings, enhanced metadata
- ETL from official registry + additional annotations
- Serve specific communities or use cases

## How Servers Are Represented

Each server entry contains:
- **Identity**: Unique name (`io.github.user/server-name`)
- **Packages**: Where to download it (`npm`, `pypi`, `docker`, etc.)
- **Runtime**: How to execute it (args, env vars)
- **Metadata**: Description, capabilities, version

This is stored in a standardized `server.json` format that works across discovery, installation, and execution.

## Related concepts

- [[Registry]]
- [[Architecture]]
- [[Security]]
- [[Capabilities]]
