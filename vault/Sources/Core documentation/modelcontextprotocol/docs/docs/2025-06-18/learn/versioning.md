---
id: "modelcontextprotocol-modelcontextprotocol-docs-docs-2025-06-18-learn-versioning-mdx-0a5e44018b"
title: "Versioning"
document_type: "official-documentation"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/docs/2025-06-18/learn/versioning.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/docs/2025-06-18/learn/versioning.mdx"
commit: "73763114e511106fc07543f6096b3a814b1a3583"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-core"
  - "mcp/category/core-documentation"
concepts:
  - "[[Architecture]]"
  - "[[Capabilities]]"
  - "[[Lifecycle]]"
---

The Model Context Protocol uses string-based version identifiers following the format
`YYYY-MM-DD`, to indicate the last date backwards incompatible changes were made.


The protocol version will _not_ be incremented when the
protocol is updated, as long as the changes maintain backwards compatibility. This allows
for incremental improvements while preserving interoperability.


## Revisions

Revisions may be marked as:

- **Draft**: in-progress specifications, not yet ready for consumption.
- **Current**: the current protocol version, which is ready for use and may continue to
  receive backwards compatible changes.
- **Final**: past, complete specifications that will not be changed.

The **current** protocol version is [**2025-11-25**](/specification/2025-11-25/).

## Feature States

Individual features of the specification may additionally be marked as
**Deprecated** under the
[feature lifecycle and deprecation policy](/community/feature-lifecycle):
the feature remains part of the specification, but is scheduled for removal.
Deprecated features document a migration path (or state that none is required)
and remain in the specification for at least twelve months, or at least
ninety days under the policy's
[expedited-removal exception](/community/feature-lifecycle#expedited-removal),
before they become eligible for removal, after which they may be **Removed**
in a future revision.

## Negotiation

Version negotiation happens during
[initialization](/specification/2025-06-18/basic/lifecycle#initialization). Clients and
servers **MAY** support multiple protocol versions simultaneously, but they **MUST**
agree on a single version to use for the session.

The protocol provides appropriate error handling if version negotiation fails, allowing
clients to gracefully terminate connections when they cannot find a version compatible
with the server.

## Related concepts

- [[Architecture]]
- [[Capabilities]]
- [[Lifecycle]]
