---
id: "modelcontextprotocol-python-sdk-schema-readme-md-d02aab7e61"
title: "Vendored protocol schemas"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "schema/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/schema/README.md"
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
  - "[[SDKs]]"
---

# Vendored protocol schemas

JSON Schema files for each protocol version the SDK has a wire-shape surface
package for, vendored from the [spec repository] at the commit recorded in
`PINNED.json`. `scripts/gen_surface_types.py` reads these to regenerate
`src/mcp-types/mcp_types/_v<version>/__init__.py` (underscore-private: internal
validators, not public API); CI runs the generator with `--check`.

To bump: drop the new `schema.json` here as `<protocol-version>.json`, update
the matching entry in `PINNED.json` (commit + sha256), and run
`uv run --frozen --group codegen python scripts/gen_surface_types.py`.

[spec repository]: https://github.com/modelcontextprotocol/modelcontextprotocol

## Related concepts

- [[SDKs]]
