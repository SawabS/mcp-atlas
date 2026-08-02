---
id: "modelcontextprotocol-registry-cmd-publisher-readme-md-756c7667ea"
title: "MCP Publisher Tool - Development"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/registry"
source_path: "cmd/publisher/README.md"
source_url: "https://github.com/modelcontextprotocol/registry/blob/0b5cc0f6a9ba326d7982b4f03ea7da83bf7817a2/cmd/publisher/README.md"
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
  - "[[Lifecycle]]"
  - "[[Testing]]"
---

# MCP Publisher Tool - Development

CLI tool for publishing MCP servers to the registry.

> These docs are for contributors. See the [Publisher User Guide](../../docs/modelcontextprotocol-io/quickstart.mdx) for end-user documentation.

## Quick Development Setup

```bash
# Build the tool
make publisher

# Test locally 
make dev-compose  # Start local registry
./bin/mcp-publisher init
./bin/mcp-publisher login none --registry=http://localhost:8080
./bin/mcp-publisher publish --registry=http://localhost:8080
```

## Architecture

### Commands
- **`init`** - Generate server.json templates with auto-detection
- **`login`** - Handle authentication (github, dns, http, none)
- **`publish`** - Validate and upload servers to registry
- **`status`** - Update server lifecycle status (active, deprecated, deleted)
- **`logout`** - Clear stored credentials

### Authentication Providers
- **`github`** - Interactive OAuth flow
- **`github-oidc`** - CI/CD with GitHub Actions
- **`dns`** - Domain verification via DNS TXT records
- **`http`** - Domain verification via HTTPS endpoints
- **`none`** - No auth (testing only)

### Signing Providers
Optional: enables `dns` and `http` methods to sign out-of-process without direct access to the private key.

- **`google-kms`** - Google KMS signing
- **`azure-key-vault`** - Azure Key Vault signing

## Key Files

- **`main.go`** - CLI setup and command routing
- **`commands/`** - Command implementations with auto-detection logic
- **`auth/`** - Authentication provider implementations
- **`build.sh`** - Cross-platform build script

## Related concepts

- [[Architecture]]
- [[Registry]]
- [[Authorization]]
- [[Lifecycle]]
- [[Testing]]
