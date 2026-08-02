---
id: "modelcontextprotocol-ext-apps-examples-video-resource-server-readme-md-8222ee02d5"
title: "Video Resource Server"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/ext-apps"
source_path: "examples/video-resource-server/README.md"
source_url: "https://github.com/modelcontextprotocol/ext-apps/blob/92f46a574568a3ddac7600343b7d3c4c4ed7b588/examples/video-resource-server/README.md"
commit: "92f46a574568a3ddac7600343b7d3c4c4ed7b588"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/extensions"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[Resources]]"
---

# Video Resource Server

![Screenshot](screenshot.png)

Demonstrates serving binary content (video) via MCP resources using the base64 blob pattern.

## MCP Client Configuration

Add to your MCP client configuration (stdio transport):

```json
{
  "mcpServers": {
    "video-resource": {
      "command": "npx",
      "args": [
        "-y",
        "--silent",
        "--registry=https://registry.npmjs.org/",
        "@modelcontextprotocol/server-video-resource",
        "--stdio"
      ]
    }
  }
}
```

### Local Development

To test local modifications, use this configuration (replace `~/code/ext-apps` with your clone path):

```json
{
  "mcpServers": {
    "video-resource": {
      "command": "bash",
      "args": [
        "-c",
        "cd ~/code/ext-apps/examples/video-resource-server && npm run build >&2 && node dist/index.js --stdio"
      ]
    }
  }
}
```

## Quick Start

```bash
npm install
npm run dev
```

## Tools

- **play_video** - Plays a video loaded via MCP resource
  - `videoId`: Choose from various sizes (`bunny-1mb`, `bunny-5mb`, `bunny-10mb`, etc.)

## How It Works

1. The `play_video` tool returns a `videoUri` pointing to an MCP resource
2. The view fetches the resource via `resources/read`
3. The server fetches the video from CDN and returns it as a base64 blob
4. The view decodes the blob and plays it in a `<video>` element

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[Resources]]
