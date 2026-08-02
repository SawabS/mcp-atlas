---
id: "modelcontextprotocol-php-sdk-examples-client-readme-md-2dabb5fef1"
title: "Client Examples"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/php-sdk"
source_path: "examples/client/README.md"
source_url: "https://github.com/modelcontextprotocol/php-sdk/blob/9a6d24c417154ff531906a3962061560736b0d5a/examples/client/README.md"
commit: "9a6d24c417154ff531906a3962061560736b0d5a"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/php"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[SDKs]]"
---

# Client Examples

These examples demonstrate how to use the MCP PHP Client SDK.

## STDIO Client

Connects to an MCP server running as a child process:

```bash
php examples/client/stdio_discovery_calculator.php
```

## HTTP Client

Connects to an MCP server over HTTP:

```bash
# First, start an HTTP server
php -S localhost:8000 examples/server/discovery-calculator/server.php

# Then run the client
php examples/client/http_discovery_calculator.php
```

## Requirements

All examples require the server examples to be available. The STDIO examples spawn the server process, while the HTTP examples connect to a running HTTP server.

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[SDKs]]
