---
id: "modelcontextprotocol-csharp-sdk-docs-concepts-capabilities-capabilities-md-65f62b488b"
title: "Capabilities"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/csharp-sdk"
source_path: "docs/concepts/capabilities/capabilities.md"
source_url: "https://github.com/modelcontextprotocol/csharp-sdk/blob/79e13b3e2c35300551ee2af4642e5f35d468ceb5/docs/concepts/capabilities/capabilities.md"
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
  - "[[Capabilities]]"
  - "[[Elicitation]]"
  - "[[Roots]]"
  - "[[Lifecycle]]"
  - "[[Prompts]]"
  - "[[Sampling]]"
---

## Capabilities

MCP uses a [capability negotiation] mechanism during connection setup. Clients and servers exchange their supported capabilities so each side can adapt its behavior accordingly. Both sides should check the other's capabilities before using optional features.

[capability negotiation]: https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle#initialization

### Client capabilities

<xref:ModelContextProtocol.Protocol.ClientCapabilities> declares what features the client supports:

| Capability | Type | Description |
|-----------|------|-------------|
| `Roots` | <xref:ModelContextProtocol.Protocol.RootsCapability> | Client can provide filesystem root URIs |
| `Sampling` | <xref:ModelContextProtocol.Protocol.SamplingCapability> | Client can handle LLM sampling requests |
| `Elicitation` | <xref:ModelContextProtocol.Protocol.ElicitationCapability> | Client can present forms or URLs to the user |
| `Experimental` | `IDictionary<string, object>` | Experimental capabilities |

Configure client capabilities when creating an MCP client:

```csharp
var options = new McpClientOptions
{
    Capabilities = new ClientCapabilities
    {
        Roots = new RootsCapability { ListChanged = true },
        Sampling = new SamplingCapability(),
        Elicitation = new ElicitationCapability
        {
            Form = new FormElicitationCapability(),
            Url = new UrlElicitationCapability()
        }
    }
};

await using var client = await McpClient.CreateAsync(transport, options);
```

Handlers for each capability (roots, sampling, and elicitation) are covered in their respective documentation pages.

### Server capabilities

<xref:ModelContextProtocol.Protocol.ServerCapabilities> declares what features the server supports:

| Capability | Type | Description |
|-----------|------|-------------|
| `Tools` | <xref:ModelContextProtocol.Protocol.ToolsCapability> | Server exposes callable tools |
| `Prompts` | <xref:ModelContextProtocol.Protocol.PromptsCapability> | Server exposes prompt templates |
| `Resources` | <xref:ModelContextProtocol.Protocol.ResourcesCapability> | Server exposes readable resources |
| `Logging` | <xref:ModelContextProtocol.Protocol.LoggingCapability> | Server can send log messages |
| `Completions` | <xref:ModelContextProtocol.Protocol.CompletionsCapability> | Server supports argument completions |
| `Experimental` | `IDictionary<string, object>` | Experimental capabilities |

Server capabilities are automatically inferred from the configured features. For example, registering tools with `.WithTools<T>()` automatically declares the tools capability.

### Checking capabilities

Before using an optional feature, check whether the other side declared the corresponding capability.

#### Check server capabilities from the client

```csharp
await using var client = await McpClient.CreateAsync(transport);

// Check if the server supports tools
if (client.ServerCapabilities.Tools is not null)
{
    var tools = await client.ListToolsAsync();
}

// Check if the server supports resources with subscriptions
if (client.ServerCapabilities.Resources is { Subscribe: true })
{
    await client.SubscribeToResourceAsync("config://app/settings");
}

// Check if the server supports prompts with list-changed notifications
if (client.ServerCapabilities.Prompts is { ListChanged: true })
{
    client.RegisterNotificationHandler(
        NotificationMethods.PromptListChangedNotification,
        async (notification, ct) =>
        {
            var prompts = await client.ListPromptsAsync(cancellationToken: ct);
        });
}

// Check if the server supports logging
if (client.ServerCapabilities.Logging is not null)
{
    await client.SetLoggingLevelAsync(LoggingLevel.Info);
}

// Check if the server supports completions
if (client.ServerCapabilities.Completions is not null)
{
    var completions = await client.CompleteAsync(
        new PromptReference { Name = "my_prompt" },
        argumentName: "language",
        argumentValue: "py");
}
```

### Protocol version negotiation

During connection setup, the client and server negotiate a mutually supported MCP protocol version. After initialization, the negotiated version is available on both sides:

```csharp
// On the client
string? version = client.NegotiatedProtocolVersion;

// On the server (within a tool or handler)
string? version = server.NegotiatedProtocolVersion;
```

Version negotiation is handled automatically. If the client and server cannot agree on a compatible protocol version, the initialization fails with an error.

## Related concepts

- [[Architecture]]
- [[Capabilities]]
- [[Elicitation]]
- [[Roots]]
- [[Lifecycle]]
- [[Prompts]]
- [[Sampling]]
