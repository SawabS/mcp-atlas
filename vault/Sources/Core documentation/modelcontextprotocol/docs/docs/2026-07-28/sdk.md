---
id: "modelcontextprotocol-modelcontextprotocol-docs-docs-2026-07-28-sdk-mdx-3a1f333076"
title: "SDKs"
document_type: "official-documentation"
content_class: "source"
authority: "official-core"
repository: "modelcontextprotocol/modelcontextprotocol"
source_path: "docs/docs/2026-07-28/sdk.mdx"
source_url: "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/73763114e511106fc07543f6096b3a814b1a3583/docs/docs/2026-07-28/sdk.mdx"
commit: "73763114e511106fc07543f6096b3a814b1a3583"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-core"
  - "mcp/category/core-documentation"
concepts:
  - "[[SDKs]]"
  - "[[Architecture]]"
  - "[[Transports]]"
---

Build MCP servers and clients using our official SDKs. SDKs are classified into tiers based on feature completeness, protocol support, and maintenance commitment. Learn more about [SDK tiers](/community/sdk-tiers).

## Available SDKs

| SDK                                                                                             | Repository                                                                                    |                                                   Tier |
| :---------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | -----------------------------------------------------: |
| <Icon icon="square-js" size={24} /> &nbsp; [TypeScript](https://ts.sdk.modelcontextprotocol.io) | [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) |   <Badge color="blue" shape="pill">Tier&nbsp;1</Badge> |
| <Icon icon="python" size={24} /> &nbsp; [Python](https://py.sdk.modelcontextprotocol.io)        | [modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)         |   <Badge color="blue" shape="pill">Tier&nbsp;1</Badge> |
| <Icon icon="square-c" size={24} /> &nbsp; [C#](https://csharp.sdk.modelcontextprotocol.io)      | [modelcontextprotocol/csharp-sdk](https://github.com/modelcontextprotocol/csharp-sdk)         |   <Badge color="blue" shape="pill">Tier&nbsp;1</Badge> |
| <Icon icon="golang" size={24} /> &nbsp; [Go](https://go.sdk.modelcontextprotocol.io)            | [modelcontextprotocol/go-sdk](https://github.com/modelcontextprotocol/go-sdk)                 |   <Badge color="blue" shape="pill">Tier&nbsp;1</Badge> |
| <Icon icon="java" size={24} /> &nbsp; [Java](https://java.sdk.modelcontextprotocol.io)          | [modelcontextprotocol/java-sdk](https://github.com/modelcontextprotocol/java-sdk)             | <Badge color="purple" shape="pill">Tier&nbsp;2</Badge> |
| <Icon icon="rust" size={24} /> &nbsp; [Rust](https://rust.sdk.modelcontextprotocol.io)          | [modelcontextprotocol/rust-sdk](https://github.com/modelcontextprotocol/rust-sdk)             | <Badge color="purple" shape="pill">Tier&nbsp;2</Badge> |
| <Icon icon="swift" size={24} /> &nbsp; Swift                                                    | [modelcontextprotocol/swift-sdk](https://github.com/modelcontextprotocol/swift-sdk)           | <Badge color="orange" shape="pill">Tier&nbsp;3</Badge> |
| <Icon icon="gem" size={24} /> &nbsp; [Ruby](https://ruby.sdk.modelcontextprotocol.io)           | [modelcontextprotocol/ruby-sdk](https://github.com/modelcontextprotocol/ruby-sdk)             | <Badge color="orange" shape="pill">Tier&nbsp;3</Badge> |
| <Icon icon="php" size={24} /> &nbsp; [PHP](https://php.sdk.modelcontextprotocol.io)             | [modelcontextprotocol/php-sdk](https://github.com/modelcontextprotocol/php-sdk)               | <Badge color="orange" shape="pill">Tier&nbsp;3</Badge> |
| <Icon icon="square-k" size={24} /> &nbsp; [Kotlin](https://kotlin.sdk.modelcontextprotocol.io)  | [modelcontextprotocol/kotlin-sdk](https://github.com/modelcontextprotocol/kotlin-sdk)         | <Badge color="orange" shape="pill">Tier&nbsp;3</Badge> |

See [SDK Tiering System](/community/sdk-tiers) for details on what each tier means.

## Getting Started

Each SDK provides the same functionality but follows the idioms and best practices of its language. All SDKs support:

- Creating MCP servers that expose tools, resources, and prompts
- Building MCP clients that can connect to any MCP server
- Local and remote transport protocols
- Protocol compliance with type safety

Visit the SDK page for your chosen language to find installation instructions, documentation, and examples.

## Next Steps

Ready to start building with MCP? Choose your path:


  <Card
    title="Build a Server"
    icon="server"
    href="/docs/2026-07-28/develop/build-server"
  >
    Learn how to create your first MCP server
  </Card>
  <Card
    title="Build a Client"
    icon="computer"
    href="/docs/2026-07-28/develop/build-client"
  >
    Create applications that connect to MCP servers
  </Card>

## Related concepts

- [[SDKs]]
- [[Architecture]]
- [[Transports]]
