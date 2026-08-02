---
id: "modelcontextprotocol-typescript-sdk-docs-migration-index-md-c29562307e"
title: "Migration Guides"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "docs/migration/index.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/docs/migration/index.md"
commit: "cc4b41617ce3601b1290d67216ea0b194a3cd9ac"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/typescript"
concepts:
  - "[[SDKs]]"
  - "[[Architecture]]"
  - "[[Capabilities]]"
  - "[[Transports]]"
---

# MCP TypeScript SDK — Migration Guides

Pick the guide for your starting point.

## Upgrading from v1.x (`@modelcontextprotocol/sdk`)

→ **[upgrade-to-v2.md](./upgrade-to-v2.md)**

You are on the monolithic `@modelcontextprotocol/sdk` package and want to move to the
v2 packages (`@modelcontextprotocol/client`, `@modelcontextprotocol/server`, …).

Start by running the codemod:

```bash
npx @modelcontextprotocol/codemod@latest v1-to-v2 .
```

Run it at the package root (`.`) — real projects import the SDK from `test/`,
`scripts/`, and fixtures too, and those rewrites are missed when you point it at `./src`.

The codemod handles most mechanical renames. The guide covers what it can't. The
codemod handles the v1→v2 SDK surface upgrade only — adopting the 2026-07-28 protocol
revision (`createMcpHandler`, multi-round-trip requests, `versionNegotiation`) is
architectural and not codemod-automatable; see [support-2026-07-28.md](./support-2026-07-28.md).

## Already on v2, adopting protocol revision 2026-07-28

→ **[support-2026-07-28.md](./support-2026-07-28.md)**

You are already on the v2 packages and want your server or client to speak the
2026-07-28 protocol revision (per-request `_meta` envelope, `createMcpHandler`,
`serveStdio`, `versionNegotiation`, multi-round-trip requests, per-era wire codecs).

This guide also covers code written against an earlier **v2 alpha** that read
wire-only members (`resultType`, envelope keys) directly.

## Using an LLM agent to migrate

[upgrade-to-v2.md](./upgrade-to-v2.md) is the agent skill — it carries skill
frontmatter and is structured for mechanical application. Point the agent at
the codemod first; the guide is the codemod's companion for what's left.

## See also

- [`@modelcontextprotocol/codemod` README](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/packages/codemod/README.md)
- [Troubleshooting](../troubleshooting.md)
- [Examples](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/examples)

## Related concepts

- [[SDKs]]
- [[Architecture]]
- [[Capabilities]]
- [[Transports]]
