---
id: "modelcontextprotocol-registry-docs-design-design-principles-md-1e6adf8b0d"
title: "MCP Registry Design Principles"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/registry"
source_path: "docs/design/design-principles.md"
source_url: "https://github.com/modelcontextprotocol/registry/blob/0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2/docs/design/design-principles.md"
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
  - "[[Security]]"
  - "[[Authorization]]"
---

# MCP Registry Design Principles

These are the core constraints that guide the design of the MCP Registry. They are not exhaustive, but they are the most important principles that we will use to evaluate design decisions.

## 1. Single Source of Truth

The registry serves as the authoritative metadata repository for publicly-available MCP servers, both locally-run and remote, open source and closed source. Server creators publish once, and all consumers (MCP clients, aggregators, etc.) reference the same canonical data.

## 2. Minimal Operational Burden

- Design for low maintenance and operational overhead
- Delegate complexity to existing services where possible (GitHub for auth, npm/PyPI/NuGet for packages)
- Avoid features that require constant human intervention or moderation
- Build for reasonable downtime tolerance (24h acceptable) by having consumers cache data for their end-users

## 3. Vendor Neutrality

- No preferential treatment for specific servers or organizations
- No built-in ranking, curation, or quality judgments
- Let consumers (MCP clients, aggregators) make their own curation decisions

## 4. Meets Industry Security Standards

- Leverage existing package registries (npm, PyPI, NuGet, Docker Hub, etc.) for source code distribution, obviating the need to reinvent source code security
- Use mechanisms like DNS verification, OAuth to provide base layer of authentication and trust
- Implement rate limiting, field validation, and blacklisting to prevent abuse

## 6. Reusable, Extensible Shapes; Not Infrastructure

- API shapes (OpenAPI, server.json) designed for reuse
- Enable private/internal registries using same formats
- Don't mandate infrastructure reuse - focus on interface compatibility

## 7. Progressive Enhancement

- Start with MVP that provides immediate value
- Build foundation that supports future features
- Don't over-engineer for hypothetical needs
- Each milestone should be independently valuable

## Related concepts

- [[Architecture]]
- [[Registry]]
- [[Security]]
- [[Authorization]]
