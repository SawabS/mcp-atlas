---
id: "modelcontextprotocol-quickstart-resources-weather-server-go-readme-md-bbc4716cb4"
title: "A Simple MCP Weather Server written in Go"
document_type: "official-documentation"
content_class: "source"
authority: "official-server"
repository: "modelcontextprotocol/quickstart-resources"
source_path: "weather-server-go/README.md"
source_url: "https://github.com/modelcontextprotocol/quickstart-resources/blob/7b7f81e4c8f33860397fc87ec3e57cf6f5fa76e0/weather-server-go/README.md"
commit: "7b7f81e4c8f33860397fc87ec3e57cf6f5fa76e0"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-server"
  - "mcp/category/reference-servers"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
---

# A Simple MCP Weather Server written in Go

See the [Build an MCP server](https://modelcontextprotocol.io/docs/develop/build-server) tutorial for more information.

## Building

```bash
go build -o weather
```

## Running

```bash
./weather
```

The server will communicate via stdio and expose two MCP tools:
- `get_forecast` - Get weather forecast for a location (requires latitude and longitude)
- `get_alerts` - Get weather alerts for a US state (requires two-letter state code)

## Related concepts

- [[Architecture]]
- [[Transports]]
