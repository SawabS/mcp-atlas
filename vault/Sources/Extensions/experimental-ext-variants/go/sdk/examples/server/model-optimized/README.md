---
id: "modelcontextprotocol-experimental-ext-variants-go-sdk-examples-server-model-optimized-bdd972d0c3"
title: "Model-Optimized Weather Service"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/experimental-ext-variants"
source_path: "go/sdk/examples/server/model-optimized/README.md"
source_url: "https://github.com/modelcontextprotocol/experimental-ext-variants/blob/cfc05d6f5eb8829f9896d44a6d47360bd15c3b5c/go/sdk/examples/server/model-optimized/README.md"
commit: "cfc05d6f5eb8829f9896d44a6d47360bd15c3b5c"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "Apache-2.0"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/extensions"
concepts:
  - "[[Architecture]]"
  - "[[Lifecycle]]"
---

# Model-Optimized Weather Service

A variant-aware MCP server that exposes the same tools (`get_weather`, `get_forecast`) with different descriptions optimized for different LLM families. This is the primary use case described in SEP-2053.

**Pattern demonstrated:** Same tools, different descriptions per variant.

## Variants

| Variant | Description Style | Target |
|---|---|---|
| `claude-optimized` | Verbose, structured with explicit usage guidance | Anthropic Claude models |
| `gpt-optimized` | Concise, function-style with JSON Schema emphasis | OpenAI GPT models |
| `compact` | Minimal, bare-minimum descriptions | Context-constrained environments |

All three variants expose the same two tools with the same behavior — only the tool descriptions differ.

## Custom Ranking

Clients send a `"modelFamily"` hint (e.g., `"anthropic"`, `"openai"`). The ranking function matches the hint to the variant's `modelFamily`, falling back to priority order.

## Run

```bash
go run ./examples/server/model-optimized
```
The server listens on `http://localhost:8080`.

Connect any MCP client to `http://localhost:8080`.

## Try It

### 1. Initialize without hints (default ranking)

```bash
curl -s -X POST http://localhost:8080/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0", "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "clientInfo": {"name": "test", "version": "1.0"},
      "capabilities": {}
    }
  }'
```

The first variant in the response is the **default** — clients that don't specify a variant in subsequent requests will use it. Without hints, `claude-optimized` is the default:

```json
{
  "availableVariants": [
    {
      "id": "claude-optimized",
      "hints": { "contextSize": "verbose", "modelFamily": "anthropic" },
      "status": "stable"
    },
    {
      "id": "gpt-optimized",
      "hints": { "contextSize": "standard", "modelFamily": "openai" },
      "status": "stable"
    },
    {
      "id": "compact",
      "hints": { "contextSize": "compact", "modelFamily": "any" },
      "status": "stable"
    }
  ]
}
```

### 2. Initialize with an OpenAI hint (ranking changes)

```bash
curl -s -X POST http://localhost:8080/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0", "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "clientInfo": {"name": "test", "version": "1.0"},
      "capabilities": {
        "experimental": {
          "io.modelcontextprotocol/server-variants": {
            "variantHints": {
              "hints": {"modelFamily": "openai"}
            }
          }
        }
      }
    }
  }'
```

Now `gpt-optimized` is ranked first and becomes the default:

```json
{
  "availableVariants": [
    {
      "id": "gpt-optimized",
      "hints": { "contextSize": "standard", "modelFamily": "openai" },
      "status": "stable"
    },
    {
      "id": "claude-optimized",
      "hints": { "contextSize": "verbose", "modelFamily": "anthropic" },
      "status": "stable"
    },
    {
      "id": "compact",
      "hints": { "contextSize": "compact", "modelFamily": "any" },
      "status": "stable"
    }
  ]
}
```

## Related concepts

- [[Architecture]]
- [[Lifecycle]]
