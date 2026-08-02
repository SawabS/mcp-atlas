---
id: "modelcontextprotocol-typescript-sdk-examples-stickynotes-readme-md-5163c7c94f"
title: "stickynotes"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/stickynotes/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/stickynotes/README.md"
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
  - "[[Transports]]"
---

# stickynotes

The "real app" capstone: a sticky-notes board where tools mutate state, each note is a resource, the resource list changes on add/remove, and a destructive `remove_all` blocks on a form-mode elicitation. The client adds, lists, reads, removes, and proves `remove_all` only clears
the board on an explicit confirm.

Runs all four transport/era legs. The `remove_all` confirmation is a push server→client elicitation (2025-era only — there is no server→client request channel on 2026-07-28; the equivalent is multi-round-trip `inputRequired`, see `../elicitation/`). The cancel / unchecked /
confirm flow is exercised on **stdio/legacy only** — `server.ts` hosts HTTP via a plain stateless `createMcpHandler`, whose per-request legacy fallback has no return path for the client's elicitation response — so the modern and http legs exercise add / list / read / remove and
skip `remove_all`.

## Related concepts

- [[Architecture]]
- [[Elicitation]]
- [[Transports]]
