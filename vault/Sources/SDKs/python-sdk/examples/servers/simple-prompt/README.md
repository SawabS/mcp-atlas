---
id: "modelcontextprotocol-python-sdk-examples-servers-simple-prompt-readme-md-49d8f9c8a3"
title: "MCP Simple Prompt"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/servers/simple-prompt/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/servers/simple-prompt/README.md"
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
  - "[[Prompts]]"
---

# MCP Simple Prompt

A simple MCP server that exposes a customizable prompt template with optional context and topic parameters.

## Usage

Start the server using either stdio (default) or Streamable HTTP transport:

```bash
# Using stdio transport (default)
uv run mcp-simple-prompt

# Using Streamable HTTP transport on custom port
uv run mcp-simple-prompt --transport streamable-http --port 8000
```

The server exposes a prompt named "simple" that accepts two optional arguments:

- `context`: Additional context to consider
- `topic`: Specific topic to focus on

## Example

Using the MCP client, you can retrieve the prompt like this using the STDIO transport:

```python
import asyncio
from mcp.client.session import ClientSession
from mcp.client.stdio import StdioServerParameters, stdio_client


async def main():
    async with stdio_client(
        StdioServerParameters(command="uv", args=["run", "mcp-simple-prompt"])
    ) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # List available prompts
            prompts = await session.list_prompts()
            print(prompts)

            # Get the prompt with arguments
            prompt = await session.get_prompt(
                "simple",
                {
                    "context": "User is a software developer",
                    "topic": "Python async programming",
                },
            )
            print(prompt)


asyncio.run(main())
```

## Related concepts

- [[Transports]]
- [[Architecture]]
- [[Prompts]]
