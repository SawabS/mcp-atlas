---
id: "modelcontextprotocol-rust-sdk-examples-readme-md-2db55a1ef2"
title: "Quick Start With Claude Desktop"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/rust-sdk"
source_path: "examples/README.md"
source_url: "https://github.com/modelcontextprotocol/rust-sdk/blob/830e088d733c7964c806a2305760dd8deb30dff9/examples/README.md"
commit: "830e088d733c7964c806a2305760dd8deb30dff9"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/rust"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[SDKs]]"
  - "[[Testing]]"
---

# Quick Start With Claude Desktop

1. **Build the Server (Counter Example)**

   ```sh
   cargo build --release -p mcp-server-examples --example servers_counter_stdio
   ```

   This builds a standard input/output MCP server binary.

2. **Add or update this section in your** `PATH-TO/claude_desktop_config.json`

   Windows

   ```json
   {
     "mcpServers": {
       "counter": {
         "command": "PATH-TO/rust-sdk/target/release/examples/servers_counter_stdio.exe",
         "args": []
       }
     }
   }
   ```

   MacOS/Linux

   ```json
   {
     "mcpServers": {
       "counter": {
         "command": "PATH-TO/rust-sdk/target/release/examples/servers_counter_stdio",
         "args": []
       }
     }
   }
   ```

3. **Ensure that the MCP UI elements appear in Claude Desktop**
   The MCP UI elements will only show up in Claude for Desktop if at least one server is properly configured. It may require to restart Claude for Desktop.

4. **Once Claude Desktop is running, try chatting:**

   ```text
   counter.say_hello
   ```

   Or test other tools like:

   ```texts
   counter.increment
   counter.get_value
   counter.sum {"a": 3, "b": 4}
   ```

# Client Examples

see [clients/README.md](clients/README.md)

# Server Examples

see [servers/README.md](servers/README.md)

# Transport Examples

- [Tcp](transport/src/tcp.rs)
- [Transport on http upgrade](transport/src/http_upgrade.rs)
- [Unix Socket](transport/src/unix_socket.rs)
- [Websocket](transport/src/websocket.rs)

# Integration

- [Rig](https://github.com/0xPlaygrounds/rig/blob/main/rig/rig-core/examples/rmcp.rs) A stream chatbot with rig
- [Simple Chat Client](simple-chat-client) A simple chat client implementation using the Model Context Protocol (MCP) SDK.

# WASI

- [WASI-P2 runtime](wasi) How it works with wasip2

## Use Mcp Inspector

```sh
npx @modelcontextprotocol/inspector
```

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[SDKs]]
- [[Testing]]
