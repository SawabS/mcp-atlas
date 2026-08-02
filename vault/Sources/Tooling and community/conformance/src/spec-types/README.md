---
id: "modelcontextprotocol-conformance-src-spec-types-readme-md-5376e546a9"
title: "spec-types"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/conformance"
source_path: "src/spec-types/README.md"
source_url: "https://github.com/modelcontextprotocol/conformance/blob/81eb1c3edaed87d7fd585d7b80186da7a2960660/src/spec-types/README.md"
commit: "81eb1c3edaed87d7fd585d7b80186da7a2960660"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
  - "[[SDKs]]"
  - "[[Lifecycle]]"
  - "[[Testing]]"
---

# spec-types

Vendored copies of `schema/{version}/schema.ts` and
`schema/{version}/schema.json` from the
[modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol)
spec repository.

The `.ts` files are the canonical TypeScript types for each protocol version.
The conformance suite imports types from here rather than from
`@modelcontextprotocol/sdk` so that it can test draft spec versions before any
SDK has implemented them.

The `.schema.json` files are the matching JSON Schemas; `src/validation`
compiles them (per version) to validate every JSON-RPC message the harness
sends or receives at runtime.

**Do not edit these files by hand.** To refresh:

```sh
npm run sync-schema -- <sha-or-ref>
```

The `SOURCE` file records the spec commit the current copies came from.

## Import rule

A scenario imports the schema matching its `source.introducedIn`:

```ts
import type { ListToolsResult } from '../../spec-types/2025-06-18';
```

`Connection` implementations import the version whose lifecycle they implement
(stateful → `2025-11-25`, stateless → `draft`).

## Related concepts

- [[SDKs]]
- [[Lifecycle]]
- [[Testing]]
