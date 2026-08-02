---
id: "modelcontextprotocol-modelcontextprotocol-docs-community-working-groups-triggers-event-0975f899e7"
title: "Triggers and Events Charter"
document_type: "official-documentation"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/community/working-groups/triggers-events.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/community/working-groups/triggers-events.mdx"
commit: "73763114e511106fc07543f6096b3a814b1a3583"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-core"
  - "mcp/category/core-documentation"
concepts:
  - "[[Transports]]"
  - "[[Architecture]]"
  - "[[SDKs]]"
  - "[[Lifecycle]]"
  - "[[Capabilities]]"
  - "[[Testing]]"
  - "[[Tools]]"
---

## Group Type

**Working Group**

## Mission Statement

The Triggers and Events Working Group exists to define how MCP servers proactively notify clients of state changes. Today, clients learn about server-side updates by polling or holding an SSE connection open. This WG will specify a standardized callback mechanism—webhooks or similar—that lets servers push notifications when new data is available, with defined ordering guarantees that hold across all transports.

## Scope

### In Scope

- **Specification Work**: SEPs defining the trigger/callback mechanism, subscription lifecycle, delivery semantics, and event ordering guarantees.
- **Reference Implementations**: SDK components demonstrating server-initiated notifications and client-side callback handling.
- **Cross-Cutting Concerns**: Coordination with the Transports WG on transport-specific delivery behavior, and with the Agents WG where task completion notifications intersect with event triggers.
- **Documentation**: Specification sections covering event-driven patterns and migration guidance from polling-based approaches.

### Out of Scope

- Changes to the transport wire format or session model (owned by the Transports WG).
- General-purpose pub/sub infrastructure beyond what the MCP protocol requires.
- Modifications to existing notification primitives (`notifications/resources/updated`, `notifications/tools/list_changed`, etc.) that do not relate to proactive server-initiated delivery.

### Related Groups

- **Transports WG** — delivery and ordering guarantees depend on transport capabilities; callback semantics must be coherent across stdio, Streamable HTTP, and future transports.
- **Agents WG** — [SEP-1686 (Tasks)](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1686) identifies webhook-style task completion notifications as a future consideration; this WG owns that mechanism.

## Leadership

| Role | Name            | Organization        | GitHub                                           | Term    |
| ---- | --------------- | ------------------- | ------------------------------------------------ | ------- |
| Lead | Clare Liguori   | Amazon Web Services | [@clareliguori](https://github.com/clareliguori) | Initial |
| Lead | Peter Alexander | Anthropic           | [@pja-ant](https://github.com/pja-ant)           | Initial |

## Authority & Decision Rights

| Decision Type                       | Authority Level                                        |
| ----------------------------------- | ------------------------------------------------------ |
| Meeting logistics & scheduling      | WG Leads (autonomous)                                  |
| Proposal prioritization within WG   | WG Leads (autonomous)                                  |
| SEP triage & closure (in scope)     | WG Leads (autonomous, with documented rationale)       |
| Technical design within scope       | WG consensus                                           |
| Spec changes (additive)             | WG consensus → Core Maintainer approval                |
| Spec changes (breaking/fundamental) | WG consensus → Core Maintainer approval + wider review |
| Scope expansion                     | Core Maintainer approval required                      |
| WG Member approval                  | WG Member sponsors                                     |

## Operations

| Meeting         | Frequency | Duration | Purpose                               |
| --------------- | --------- | -------- | ------------------------------------- |
| Working Session | Weekly    | 30 min   | Technical discussion, proposal review |

## Resources

- Incubation repository: [modelcontextprotocol/experimental-ext-triggers-events](https://github.com/modelcontextprotocol/experimental-ext-triggers-events)

## Deliverables & Success Metrics

### Active Work Items

| Item                                    | Status   | Target Date | Champion |
| --------------------------------------- | -------- | ----------- | -------- |
| SEP: Events in MCP v1 RFC               | Ideating | End April   | TBD      |
| Reference implementation in Tier-1 SDKs | —        | End April   | TBD      |

### Success Criteria

- An accepted SEP defining the trigger/callback mechanism and its subscription lifecycle.
- Reference implementations in at least two Tier-1 SDKs.
- Conformance test coverage for the new primitives.

## Changelog

| Date       | Change          |
| ---------- | --------------- |
| 2026-03-24 | Initial charter |

## Related concepts

- [[Transports]]
- [[Architecture]]
- [[SDKs]]
- [[Lifecycle]]
- [[Capabilities]]
- [[Testing]]
- [[Tools]]
