---
id: "modelcontextprotocol-python-sdk-examples-readme-md-eeba577867"
title: "Python SDK examples"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/README.md"
commit: "a4f4ccd091138771535e17191123f20b30fda68e"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/python"
concepts:
  - "[[Architecture]]"
  - "[[Authorization]]"
  - "[[SDKs]]"
  - "[[Testing]]"
  - "[[Capabilities]]"
  - "[[Reference Servers]]"
---

# Python SDK examples

- [`stories/`](stories/) — **the canonical reference.** One self-verifying
  example per protocol feature, each with its own README. Start with
  [`stories/tools/`](stories/tools/); the [stories README](stories/README.md)
  has the full table and how to run them.
- [`snippets/`](snippets/) — short extracts that were embedded into the v1
  README (now on the `v1.x` branch); superseded by `docs_src/`, which the docs
  and README embed today. Retained pending consolidation into `stories/`.
- [`servers/everything-server/`](servers/everything-server/) — the conformance
  target for the cross-SDK
  [conformance suite](https://github.com/modelcontextprotocol/conformance).
  Exercises every server capability in one process.
- [`mcpserver/`](mcpserver/) — single-file v1-era examples retained for the
  migration guide; superseded by `stories/` and slated for removal.
- [`clients/`](clients/) and the remaining [`servers/`](servers/) directories
  (`simple-*`, `sse-polling-demo`, `structured-output-lowlevel`) — standalone
  v1-era projects retained pending consolidation into `stories/` (the
  `simple-auth` pair is still linked from `docs/run/authorization.md` and `docs/client/oauth-clients.md`).

For real-world servers see the
[servers repository](https://github.com/modelcontextprotocol/servers).

## Related concepts

- [[Architecture]]
- [[Authorization]]
- [[SDKs]]
- [[Testing]]
- [[Capabilities]]
- [[Reference Servers]]
