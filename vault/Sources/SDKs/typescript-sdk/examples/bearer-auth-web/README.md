---
id: "modelcontextprotocol-typescript-sdk-examples-bearer-auth-web-readme-md-9c493c66a9"
title: "bearer-auth-web"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/bearer-auth-web/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/bearer-auth-web/README.md"
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
---

# bearer-auth-web

The web-standard twin of [`bearer-auth`](../bearer-auth/): the same minimal
Resource-Server-only story built entirely from `@modelcontextprotocol/server`
exports, with no framework.

Host and origin validation plus `requireBearerAuth` gate `createMcpHandler`,
composed as one `fetch(request)` handler. On Cloudflare Workers, Deno, or Bun
that handler is the whole server; `toNodeHandler` bridges it onto `node:http`
so the story runs in this repo's example matrix.

No Authorization Server and no discovery documents here, matching the sibling
— see [`oauth`](../oauth/) for the full RS + AS dance.

```sh
pnpm --filter @mcp-examples/bearer-auth-web server -- --http --port 3000
pnpm --filter @mcp-examples/bearer-auth-web client -- --http http://127.0.0.1:3000/mcp
```

## Related concepts

- [[Architecture]]
- [[Authorization]]
