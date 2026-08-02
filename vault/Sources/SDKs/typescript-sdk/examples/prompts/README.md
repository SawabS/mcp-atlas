---
id: "modelcontextprotocol-typescript-sdk-examples-prompts-readme-md-be8580c043"
title: "prompts"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/prompts/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/prompts/README.md"
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

# prompts

Register prompts with `McpServer.registerPrompt`; wrap argument schemas with `completable(...)` for autocompletion. The client lists prompts, completes the `language` argument, and renders one with `getPrompt()`.

```bash
pnpm tsx examples/prompts/client.ts
```

## Related concepts

- [[Architecture]]
