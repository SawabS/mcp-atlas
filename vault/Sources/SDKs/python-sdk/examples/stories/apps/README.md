---
id: "modelcontextprotocol-python-sdk-examples-stories-apps-readme-md-3e915899e9"
title: "apps"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/stories/apps/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/stories/apps/README.md"
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
  - "[[Capabilities]]"
  - "[[Resources]]"
---

# apps

MCP Apps: a tool carries a `_meta.ui.resourceUri` reference to a `ui://`
resource that the host renders as an interactive surface. The server opts in via
the `Apps` extension (`io.modelcontextprotocol/ui`); the client negotiates it by
advertising the `text/html;profile=mcp-app` MIME type.

## Run it

```bash
# stdio (default — the client spawns the server as a subprocess)
uv run python -m stories.apps.client

# HTTP — the client self-hosts the server on a free port, runs, then tears it down
uv run python -m stories.apps.client --http
```

## What to look at

- `server.py` `MCPServer("apps-example", extensions=[apps])` — the extension
  advertises `io.modelcontextprotocol/ui` under `ServerCapabilities.extensions`
  and contributes the UI-bound tool and its `ui://` resource. `MCPServer` itself
  never learns about "ui"; it applies a closed set of contributions.
- `server.py` `@apps.tool(resource_uri=...)` — stamps `_meta.ui.resourceUri` on
  the tool; `add_html_resource` registers the matching `ui://` resource at
  `text/html;profile=mcp-app`.
- `server.py` `client_supports_apps(ctx)` — SEP-2133 graceful degradation: a
  client that did not negotiate Apps gets a text-only result.
- `client.py` `Client(target, extensions=[advertise(...)])` — the client advertises Apps
  support so the server returns the UI-enabled result, then reads the tool's
  `_meta.ui.resourceUri` and fetches that resource.

## Spec

[MCP Apps — extensions](https://modelcontextprotocol.io/specification/draft/extensions/apps)
· [SEP-2133 — extensions capability](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2133)

## See also

`custom_methods/` (registering a non-spec method without an extension).

## Related concepts

- [[Architecture]]
- [[Capabilities]]
- [[Resources]]
