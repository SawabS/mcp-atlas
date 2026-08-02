---
id: "modelcontextprotocol-use-mcp-examples-servers-cf-agents-readme-md-0091dd6642"
title: "Building a Remote MCP Server on Cloudflare (Without Auth)"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/use-mcp"
source_path: "examples/servers/cf-agents/README.md"
source_url: "https://github.com/modelcontextprotocol/use-mcp/blob/40c02d2d982a4fd99d08b931801e10728993c79f/examples/servers/cf-agents/README.md"
commit: "40c02d2d982a4fd99d08b931801e10728993c79f"
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

# Building a Remote MCP Server on Cloudflare (Without Auth)

This example allows you to deploy a remote MCP server that doesn't require authentication on Cloudflare Workers. 

## Get started: 

[![Deploy to Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/ai/tree/main/demos/remote-mcp-authless)

This will deploy your MCP server to a URL like: `remote-mcp-server-authless.<your-account>.workers.dev/sse`

Alternatively, you can use the command line below to get the remote MCP Server created on your local machine:
```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
```

## Customizing your MCP Server

To add your own [tools](https://developers.cloudflare.com/agents/model-context-protocol/tools/) to the MCP server, define each tool inside the `init()` method of `src/index.ts` using `this.server.tool(...)`. 

## Connect to Cloudflare AI Playground

You can connect to your MCP server from the Cloudflare AI Playground, which is a remote MCP client:

1. Go to https://playground.ai.cloudflare.com/
2. Enter your deployed MCP server URL (`remote-mcp-server-authless.<your-account>.workers.dev/sse`)
3. You can now use your MCP tools directly from the playground!

## Connect Claude Desktop to your MCP server

You can also connect to your remote MCP server from local MCP clients, by using the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote). 

To connect to your MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"  // or remote-mcp-server-authless.your-account.workers.dev/sse
      ]
    }
  }
}
```

Restart Claude and you should see the tools become available.

## Related concepts

- [[Architecture]]
