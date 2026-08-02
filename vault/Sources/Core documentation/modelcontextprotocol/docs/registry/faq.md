---
id: "modelcontextprotocol-modelcontextprotocol-docs-registry-faq-mdx-8f9c20da2e"
title: "Frequently Asked Questions"
document_type: "official-documentation"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/registry/faq.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/registry/faq.mdx"
commit: "73763114e511106fc07543f6096b3a814b1a3583"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-core"
  - "mcp/category/core-documentation"
concepts:
  - "[[Registry]]"
  - "[[Architecture]]"
  - "[[Security]]"
---

  The MCP Registry is currently in preview. Breaking changes or data resets may occur before general availability. If you encounter any issues, please report them on [GitHub](https://github.com/modelcontextprotocol/registry/issues).

## General

### What is the difference between "Official MCP Registry", "MCP Registry", "MCP registry", "MCP Registry API", etc?

- "MCP Registry API" — An API that implements the [OpenAPI spec](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/openapi.yaml) defined by the MCP Registry.
- "Official MCP Registry API" — The REST API served at `https://registry.modelcontextprotocol.io`, which is a superset of the MCP Registry API. Its OpenAPI spec can be downloaded from [https://registry.modelcontextprotocol.io/openapi.yaml](https://registry.modelcontextprotocol.io/openapi.yaml).
- "MCP registry" — A third-party service that provides an MCP Registry API.
- "Official MCP Registry" (or "The MCP Registry") — The service that lives at `https://registry.modelcontextprotocol.io`.

### Can I delete/unpublish my server?

Currently, no. At the time of writing, there is [open discussion](https://github.com/modelcontextprotocol/registry/issues/104).

### How do I update my server metadata?

Submit a new `server.json` with a unique version string. Once published, version metadata is immutable (similar to npm).

### Can I add custom metadata when publishing?

Yes, custom metadata under `_meta.io.modelcontextprotocol.registry/publisher-provided` is preserved when publishing to the registry. This allows you to include custom metadata specific to your publishing process.


There is a 4KB size limit (4096 bytes of JSON). Publishing will fail if this limit is exceeded.


## Reporting Issues

### What if I need to report a spam or malicious server?

1. Report it as abuse to the underlying package registry (e.g. NPM, PyPI, DockerHub, etc.); and
2. Raise a GitHub issue on the registry repo with a title beginning `Abuse report: `

### What if I need to report a security vulnerability in the registry itself?

Follow [the MCP community SECURITY.md](https://github.com/modelcontextprotocol/.github/blob/main/SECURITY.md).

## Related concepts

- [[Registry]]
- [[Architecture]]
- [[Security]]
