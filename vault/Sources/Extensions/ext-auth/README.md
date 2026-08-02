---
id: "modelcontextprotocol-ext-auth-readme-md-ec3b0cd439"
title: "MCP Authorization Extensions"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/ext-auth"
source_path: "README.md"
source_url: "https://github.com/modelcontextprotocol/ext-auth/blob/fb374c7db2b34f18ca9183882e0beecdf661892b/README.md"
commit: "fb374c7db2b34f18ca9183882e0beecdf661892b"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/extensions"
concepts:
  - "[[Authorization]]"
  - "[[Security]]"
  - "[[Architecture]]"
  - "[[Capabilities]]"
---

# MCP Authorization Extensions

The Model Context Protocol (MCP) specification is defined in the [main specification repository](https://github.com/modelcontextprotocol/modelcontextprotocol/tree/main/docs/specification). This repository contains **extensions** to the core protocol that define additional authorization mechanisms.

These extensions are:

- **Optional** - Implementations can choose to adopt these extensions
- **Additive** - Extensions do not modify or break core protocol functionality; they add new capabilities while preserving core protocol behavior
- **Composable** - Extensions are modular and designed to work together without conflicts, allowing implementations to adopt multiple extensions simultaneously
- **Versioned independently** - Extensions follow the core MCP versioning cycle but may adopt independent versioning as needed

## Extensions

### Stable

- [Enterprise-Managed Authorization](https://github.com/modelcontextprotocol/ext-auth/blob/main/specification/stable/enterprise-managed-authorization.mdx)

### Draft

- [Client Credentials](https://github.com/modelcontextprotocol/ext-auth/blob/main/specification/draft/oauth-client-credentials.mdx)

## Governance

This repository follows the [Model Context Protocol Governance](https://modelcontextprotocol.io/community/governance) process, with a dedicated set of maintainers for authorization extensions. See [MAINTAINERS.md](./MAINTAINERS.md) for the list of maintainers specific to this repository.

All decisions regarding authorization extensions follow the same governance model as the core specification, including:

- Specification Enhancement Proposals (SEPs)
- Community discussion and consensus building
- Maintainer review and approval
- Transparent decision-making

## Policies

This repository follows the Model Context Protocol project policies:

- [Code of Conduct](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/CODE_OF_CONDUCT.md)
- [Contributing Guidelines](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/CONTRIBUTING.md)
- [Security Policy](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/SECURITY.md)
- [Antitrust Policy](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/ANTITRUST.md)

## Related concepts

- [[Authorization]]
- [[Security]]
- [[Architecture]]
- [[Capabilities]]
