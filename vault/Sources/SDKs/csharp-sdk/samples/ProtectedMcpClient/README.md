---
id: "modelcontextprotocol-csharp-sdk-samples-protectedmcpclient-readme-md-9b4463dba6"
title: "Protected MCP Client Sample"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/csharp-sdk"
source_path: "samples/ProtectedMcpClient/README.md"
source_url: "https://github.com/modelcontextprotocol/csharp-sdk/blob/79e13b3e2c35300551ee2af4642e5f35d468ceb5/samples/ProtectedMcpClient/README.md"
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
  - "[[Authorization]]"
  - "[[Security]]"
---

# Protected MCP Client Sample

This sample demonstrates how to create an MCP client that connects to a protected MCP server using OAuth 2.0 authentication. The client implements a custom OAuth authorization flow with browser-based authentication.

## Overview

The Protected MCP Client sample shows how to:
- Connect to an OAuth-protected MCP server
- Handle OAuth 2.0 authorization code flow
- Use custom authorization redirect handling
- Call protected MCP tools with authentication

## Prerequisites

- .NET 9.0 or later
- A running TestOAuthServer (for OAuth authentication)
- A running ProtectedMcpServer (for MCP services)

## Setup and Running

### Step 1: Start the Test OAuth Server

First, you need to start the TestOAuthServer which provides OAuth authentication:

```bash
cd tests\ModelContextProtocol.TestOAuthServer
dotnet run --framework net9.0
```

The OAuth server will start at `https://localhost:7029`

### Step 2: Start the Protected MCP Server

Next, start the ProtectedMcpServer which provides the weather tools:

```bash
cd samples\ProtectedMcpServer
dotnet run
```

The protected server will start at `http://localhost:7071`

### Step 3: Run the Protected MCP Client

Finally, run this client:

```bash
cd samples\ProtectedMcpClient
dotnet run
```

## What Happens

1. The client attempts to connect to the protected MCP server at `http://localhost:7071`
2. The server responds with OAuth metadata indicating authentication is required
3. The client initiates OAuth 2.0 authorization code flow:
   - Opens a browser to the authorization URL at the OAuth server
   - Starts a local HTTP listener on `http://localhost:1179/callback` to receive the authorization code
   - Exchanges the authorization code for an access token
4. The client uses the access token to authenticate with the MCP server
5. The client lists available tools and calls the `GetAlerts` tool for Washington state

## OAuth Configuration

The client is configured with:
- **Client ID**: `demo-client`
- **Client Secret**: `demo-secret` 
- **Redirect URI**: `http://localhost:1179/callback`
- **OAuth Server**: `https://localhost:7029`
- **Protected Resource**: `http://localhost:7071`

## Available Tools

Once authenticated, the client can access weather tools including:
- **GetAlerts**: Get weather alerts for a US state
- **GetForecast**: Get weather forecast for a location (latitude/longitude)

## Troubleshooting

- Ensure the ASP.NET Core dev certificate is trusted.
  ```
  dotnet dev-certs https --clean
  dotnet dev-certs https --trust
  ```
- Ensure all three services are running in the correct order
- Check that ports 7029, 7071, and 1179 are available
- If the browser doesn't open automatically, copy the authorization URL from the console and open it manually
- Make sure to allow the OAuth server's self-signed certificate in your browser

## Key Files

- `Program.cs`: Main client application with OAuth flow implementation
- `ProtectedMcpClient.csproj`: Project file with dependencies

## Related concepts

- [[Architecture]]
- [[Authorization]]
- [[Security]]
