---
id: "modelcontextprotocol-typescript-sdk-examples-repl-readme-md-5edae1e39d"
title: "repl (excluded)"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/repl/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/repl/README.md"
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
  - "[[Resources]]"
---

# repl (excluded)

The interactive playground. A fully-featured **sessionful** HTTP server (tools with input/output schemas + annotations, prompts with completion, direct + templated resources, `notifications/message` logging, `resources/list_changed`, in-memory `eventStore` for resumability)
paired with a readline REPL client that can drive every primitive by hand — `list-tools`, `call-tool`, `list-prompts`, `get-prompt`, `list-resources`, `read-resource`, form elicitation, resumable notification streams (`reconnect`, `run-notifications-tool-with-resumability`).

Excluded from the runner (`package.json#example.excluded`); run manually:

```sh
pnpm run server          # terminal 1 — listens on http://localhost:3000/mcp
pnpm run client          # terminal 2 — readline REPL
```

Try `multi-greet Ada`, `collect-info contact`, `call-tool add-resource {"name":"n1","text":"hello"}` then `list-resources`, or `start-notifications 500 5`.

## Related concepts

- [[Architecture]]
- [[Elicitation]]
- [[Resources]]
