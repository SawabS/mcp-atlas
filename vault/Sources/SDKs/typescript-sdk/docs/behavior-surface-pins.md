---
id: "modelcontextprotocol-typescript-sdk-docs-behavior-surface-pins-md-81ff1dc0b0"
title: "Behavior-surface pins"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/typescript-sdk"
source_path: "docs/behavior-surface-pins.md"
source_url: "https://github.com/modelcontextprotocol/typescript-sdk/blob/cc4b41617ce3601b1290d67216ea0b194a3cd9ac/docs/behavior-surface-pins.md"
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
  - "[[Transports]]"
  - "[[Architecture]]"
  - "[[Registry]]"
---

# Behavior-surface pins

Some tests in this repo are **pins**: they assert the exact current value of a
wire- or consumer-visible behavior — an error code, a schema boundary, an
export map, the stdio env safelist — rather than checking that a feature
works. Their job is to distinguish a deliberate surface change from an
accidental one: the regular suite stays green through either; a pin goes red
through both.

## When a pin goes red on your change

A red pin does **not** mean the change is forbidden. It means the change is
surface-visible and must be deliberate:

1. Confirm the change is intended. If it isn't, the pin just caught an
   accidental break.
2. Update the pin in the same PR.
3. Add a changeset if the surface is consumer-facing.
4. Update `docs/migration/upgrade-to-v2.md` (or `docs/migration/support-2026-07-28.md` if 2026-only) where consumer-facing.

Never weaken a pin (loosen an exact match, delete an assertion) just to make
CI pass — that reopens the silent-drift hole the pin exists to close.

## Where pins live

| Surface                                                     | File                                                           |
| ----------------------------------------------------------- | -------------------------------------------------------------- |
| Wire error-code tables, error classes, version constants    | `packages/core-internal/test/types/errorSurfacePins.test.ts`   |
| Schema strict/strip/loose boundaries, key existence         | `packages/core-internal/test/types/schemaBoundaryPins.test.ts` |
| Published package set, export maps, dual ESM/CJS topology   | `packages/core-internal/test/packageTopologyPins.test.ts`      |
| stdio environment-inheritance safelist                      | `packages/client/test/client/stdioEnvPins.test.ts`             |
| 2025-11-25 wire method-registry membership, schema identity | `packages/core-internal/test/types/registryPins.test.ts`       |

## Writing a new pin

- The expectation side must be a literal frozen in the test, never a value
  imported from src. Comparing a source constant against itself pins nothing.
- Mutation-check it once before landing: flip the source behavior locally and
  confirm the pin actually goes red. A pin that stays green under the drift it
  claims to guard is worse than no pin.
- Pin behavior a deployed peer or consumer can observe. Internal details that
  are invisible across the wire and the public API don't need pins.
- Don't pin a known bug to make it load-bearing — file an issue instead.

## History

The original, much broader inventory was developed against v1.x in #2258 and
#2262 (closed unmerged). This sweep ports only the boundary surfaces above;
see those PRs for the fuller exploration and the reasoning behind what was
left out.

## Related concepts

- [[Transports]]
- [[Architecture]]
- [[Registry]]
