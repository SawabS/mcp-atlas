---
id: "modelcontextprotocol-typescript-sdk-packages-middleware-readme-md-547ac091b3"
title: "Middleware packages"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "packages/middleware/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/packages/middleware/README.md"
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
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[SDKs]]"
---

# Middleware packages

The packages in `packages/middleware/*` are **thin integration layers** that help you expose an MCP server in a specific runtime, platform, or web framework.

They intentionally **do not** add new MCP features or “business logic”. MCP functionality (tools, resources, prompts, transports, auth primitives, etc.) lives in `@modelcontextprotocol/server` (and other core packages). Middleware packages should primarily:

- adapt request/response types to the SDK (e.g. Node.js `IncomingMessage`/`ServerResponse`)
- provide small framework helpers (e.g. wiring, body parsing hooks)
- supply safe defaults for common deployment pitfalls (e.g. localhost DNS rebinding protection)

## Packages

- `@modelcontextprotocol/express` — Express helpers (app defaults + Host header validation for DNS rebinding protection).
- `@modelcontextprotocol/fastify` — Fastify helpers (app defaults + Host header validation).
- `@modelcontextprotocol/hono` — Hono helpers (app defaults + JSON body parsing hook + Host header validation).
- `@modelcontextprotocol/node` — Node.js Streamable HTTP transport wrapper for `IncomingMessage`/`ServerResponse`.

## Typical usage

Most servers use:

- `@modelcontextprotocol/server` for the MCP server implementation
- one middleware package for framework/runtime integration (this folder)
- (optionally) additional platform/framework dependencies (Express, Hono, etc.)

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[SDKs]]
