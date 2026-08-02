---
id: "modelcontextprotocol-rust-sdk-examples-wasi-readme-md-ac19f262bd"
title: "Example for WASI-p2"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/rust-sdk"
source_path: "examples/wasi/README.md"
source_url: "https://github.com/modelcontextprotocol/rust-sdk/blob/830e088d733c7964c806a2305760dd8deb30dff9/examples/wasi/README.md"
commit: "830e088d733c7964c806a2305760dd8deb30dff9"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/rust"
concepts:
  - "[[Testing]]"
  - "[[Transports]]"
---

# Example for WASI-p2

Build:

```sh
cargo build -p wasi-mcp-example --target wasm32-wasip2
```

Run:

```
npx @modelcontextprotocol/inspector wasmtime target/wasm32-wasip2/debug/wasi_mcp_example.wasm
```

*Note:* Change `wasmtime` to a different installed run time, if needed.

The printed URL of the MCP inspector can be opened and a connection to the module established via `STDIO`.

## Related concepts

- [[Testing]]
- [[Transports]]
