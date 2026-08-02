---
id: "modelcontextprotocol-csharp-sdk-samples-filebasedmcpserver-readme-md-1089c609cd"
title: "File-Based MCP Server Sample"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/csharp-sdk"
source_path: "samples/FileBasedMcpServer/README.md"
source_url: "https://github.com/modelcontextprotocol/csharp-sdk/blob/79e13b3e2c35300551ee2af4642e5f35d468ceb5/samples/FileBasedMcpServer/README.md"
commit: "79e13b3e2c35300551ee2af4642e5f35d468ceb5"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/csharp"
concepts:
  - "[[Architecture]]"
  - "[[Testing]]"
  - "[[Transports]]"
  - "[[Lifecycle]]"
---

# File-Based MCP Server Sample

This sample demonstrates how to create a complete MCP (Model Context Protocol) server using [.NET 10's file-based programs feature](https://learn.microsoft.com/dotnet/csharp/fundamentals/tutorials/file-based-programs). Unlike traditional .NET projects that require a `.csproj` file, file-based programs allow you to write and run complete applications in a single `.cs` file.

## Running the Sample

Simply run the Program.cs file directly:

```bash
./Program.cs
```

The server will start and listen for MCP messages on stdin/stdout (stdio transport).

## Testing the Server

You can test the server by using `@modelcontextprotocol/inspector`, any stdio-compatible client, or sending JSON-RPC messages to stdin.

### Using the Inspector

```bash
npx @modelcontextprotocol/inspector ./Program.cs
```

### Using STDIN

#### Initialize the server

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test-client","version":"1.0"}}}' | ./Program.cs
```

#### List available tools

```bash
(
  echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test-client","version":"1.0"}}}'
  sleep 0.5
  echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
  sleep 1
) | ./Program.cs 2>/dev/null | grep '^{' | jq .
```

#### Call the echo tool

```bash
(
  echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test-client","version":"1.0"}}}'
  sleep 0.5
  echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"echo","arguments":{"message":"Hello, MCP!"}}}'
  sleep 1
) | ./Program.cs 2>/dev/null | grep '^{' | jq .
```

## Reference

- [File-Based Programs Tutorial](https://learn.microsoft.com/dotnet/csharp/fundamentals/tutorials/file-based-programs)
- [C# Preprocessor Directives for File-Based Apps](https://learn.microsoft.com/dotnet/csharp/language-reference/preprocessor-directives#file-based-apps)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/)

## Related concepts

- [[Architecture]]
- [[Testing]]
- [[Transports]]
- [[Lifecycle]]
