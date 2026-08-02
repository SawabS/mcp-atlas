---
id: "modelcontextprotocol-python-sdk-src-mcp-types-readme-md-56259a7fed"
title: "MCP Types"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "src/mcp-types/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/src/mcp-types/README.md"
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
  - "[[Registry]]"
  - "[[SDKs]]"
---

# MCP Types

The wire types for the [Model Context Protocol](https://modelcontextprotocol.io).

This package holds the protocol message models, JSON-RPC envelope types, per-version
surface validators, and the protocol-version registry. Its only runtime dependencies are
`pydantic` and `typing-extensions`, so it can be installed on its own when you need to
(de)serialize MCP traffic without pulling in the full `mcp` SDK.

```python
from mcp_types import Tool, CallToolRequest
from mcp_types.version import LATEST_PROTOCOL_VERSION
```

The `mcp` package re-exports these names, so existing `from mcp import Tool` imports
keep working.

## Related concepts

- [[Registry]]
- [[SDKs]]
