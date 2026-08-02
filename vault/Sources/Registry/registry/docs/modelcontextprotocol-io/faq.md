---
id: "modelcontextprotocol-registry-docs-modelcontextprotocol-io-faq-mdx-27e2f34bde"
title: "Frequently Asked Questions"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/registry"
source_path: "docs/modelcontextprotocol-io/faq.mdx"
source_url: "https://github.com/modelcontextprotocol/registry/blob/0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2/docs/modelcontextprotocol-io/faq.mdx"
commit: "0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/registry"
concepts:
  - "[[Registry]]"
  - "[[Architecture]]"
  - "[[Security]]"
---

  The MCP Registry is currently in preview. Breaking changes or data resets may occur before general availability. If you encounter any issues, please report them on [GitHub](https://github.com/modelcontextprotocol/registry/issues).

## General

### What is the difference between "Official MCP Registry", "MCP Registry", "MCP registry", "MCP Registry API", etc?

- "MCP Registry API" — An API that implements the [OpenAPI spec](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/openapi.yaml) defined by the MCP Registry.
- "Official MCP Registry API" — The REST API served at `https://registry.modelcontextprotocol.io`, which is a superset of the MCP Registry API. Its OpenAPI spec can be downloaded from [https://registry.modelcontextprotocol.io/openapi.yaml](https://registry.modelcontextprotocol.io/openapi.yaml).
- "MCP registry" — A third-party service that provides an MCP Registry API.
- "Official MCP Registry" (or "The MCP Registry") — The service that lives at `https://registry.modelcontextprotocol.io`.

### Can I delete/unpublish my server?

Yes, you can change your server's status to `deleted` using the `mcp-publisher status` command:

```bash
# Delete a specific version
mcp-publisher status --status deleted --message "No longer maintained" \
  io.github.my-username/my-server 1.0.0

# Delete all versions
mcp-publisher status --status deleted --all-versions --message "Project archived" \
  io.github.my-username/my-server
```

Deleted servers are hidden from default API listings but can still be retrieved with `include_deleted=true`. You can restore a deleted server by setting its status back to `active`.

**Note**: Server metadata is never permanently removed from the registry. The `deleted` status hides the server from discovery but preserves the historical record.

### How do I update my server metadata?

Submit a new `server.json` with a unique version string. Once published, version metadata is immutable (similar to npm).

### Can I add custom metadata when publishing?

Yes, custom metadata under `_meta.io.modelcontextprotocol.registry/publisher-provided` is preserved when publishing to the registry. This allows you to include custom metadata specific to your publishing process.


There is a 4KB size limit (4096 bytes of JSON). Publishing will fail if this limit is exceeded.


## Reporting Issues

### What if I need to report a spam or malicious server?

1. Report it as abuse to the underlying package registry (e.g. NPM, PyPi, DockerHub, etc.); and
2. Raise a GitHub issue on the registry repo with a title beginning `Abuse report: `

### What if I need to report a security vulnerability in the registry itself?

Follow [the MCP community SECURITY.md](https://github.com/modelcontextprotocol/.github/blob/main/SECURITY.md).

## Related concepts

- [[Registry]]
- [[Architecture]]
- [[Security]]
