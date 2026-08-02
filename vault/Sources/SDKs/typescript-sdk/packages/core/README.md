---
id: "modelcontextprotocol-typescript-sdk-packages-core-readme-md-7d2c3d792b"
title: "@modelcontextprotocol/core"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "packages/core/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/packages/core/README.md"
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
  - "[[Authorization]]"
  - "[[Architecture]]"
  - "[[SDKs]]"
  - "[[Security]]"
---

# @modelcontextprotocol/core

Canonical public home for the [Model Context Protocol](https://modelcontextprotocol.io) specification and OAuth/OpenID **Zod schemas**.

These are the exact schema constants the SDK validates protocol and OAuth/OpenID payloads against internally. The `@modelcontextprotocol/server` and `@modelcontextprotocol/client` packages keep a Zod-free public surface, so this package exists as the supported place to import the
raw schemas when you need to validate or parse MCP messages yourself.

## Install

```sh
npm install @modelcontextprotocol/core
```

## Usage

```ts
import { CallToolResultSchema } from '@modelcontextprotocol/core';

// Throws on invalid input; returns the typed result on success.
const result = CallToolResultSchema.parse(payload);

// Or non-throwing:
const parsed = CallToolResultSchema.safeParse(payload);
if (parsed.success) {
    // parsed.data is a fully typed CallToolResult
}
```

## Scope

This package exports **only** Zod schema constants (`*Schema`), in two groups:

- the MCP **spec** schemas — `CallToolResultSchema`, `ListToolsResultSchema`, …; and
- the **OAuth/OpenID** auth schemas — `OAuthTokensSchema`, `OAuthMetadataSchema`, `IdJagTokenExchangeResponseSchema`, … (the schemas v1 exposed from `@modelcontextprotocol/sdk/shared/auth.js`).

The corresponding TypeScript types, error classes, enums, and type guards are part of the public API of [`@modelcontextprotocol/server`](https://www.npmjs.com/package/@modelcontextprotocol/server) and
[`@modelcontextprotocol/client`](https://www.npmjs.com/package/@modelcontextprotocol/client).

> **Migrating from v1?** In v1 these schemas were imported from `@modelcontextprotocol/sdk/types.js` (spec schemas) and `@modelcontextprotocol/sdk/shared/auth.js` (OAuth/OpenID schemas). Point those `*Schema` imports at `@modelcontextprotocol/core` and your existing `.parse()` /
> `.safeParse()` calls keep working unchanged.

## Related concepts

- [[Authorization]]
- [[Architecture]]
- [[SDKs]]
- [[Security]]
