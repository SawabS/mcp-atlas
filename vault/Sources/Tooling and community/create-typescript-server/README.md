---
id: "modelcontextprotocol-create-typescript-server-readme-md-15120dd5cc"
title: "create-typescript-server ![NPM Version](https://img.shields.io/npm/v/%40modelcontextprotocol%2Fcreate-server)"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/create-typescript-server"
source_path: "README.md"
source_url: "https://github.com/modelcontextprotocol/create-typescript-server/blob/3115f395cebe7c3ca631ba4becd4cbdf46cd6291/README.md"
commit: "3115f395cebe7c3ca631ba4becd4cbdf46cd6291"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
  - "[[Architecture]]"
---

# create-typescript-server ![NPM Version](https://img.shields.io/npm/v/%40modelcontextprotocol%2Fcreate-server)

A command line tool for quickly scaffolding new MCP (Model Context Protocol) servers.

## Getting Started

```bash
# Create a new server in the directory `my-server`
npx @modelcontextprotocol/create-server my-server

# With options
npx @modelcontextprotocol/create-server my-server --name "My MCP Server" --description "A custom MCP server"
```

After creating your server:

```bash
cd my-server     # Navigate to server directory
npm install      # Install dependencies

npm run build    # Build once
# or...
npm run watch    # Start TypeScript compiler in watch mode

# optional
npm link         # Make your server binary globally available
```

## License

This project is licensed under the MIT License—see the [LICENSE](LICENSE) file for details.

## Related concepts

- [[Architecture]]
