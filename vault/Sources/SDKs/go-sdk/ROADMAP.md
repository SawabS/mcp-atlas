---
id: "modelcontextprotocol-go-sdk-roadmap-md-790c5571db"
title: "MCP Go SDK Roadmap"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/go-sdk"
source_path: "ROADMAP.md"
source_url: "https://github.com/modelcontextprotocol/go-sdk/blob/0c004ee48a11d6752eed40b1b7a5cdee58a55acd/ROADMAP.md"
commit: "0c004ee48a11d6752eed40b1b7a5cdee58a55acd"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/go"
concepts:
  - "[[SDKs]]"
  - "[[Authorization]]"
  - "[[Architecture]]"
---

# MCP Go SDK Roadmap

## Current focus

The following items are planned for the next release (v1.4.0):

- **SEP-1730: Tier 1 SDK support** (https://github.com/modelcontextprotocol/go-sdk/issues/675)
  - Description: We aim to be rated as Tier 1 SDK.
- **SEP-1577: support Sampling With Tools** (https://github.com/modelcontextprotocol/go-sdk/issues/629)
  - Description: Sampling with Tools is the last SEP to be implemented
    to implement the full scope of 2025-11-25 MCP specification.
- **OAuth Support** (https://github.com/modelcontextprotocol/go-sdk/issues/19)
  - Description: Client-side OAuth support is the last feature
    needed to provide the Authorization solution as per specification.

## Future work

Once the tiering system is in place, we will draft a new roadmap to describe
our long-term strategy. It may include experimental features or extensions
to the MCP specification listed in the next section.

## Experimental features

- **SEP-1686 (experimental): Implement Tasks** (https://github.com/modelcontextprotocol/go-sdk/issues/626)

## Extensions

### Authorization extensions (https://github.com/modelcontextprotocol/ext-auth)

- **ext-auth: Enterprise Managed Authorization** (https://github.com/modelcontextprotocol/go-sdk/issues/628)
  - Status: In progress - https://github.com/modelcontextprotocol/go-sdk/pull/770
- **ext-auth: OAuth Client Credentials** (https://github.com/modelcontextprotocol/go-sdk/issues/627)

## Related concepts

- [[SDKs]]
- [[Authorization]]
- [[Architecture]]
