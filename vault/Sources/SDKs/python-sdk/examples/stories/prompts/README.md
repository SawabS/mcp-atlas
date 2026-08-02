---
id: "modelcontextprotocol-python-sdk-examples-stories-prompts-readme-md-435f56cc1e"
title: "prompts"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/stories/prompts/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/stories/prompts/README.md"
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
  - "[[Prompts]]"
  - "[[Transports]]"
---

# prompts

Expose prompt templates with `@mcp.prompt()` and let clients autocomplete their
arguments with `@mcp.completion()`. `MCPServer` derives each prompt's
`arguments` (name + required) from the function signature. The client lists
prompts, completes the `language` argument of `code_review`, then renders both
prompts.

## Run it

```bash
# stdio (default — the client spawns the server as a subprocess)
uv run python -m stories.prompts.client

# HTTP — the client self-hosts the server on a free port, runs, then tears it down
uv run python -m stories.prompts.client --http
# same, against the lowlevel-API server variant
uv run python -m stories.prompts.client --http --server server_lowlevel
```

## What to look at

- `client.py` `main` — the body opens with `async with Client(target,
  mode=mode) as client:`; `target` is anything `Client(...)` accepts (an
  in-process server, a `Transport`, or an HTTP URL).
- `server.py` `greet` vs `code_review` — return a bare `str` (wrapped as one
  user message) or a `list[Message]` for a multi-turn seed conversation.
- `server.py` `complete()` — one global handler dispatches on `ref` +
  `argument.name`; returning `None` becomes an empty completion. There is no
  per-argument `completer=` sugar yet.
- `server_lowlevel.py` — the same `Prompt` / `PromptArgument` descriptors and
  `GetPromptResult` built by hand; this is what `MCPServer` generates for you.
- `client.py` `complete(...)` — `argument` is a `{"name": ..., "value": ...}`
  dict, the only `Client` request method that takes a raw dict for a typed
  wire field.

## Caveats

`@mcp.prompt()` and `@mcp.completion()` need the parentheses — `@mcp.prompt`
without `()` raises a confusing `TypeError` at registration time.

## Spec

[Prompts](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts)
· [Completion](https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/completion)

## See also

`tools/` (start here), `resources/` (the other `ref` kind completion accepts),
`pagination/` (`list_prompts` cursor loop).

## Related concepts

- [[Architecture]]
- [[Prompts]]
- [[Transports]]
