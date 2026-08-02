---
id: "modelcontextprotocol-typescript-sdk-examples-bearer-auth-readme-md-8321eec585"
title: "bearer-auth"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/bearer-auth/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/bearer-auth/README.md"
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
  - "[[Authorization]]"
  - "[[Security]]"
---

# bearer-auth

Resource-server-only auth: `requireBearerAuth` from `@modelcontextprotocol/express` in front of `createMcpHandler`. The client asserts `401` + `WWW-Authenticate` without a token, and that the verified `authInfo` reaches the factory (`ctx.authInfo`) with
one.

**HTTP-only** by definition. The full interactive OAuth set lives under `../oauth/` (run headlessly in CI via the demo AS's auto-consent mode).

## Related concepts

- [[Architecture]]
- [[Authorization]]
- [[Security]]
