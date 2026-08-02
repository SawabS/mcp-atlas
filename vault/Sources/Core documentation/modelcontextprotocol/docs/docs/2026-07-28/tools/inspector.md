---
id: "modelcontextprotocol-modelcontextprotocol-docs-docs-2026-07-28-tools-inspector-mdx-799fc40530"
title: "MCP Inspector"
document_type: "official-documentation"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/docs/2026-07-28/tools/inspector.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/docs/2026-07-28/tools/inspector.mdx"
commit: "73763114e511106fc07543f6096b3a814b1a3583"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-core"
  - "mcp/category/core-documentation"
concepts:
  - "[[Architecture]]"
  - "[[Testing]]"
  - "[[Capabilities]]"
  - "[[Prompts]]"
  - "[[Transports]]"
---

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is an interactive developer tool for testing and debugging MCP servers. While the [Debugging Guide](/docs/2026-07-28/tools/debugging) covers the Inspector as part of the overall debugging toolkit, this document provides a detailed exploration of the Inspector's features and capabilities.

## Getting started

### Installation and basic usage

The Inspector runs directly through `npx` without requiring installation:

```bash
npx @modelcontextprotocol/inspector <command>
```

```bash
npx @modelcontextprotocol/inspector <command> <arg1> <arg2>
```

#### Inspecting servers from npm or PyPI

A common way to start server packages from [npm](https://npmjs.com) or [PyPI](https://pypi.org).


  <Tab title="npm package">

```bash
npx -y @modelcontextprotocol/inspector npx <package-name> <args>
# For example
npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /Users/username/Desktop
```

  </Tab>

  <Tab title="PyPI package">

```bash
npx @modelcontextprotocol/inspector uvx <package-name> <args>
# For example
npx @modelcontextprotocol/inspector uvx mcp-server-git --repository ~/code/mcp/servers.git
```

  </Tab>

#### Inspecting locally developed servers

To inspect servers locally developed or downloaded as a repository, the most common
way is:


  <Tab title="TypeScript">

```bash
npx @modelcontextprotocol/inspector node path/to/server/index.js args...
```

  </Tab>
  <Tab title="Python">

```bash
npx @modelcontextprotocol/inspector \
  uv \
  --directory path/to/server \
  run \
  package-name \
  args...
```

  </Tab>

Please carefully read any attached README for the most accurate instructions.

## Feature overview


  <img src="/images/mcp-inspector.png" />

The Inspector provides several features for interacting with your MCP server:

### Server connection pane

- Allows selecting the [transport](/specification/latest/basic/transports) for connecting to the server
- For local servers, supports customizing the command-line arguments and environment

### Resources tab

- Lists all available resources
- Shows resource metadata (MIME types, descriptions)
- Allows resource content inspection
- Supports subscription testing

### Prompts tab

- Displays available prompt templates
- Shows prompt arguments and descriptions
- Enables prompt testing with custom arguments
- Previews generated messages

### Tools tab

- Lists available tools
- Shows tool schemas and descriptions
- Enables tool testing with custom inputs
- Displays tool execution results

### Notifications pane

- Presents all logs recorded from the server
- Shows notifications received from the server

## Best practices

### Development workflow

1. Start Development
   - Launch Inspector with your server
   - Verify basic connectivity
   - Check capability negotiation

2. Iterative testing
   - Make server changes
   - Rebuild the server
   - Reconnect the Inspector
   - Test affected features
   - Monitor messages

3. Test edge cases
   - Invalid inputs
   - Missing prompt arguments
   - Concurrent operations
   - Verify error handling and error responses

## Next steps


    <Card
        title="Inspector Repository"
        icon="github"
        href="https://github.com/modelcontextprotocol/inspector"
    >
        Check out the MCP Inspector source code
    </Card>

    <Card
        title="Debugging Guide"
        icon="bug"
        href="/docs/2026-07-28/tools/debugging"
    >
        Learn about broader debugging strategies
    </Card>

## Related concepts

- [[Architecture]]
- [[Testing]]
- [[Capabilities]]
- [[Prompts]]
- [[Transports]]
