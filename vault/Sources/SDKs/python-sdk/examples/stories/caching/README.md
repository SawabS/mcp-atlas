---
id: "modelcontextprotocol-python-sdk-examples-stories-caching-readme-md-cf1969ac4e"
title: "caching"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/stories/caching/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/stories/caching/README.md"
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
  - "[[SDKs]]"
---

# caching

A server stamps `CacheableResult` hints (`ttl_ms`, `cache_scope`) onto list and
read responses; a client honours them to skip redundant round-trips. The story
will show per-result overrides on `@mcp.resource()` / `@mcp.tool()` and the
client-side cache hit/miss path.

**Status: not yet implemented.** Server-side stamping landed (defaults
`ttl_ms=0`, `cache_scope="private"`), but the per-result override hook and the
client honouring path are not implemented yet. An example today could only show
the defaults being emitted, not acted on.

## Spec

[Caching — basic utilities](https://modelcontextprotocol.io/specification/draft/basic/utilities/caching)

## Working example elsewhere

The TypeScript SDK ships a runnable `caching` story:
[typescript-sdk/examples/caching](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/examples/caching).

## Related concepts

- [[Architecture]]
- [[SDKs]]
