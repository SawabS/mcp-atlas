---
id: "modelcontextprotocol-typescript-sdk-examples-mrtr-readme-md-b9593f92c1"
title: "mrtr (multi-round-trip requests)"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/mrtr/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/mrtr/README.md"
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
  - "[[Elicitation]]"
---

# mrtr (multi-round-trip requests)

A write-once `deploy` tool that requests client input by **returning** `inputRequired(...)` instead of pushing a server→client request (protocol revision 2026-07-28). State between rounds is carried in `requestState`, which the example HMAC-protects and verifies via the
`ServerOptions.requestState.verify` hook (a wire-level `-32602` on tamper).

The client drives both the default auto-fulfilment mode (your existing `elicitation/create` handler is dispatched for you and `callTool()` returns a plain `CallToolResult`) and manual mode (`autoFulfill: false` + `allowInputRequired: true`).

```bash
pnpm tsx examples/mrtr/client.ts
```

## Related concepts

- [[Architecture]]
- [[Elicitation]]
