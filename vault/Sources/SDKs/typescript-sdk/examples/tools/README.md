---
id: "modelcontextprotocol-typescript-sdk-examples-tools-readme-md-203cf44f30"
title: "tools"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/tools/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/tools/README.md"
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
  - "[[SDKs]]"
---

# tools

**Start here.** Register tools with `McpServer.registerTool`; the SDK infers the JSON Schema from any Standard-Schema-compatible input (Zod here) and emits `structuredContent` matching `outputSchema`. The client lists tools, inspects schemas and `annotations`, calls them, and
asserts structured output.

```bash
pnpm tsx examples/tools/client.ts
```

## Related concepts

- [[Architecture]]
- [[SDKs]]
