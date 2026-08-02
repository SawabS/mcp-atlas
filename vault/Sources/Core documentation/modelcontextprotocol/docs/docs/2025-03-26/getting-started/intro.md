---
id: "modelcontextprotocol-modelcontextprotocol-docs-docs-2025-03-26-getting-started-intro-m-c3204d2e62"
title: "What is the Model Context Protocol (MCP)?"
document_type: "official-documentation"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/docs/2025-03-26/getting-started/intro.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/docs/2025-03-26/getting-started/intro.mdx"
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
  - "[[Capabilities]]"
---

MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems.

Using MCP, AI applications like Claude or ChatGPT can connect to data sources (e.g. local files, databases), tools (e.g. search engines, calculators) and workflows (e.g. specialized prompts)—enabling them to access key information and perform tasks.

Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems.


  <img src="/images/mcp-simple-diagram.png" />

## What can MCP enable?

- Agents can access your Google Calendar and Notion, acting as a more personalized AI assistant.
- Claude Code can generate an entire web app using a Figma design.
- Enterprise chatbots can connect to multiple databases across an organization, empowering users to analyze data using chat.
- AI models can create 3D designs on Blender and print them out using a 3D printer.

## Why does MCP matter?

Depending on where you sit in the ecosystem, MCP can have a range of benefits.

- **Developers**: MCP reduces development time and complexity when building, or integrating with, an AI application or agent.
- **AI applications or agents**: MCP provides access to an ecosystem of data sources, tools and apps which will enhance capabilities and improve the end-user experience.
- **End-users**: MCP results in more capable AI applications or agents which can access your data and take actions on your behalf when necessary.

## Broad ecosystem support

MCP is an open protocol supported across a wide range of clients and servers. AI assistants like [Claude](https://claude.com/docs/connectors/building) and [ChatGPT](https://developers.openai.com/api/docs/mcp/), development tools like [Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers), [Cursor](https://cursor.com/docs/context/mcp), [MCPJam](https://docs.mcpjam.com/getting-started), and many others all support MCP — making it easy to build once and integrate everywhere.

## Start Building


  <Card title="Build servers" icon="server" href="/docs/2025-03-26/develop/build-server">
    Create MCP servers to expose your data and tools
  </Card>


  Develop applications that connect to MCP servers

  <Card title="Build MCP Apps" icon="puzzle-piece" href="/extensions/apps/overview">
    Build interactive apps that run inside AI clients
  </Card>

## Learn more


  <Card
    title="Understand concepts"
    icon="book"
    href="/docs/2025-03-26/learn/architecture"
  >
    Learn the core concepts and architecture of MCP
  </Card>

## Related concepts

- [[Architecture]]
- [[Capabilities]]
