---
id: "modelcontextprotocol-registry-docs-reference-api-extensions-md-c40a610ebc"
title: "Registry Extensions Specification"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/registry"
source_path: "docs/reference/api/extensions.md"
source_url: "https://github.com/modelcontextprotocol/registry/blob/0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2/docs/reference/api/extensions.md"
commit: "0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/registry"
concepts:
  - "[[Architecture]]"
  - "[[Registry]]"
  - "[[Authorization]]"
  - "[[Capabilities]]"
---

# Registry Extensions Specification

A standardized way for registries to provide experimental or community-driven features without committing them to the core API specification.

## Motivation

[The core generic registry API](./generic-registry-api.md) intentionally stays minimal to ensure stability and broad adoption. Extensions provide a path for:

- **Experimentation**: Try new features without core API changes
- **Community innovation**: Anyone can implement custom extensions
- **Gradual adoption**: Popular extensions may inform future core API features
- **Avoiding breaking changes**: Failed experiments can be deprecated without API versioning churn

## URL Structure

Extensions live under the `/v0.1/x/` prefix:

```
/v0.1/x/<namespace>/<extension>[/<path>]
```

**Components:**
- `<namespace>`: Reverse domain ownership (e.g., `com.example`, `io.github.username`)
- `<extension>`: Extension name (lowercase, hyphens for word separation)
- `<path>`: Extension-specific path structure (optional)

**Examples:**
```
/v0.1/x/com.example/search?q=database
/v0.1/x/com.example/stats
/v0.1/x/io.github.username/custom-feature
```

## Conventions

Where possible:
- Follow standard REST conventions, return simple JSON responses, and avoid special headers
- For list endpoints, use cursor-based pagination matching the core API
- Extensions requiring authentication **SHOULD** follow the [Registry Authorization Specification](./registry-authorization.md)
- Build open-source implementations in a composable way on top of the core APIs (e.g. as opposed to via custom database integration)

## Implementation Requirements

Registries implementing extensions **SHOULD** namespace extensions properly to avoid conflicts.

Clients consuming extensions **MUST** gracefully handle missing extensions.

## Example

A simple server stats extension:

```bash
GET /v0.1/x/com.example/stats
```

```json
{
  "totalServers": 1234,
  "totalVersions": 5678,
  "recentPublishes": 42
}
```

## Future Considerations

- **Extension discovery**: A potential `/v0.1/x` endpoint to list available extensions
- **Extension metadata**: Standardized metadata format for extension capabilities
- **Defining common extensions**: Like semantic conventions from OpenTelemetry, develop common extensions that registries can adopt (possibly under an experimental namespace)
  - Search extension for free-text search across server metadata ([#389](https://github.com/modelcontextprotocol/registry/issues/389))
  - MCP server extension to expose the registry itself as an MCP server for programmatic access ([#24](https://github.com/modelcontextprotocol/registry/issues/24))

## Related concepts

- [[Architecture]]
- [[Registry]]
- [[Authorization]]
- [[Capabilities]]
