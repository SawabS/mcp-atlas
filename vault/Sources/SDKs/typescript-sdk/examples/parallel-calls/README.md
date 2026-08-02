---
id: "modelcontextprotocol-typescript-sdk-examples-parallel-calls-readme-md-ece88dfde4"
title: "parallel-calls"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "examples/parallel-calls/README.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/examples/parallel-calls/README.md"
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
---

# parallel-calls

Multiple clients connecting to one endpoint in parallel, and one client making parallel `callTool()` calls — with per-call logging notifications attributed back to their caller.

Over HTTP every client connects to the one running endpoint; over stdio each client spawns its own server process (so the "one client / parallel calls" leg is the per-call attribution test on either transport).

## Related concepts

- [[Architecture]]
- [[Transports]]
