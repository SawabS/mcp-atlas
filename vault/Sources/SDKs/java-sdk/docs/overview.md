---
id: "modelcontextprotocol-java-sdk-docs-overview-md-cce8f8c2f6"
title: "Overview"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/java-sdk"
source_path: "docs/overview.md"
source_url: "https://github.com/modelcontextprotocol/java-sdk/blob/fd004989b9484c9b81be6b03463396797b354804/docs/overview.md"
commit: "fd004989b9484c9b81be6b03463396797b354804"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/java"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[SDKs]]"
  - "[[Capabilities]]"
  - "[[Testing]]"
---

# Overview

## Architecture

The SDK follows a layered architecture with clear separation of concerns:

![MCP Stack Architecture](images/mcp-stack.svg)

- **Client/Server Layer (McpClient/McpServer)**: Both use McpSession for sync/async operations,
  with McpClient handling client-side protocol operations and McpServer managing server-side protocol operations.
- **Session Layer (McpSession)**: Manages communication patterns and state.
- **Transport Layer (McpTransport)**: Handles JSON-RPC message serialization/deserialization via:
    - StdioTransport (stdin/stdout) in the core module
    - HTTP SSE transports in dedicated transport modules (Java HttpClient, Servlet)
    - Streamable HTTP transports for efficient bidirectional communication
    - Spring WebFlux and Spring WebMVC transports (available in [Spring AI](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/api/mcp/mcp-overview.html) 2.0+)

The MCP Client is a key component in the Model Context Protocol (MCP) architecture, responsible for establishing and managing connections with MCP servers.
It implements the client-side of the protocol.

![Java MCP Client Architecture](images/java-mcp-client-architecture.jpg)

The MCP Server is a foundational component in the Model Context Protocol (MCP) architecture that provides tools, resources, and capabilities to clients.
It implements the server-side of the protocol.

![Java MCP Server Architecture](images/java-mcp-server-architecture.jpg)

Key Interactions:

- **Client/Server Initialization**: Transport setup, protocol compatibility check, capability negotiation, and implementation details exchange.
- **Message Flow**: JSON-RPC message handling with validation, type-safe response processing, and error handling.
- **Resource Management**: Resource discovery, URI template-based access, subscription system, and content retrieval.

## Module Structure

The SDK is organized into modules to separate concerns and allow adopters to bring in only what they need:

| Module | Artifact ID | Group | Purpose |
|--------|------------|-------|---------|
| `mcp-bom` | `mcp-bom` | `io.modelcontextprotocol.sdk` | Bill of Materials for dependency management |
| `mcp-core` | `mcp-core` | `io.modelcontextprotocol.sdk` | Core reference implementation (STDIO, JDK HttpClient, Servlet, Streamable HTTP) |
| `mcp-json-jackson2` | `mcp-json-jackson2` | `io.modelcontextprotocol.sdk` | Jackson 2.x JSON serialization implementation |
| `mcp-json-jackson3` | `mcp-json-jackson3` | `io.modelcontextprotocol.sdk` | Jackson 3.x JSON serialization implementation |
| `mcp` | `mcp` | `io.modelcontextprotocol.sdk` | Convenience bundle (`mcp-core` + `mcp-json-jackson3`) |
| `mcp-test` | `mcp-test` | `io.modelcontextprotocol.sdk` | Shared testing utilities and integration tests |
| `mcp-spring-webflux` _(external)_ | `mcp-spring-webflux` | `org.springframework.ai` | Spring WebFlux integration — part of [Spring AI](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/api/mcp/mcp-overview.html) 2.0+ |
| `mcp-spring-webmvc` _(external)_ | `mcp-spring-webmvc` | `org.springframework.ai` | Spring WebMVC integration — part of [Spring AI](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/api/mcp/mcp-overview.html) 2.0+ |

!!! tip
    A minimal adopter may depend only on `mcp` (core + Jackson 3). Spring-based applications should use the `mcp-spring-webflux` or `mcp-spring-webmvc` artifacts from [Spring AI](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/api/mcp/mcp-overview.html) 2.0+ (group `org.springframework.ai`), no longer part of this SDK.

## Next Steps

<div class="grid cards" markdown>

-   :rocket:{ .lg .middle } **Quickstart**

    ---

    Get started with dependencies and BOM configuration.

    [:octicons-arrow-right-24: Quickstart](quickstart.md)

-   :material-monitor:{ .lg .middle } **MCP Client**

    ---

    Learn how to create and configure MCP clients.

    [:octicons-arrow-right-24: Client](client.md)

-   :material-server:{ .lg .middle } **MCP Server**

    ---

    Learn how to implement and configure MCP servers.

    [:octicons-arrow-right-24: Server](server.md)

-   :fontawesome-brands-github:{ .lg .middle } **GitHub**

    ---

    View the source code and contribute.

    [:octicons-arrow-right-24: Repository](https://github.com/modelcontextprotocol/java-sdk)

</div>

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[SDKs]]
- [[Capabilities]]
- [[Testing]]
