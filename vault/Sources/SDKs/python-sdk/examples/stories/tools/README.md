---
id: "modelcontextprotocol-python-sdk-examples-stories-tools-readme-md-7fd1a6d072"
title: "tools"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/stories/tools/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/stories/tools/README.md"
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

# tools

**Start here.** Register tools with `@mcp.tool()`; the SDK infers the JSON
input schema from type hints, the output schema from the return annotation, and
returns `structuredContent` alongside text. `ToolAnnotations` carries
behavioural hints (`readOnlyHint`, `idempotentHint`) the host can show to
users. The client lists tools, inspects schemas + annotations, calls both, and
asserts structured output.

## Run it

```bash
# stdio (default — the client spawns the server as a subprocess)
uv run python -m stories.tools.client

# HTTP — the client self-hosts the server on a free port, runs, then tears it down
uv run python -m stories.tools.client --http
# same, against the lowlevel-API server variant
uv run python -m stories.tools.client --http --server server_lowlevel
```

## What to look at

- `server.py` `calc` — `Literal[...]` and `BaseModel` in the signature become
  the tool's `inputSchema` / `outputSchema` with zero hand-written JSON.
- `server.py` `echo` — `structured_output=False` opts out of schema inference
  for a plain text-only tool.
- `server_lowlevel.py` — the same wire contract built by hand: this is what
  `MCPServer` generates for you.

## Spec

[Tools — server features](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)

## See also

`schema_validators/` (every input-schema source: pydantic / TypedDict /
dataclass / dict), `error_handling/` (`is_error` vs protocol error),
`streaming/` (progress mid-call).

## Related concepts

- [[Architecture]]
- [[SDKs]]
