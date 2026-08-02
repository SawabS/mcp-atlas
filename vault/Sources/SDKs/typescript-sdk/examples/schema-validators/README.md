---
id: "modelcontextprotocol-typescript-sdk-examples-schema-validators-readme-md-ef081aa34b"
title: "schema-validators"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/schema-validators/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/schema-validators/README.md"
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
---

# schema-validators

Tool input/output schemas via Zod, ArkType and Valibot — any Standard-Schema-with-JSON library works. Also shows `outputSchema` → `structuredContent`, including an array-root `outputSchema` (SEP-2106) with the auto-injected `TextContent` fallback and the client-side `unknown` runtime-narrowing pattern.

```bash
pnpm tsx examples/schema-validators/client.ts
```

## Related concepts

- [[Architecture]]
