---
id: "modelcontextprotocol-modelcontextprotocol-plugins-mcp-spec-readme-md-bd3706a0d3"
title: "MCP Spec Plugin for Claude"
document_type: "official-documentation"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "plugins/mcp-spec/README.md"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/plugins/mcp-spec/README.md"
commit: "73763114e511106fc07543f6096b3a814b1a3583"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-core"
  - "mcp/category/core-documentation"
concepts:
  - "[[Security]]"
---

# MCP Spec Plugin for Claude

Skills for researching and contributing to the Model Context Protocol specification.

## Installation

### Claude Code

```bash
/plugin marketplace add modelcontextprotocol/modelcontextprotocol
```

### Claude Cowork

Navigate to Customize >> Browse Plugins >> Personal >> Plus Button >> Add marketplace from GitHub and add `modelcontextprotocol/modelcontextprotocol`

## Available Skills

### `/search-mcp-github <topic>`

Search across MCP GitHub discussions, issues, and pull requests to find relevant information about a topic.

**Sources searched:**

- [Org-level Discussions](https://github.com/orgs/modelcontextprotocol/discussions)
- [Spec-level Discussions](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions)
- [Spec-level Issues](https://github.com/modelcontextprotocol/modelcontextprotocol/issues)
- [Spec-level Pull Requests](https://github.com/modelcontextprotocol/modelcontextprotocol/pulls)

**Example:**

```
/search-mcp-github Tool Annotations
```

**Note:** The skill searches both open AND closed issues/PRs, which is important for understanding past decisions and historical context.

### `/draft-sep <idea>`

Research and draft a Specification Enhancement Proposal that conforms to the [SEP governance process](https://modelcontextprotocol.io/community/sep-guidelines). Gates on whether the idea is SEP-worthy, interviews the author, checks existing spec coverage and prior art, then fills the template's required and optional sections and writes `seps/0000-{slug}.md`. Optionally opens a draft PR, backfills the SEP number, and runs `npm run generate:seps` and `npm run format:docs` so CI stays green.

**Prerequisite:** Run from a local clone of this repository or your fork of it (the skill reads `seps/TEMPLATE.md` and writes into `seps/`).

**Example:**

```
/draft-sep add websocket transport
```

**Note:** The skill will ask clarifying questions (SEP type, breaking-change status, prototype, prior discussion, sponsor, security) before writing anything. The SEP guidelines advise discussing an idea in Discord or a Working Group before drafting — the skill will flag if that hasn't happened.

## Related concepts

- [[Security]]
