---
id: "modelcontextprotocol-csharp-sdk-samples-aspnetcoremcppersessiontools-readme-md-0562fcaca8"
title: "ASP.NET Core MCP Server with Per-Session Tool Filtering"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/csharp-sdk"
source_path: "samples/AspNetCoreMcpPerSessionTools/README.md"
source_url: "https://github.com/modelcontextprotocol/csharp-sdk/blob/79e13b3e2c35300551ee2af4642e5f35d468ceb5/samples/AspNetCoreMcpPerSessionTools/README.md"
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
  - "[[SDKs]]"
---

# ASP.NET Core MCP Server with Per-Session Tool Filtering

This sample demonstrates how to create an MCP (Model Context Protocol) server that provides different sets of tools based on route-based session configuration. This showcases the technique of using `ConfigureSessionOptions` to dynamically modify the `ToolCollection` based on route parameters for each MCP session.

## Overview

The sample demonstrates route-based tool filtering using the SDK's `ConfigureSessionOptions` callback. You could use any mechanism, routing is just one way to achieve this. The point of the sample is to show how an MCP server can dynamically adjust the available tools for each session based on arbitrary criteria, in this case, the URL route.

## Route-Based Configuration

The server uses route parameters to determine which tools to make available:

- `GET /clock` - MCP server with only clock/time tools
- `GET /calculator` - MCP server with only calculation tools  
- `GET /userinfo` - MCP server with only session/system info tools
- `GET /all` or `GET /` - MCP server with all tools (default)

## Running the Sample

1. Navigate to the sample directory:
   ```bash
   cd samples/AspNetCoreMcpPerSessionTools
   ```

2. Run the server:
   ```bash
   dotnet run
   ```

3. The server will start on `https://localhost:5001` (or the port shown in the console)

## Testing Tool Categories

### Testing Clock Tools
Connect your MCP client to: `https://localhost:5001/clock`
- Available tools: GetTime, GetDate, ConvertTimeZone

### Testing Calculator Tools  
Connect your MCP client to: `https://localhost:5001/calculator`
- Available tools: Calculate, CalculatePercentage, SquareRoot

### Testing UserInfo Tools
Connect your MCP client to: `https://localhost:5001/userinfo`  
- Available tools: GetUserInfo

### Testing All Tools
Connect your MCP client to: `https://localhost:5001/all` or `https://localhost:5001/`
- Available tools: All tools from all categories

## How It Works

### 1. Tool Registration
All tools are registered during startup using the normal MCP tool registration:

```csharp
builder.Services.AddMcpServer()
    .WithTools<ClockTool>()
    .WithTools<CalculatorTool>()
    .WithTools<UserInfoTool>();
```

### 2. Route-Based Session Filtering
The key technique is using `ConfigureSessionOptions` to modify the tool collection per session based on the route:

```csharp
.WithHttpTransport(options =>
{
    // Per-session tool filtering requires stateful mode. Set Stateless = false
    // explicitly for forward compatibility in case the default changes.
    options.Stateless = false;
    options.ConfigureSessionOptions = async (httpContext, mcpOptions, cancellationToken) =>
    {
        var toolCategory = GetToolCategoryFromRoute(httpContext);
        var toolCollection = mcpOptions.Capabilities?.Tools?.ToolCollection;
        
        if (toolCollection != null)
        {
            // Clear all tools and add back only those for this category
            toolCollection.Clear();
            
            switch (toolCategory?.ToLower())
            {
                case "clock":
                    AddToolsForType<ClockTool>(toolCollection);
                    break;
                case "calculator":
                    AddToolsForType<CalculatorTool>(toolCollection);
                    break;
                case "userinfo":
                    AddToolsForType<UserInfoTool>(toolCollection);
                    break;
                default:
                    // All tools for default/all category
                    AddToolsForType<ClockTool>(toolCollection);
                    AddToolsForType<CalculatorTool>(toolCollection);
                    AddToolsForType<UserInfoTool>(toolCollection);
                    break;
            }
        }
    };
})
```

### 3. Route Parameter Detection
The `GetToolCategoryFromRoute` method extracts the tool category from the URL route:

```csharp
static string? GetToolCategoryFromRoute(HttpContext context)
{
    if (context.Request.RouteValues.TryGetValue("toolCategory", out var categoryObj) && categoryObj is string category)
    {
        return string.IsNullOrEmpty(category) ? "all" : category;
    }
    return "all"; // Default
}
```

## Related concepts

- [[Architecture]]
- [[Testing]]
- [[SDKs]]
