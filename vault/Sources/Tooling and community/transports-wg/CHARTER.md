---
id: "modelcontextprotocol-transports-wg-charter-md-b5d3b384b2"
title: "Transports Working Group Charter"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/transports-wg"
source_path: "CHARTER.md"
source_url: "https://github.com/modelcontextprotocol/transports-wg/blob/6d9b43bd5fd58c1c4dda0a1c1bc778aa28133121/CHARTER.md"
commit: "6d9b43bd5fd58c1c4dda0a1c1bc778aa28133121"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
  - "[[Transports]]"
  - "[[Security]]"
  - "[[Lifecycle]]"
  - "[[Testing]]"
---

# Transports Working Group Charter

This document outlines the mission, scope, and strategic direction of the MCP Transports Working Group.

## Mission

The Transports Working Group brings together community participants to:

- **Improve transport usability** by addressing real-world challenges in MCP implementations
- **Define scalability patterns** for connection management, load distribution, and resource efficiency
- **Establish reliability standards** for error handling, reconnection, and delivery guarantees
- **Clarify transport semantics** for consistent protocol behavior across implementations

## Scope

### Included

- Transport protocol specifications and improvements
- Scalability patterns (connection pooling, multiplexing, load balancing)
- Reliability mechanisms (error handling, reconnection, message delivery)
- Transport semantics (ordering, state management, lifecycle)
- Reference implementations for testing and validation
- Documentation and guidance materials

### Excluded

- Application-layer protocol features (tools, resources, prompts)
- Domain-specific extensions (financial services, healthcare, etc.)
- Competitively sensitive information
- Non-technical business matters

The group adheres to the [MCP Antitrust Policy](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/ANTITRUST.md); all participants must follow antitrust compliance guidelines.

## Proposals vs. Core Specification

### Proposals

Transport proposals developed within this working group address specific transport challenges while enabling:

- Rapid iteration and experimentation
- Community feedback gathering
- Production validation before standardization

### Promotion Pathway

Broadly applicable proposals may advance to the core MCP specification through:

1. **SEP (Spec Enhancement Proposal)** documenting the proposal and implementation evidence
2. **Core Maintainer Sponsorship** from MCP leadership
3. **Community Consensus** via the SEP review process

### Proactive Advancement

The Working Group identifies promising proposals and actively pursues promotion by:

- Providing real-world validation from production environments
- Building coalition support among contributors
- Coordinating with core maintainers for SEP sponsorship

## Amendments

Charter changes require:

1. Proposal through GitHub
2. Discussion and community input
3. Maintainer consensus approval
4. Clear documentation of rationale

## Contact

Questions about this charter can be directed to:

- The `#transports-wg` Discord channel
- GitHub Issues in this repository
- Maintainers listed in [GOVERNANCE.md](./GOVERNANCE.md)

## Related concepts

- [[Transports]]
- [[Security]]
- [[Lifecycle]]
- [[Testing]]
