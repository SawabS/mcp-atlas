---
id: "modelcontextprotocol-python-sdk-examples-servers-simple-tool-readme-md-eae0275bae"
title: "Using stdio transport (default)"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/servers/simple-tool/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/servers/simple-tool/README.md"
commit: "a4f4ccd091138771535e17191123f20b30fda68e"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/python"
concepts:
  - "[[Transports]]"
  - "[[Architecture]]"
---

A simple MCP server that exposes a website fetching tool.

## Usage

Start the server using either stdio (default) or Streamable HTTP transport:

```bash
# Using stdio transport (default)
uv run mcp-simple-tool

# Using Streamable HTTP transport on custom port
uv run mcp-simple-tool --transport streamable-http --port 8000
```

The server exposes a tool named "fetch" that accepts one required argument:

- `url`: The URL of the website to fetch

## Example

Using the MCP client, you can use the tool like this using the STDIO transport:

```python
import asyncio
from mcp.client.session import ClientSession
from mcp.client.stdio import StdioServerParameters, stdio_client


async def main():
    async with stdio_client(
        StdioServerParameters(command="uv", args=["run", "mcp-simple-tool"])
    ) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # List available tools
            tools = await session.list_tools()
            print(tools)

            # Call the fetch tool
            result = await session.call_tool("fetch", {"url": "https://example.com"})
            print(result)


asyncio.run(main())

```

## Related concepts

- [[Transports]]
- [[Architecture]]
