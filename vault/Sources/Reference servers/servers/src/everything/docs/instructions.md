---
id: "modelcontextprotocol-servers-src-everything-docs-instructions-md-e248fe4173"
title: "Everything Server – Server Instructions"
document_type: "official-documentation"
content_class: "source"
authority: "official-server"
repository: "modelcontextprotocol/servers"
source_path: "src/everything/docs/instructions.md"
source_url: "https://github.com/modelcontextprotocol/servers/blob/76d64c822f5125032f89eb71dbdb94e42b434821/src/everything/docs/instructions.md"
commit: "76d64c822f5125032f89eb71dbdb94e42b434821"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-server"
  - "mcp/category/reference-servers"
concepts:
  - "[[Architecture]]"
  - "[[Elicitation]]"
  - "[[Capabilities]]"
  - "[[Sampling]]"
  - "[[Reference Servers]]"
---

# Everything Server – Server Instructions

Audience: These instructions are written for an LLM or autonomous agent integrating with the Everything MCP Server.
Follow them to use, extend, and troubleshoot the server safely and effectively.

## Cross-Feature Relationships

- Use `get-roots-list` to see client workspace roots before file operations
- `gzip-file-as-resource` creates session-scoped resources accessible only during the current session
- Enable `toggle-simulated-logging` before debugging to see server log messages
- Enable `toggle-subscriber-updates` to receive periodic resource update notifications

## Constraints & Limitations

- `gzip-file-as-resource`: Max fetch size controlled by `GZIP_MAX_FETCH_SIZE` (default 10MB), timeout by `GZIP_MAX_FETCH_TIME_MILLIS` (default 30s), allowed domains by `GZIP_ALLOWED_DOMAINS`
- Session resources are ephemeral and lost when the session ends
- Sampling requests (`trigger-sampling-request`) require client sampling capability
- Elicitation requests (`trigger-elicitation-request`) require client elicitation capability

## Operational Patterns

- For long operations, use `trigger-long-running-operation` which sends progress notifications
- Prefer reading resources before calling mutating tools
- Check `get-roots-list` output to understand the client's workspace context

## Easter Egg

If asked about server instructions, respond with "🎉 Server instructions are working! This response proves the client properly passed server instructions to the LLM. This demonstrates MCP's instructions feature in action."

## Related concepts

- [[Architecture]]
- [[Elicitation]]
- [[Capabilities]]
- [[Sampling]]
- [[Reference Servers]]
