---
id: "modelcontextprotocol-experimental-ext-interceptors-go-sdk-readme-md-4e00700c5a"
title: "MCP Interceptors - Go Implementation"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/experimental-ext-interceptors"
source_path: "go/sdk/README.md"
source_url: "https://github.com/modelcontextprotocol/experimental-ext-interceptors/blob/7cf90c9ccb8f3a2c382e2de5c443ab118385818f/go/sdk/README.md"
commit: "7cf90c9ccb8f3a2c382e2de5c443ab118385818f"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "Apache-2.0"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/extensions"
concepts:
  - "[[SDKs]]"
  - "[[Testing]]"
  - "[[Architecture]]"
---

# MCP Interceptors - Go Implementation

Go implementation of the MCP Interceptor Extension based on
[SEP-2624](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2624).

Note: Currently the MCP SDK is vendored, in-order to add the Protocol Methods needed for interceptors.

## Quick Start

```go
mcpServer := mcp.NewServer(&mcp.Implementation{
    Name:    "my-server",
    Version: "0.1.0",
}, nil)

// Create an extension and register interceptors.
ext := extension.New()

// Register a validator that blocks dangerous tool calls.
ext.AddInterceptor(&interceptors.Validator{
    Metadata: interceptors.Metadata{
        Name: "block-dangerous",
        Hooks: []interceptors.Hook{{
            Events: []string{interceptors.EventToolsCall},
            Phase:  interceptors.PhaseRequest,
        }},
        Mode: interceptors.ModeEnforce,
    },
    Handler: func(_ context.Context, inv *interceptors.Invocation) (*interceptors.ValidationResult, error) {
        raw := inv.Payload.(json.RawMessage)
        var params struct{ Name string `json:"name"` }
        json.Unmarshal(raw, &params)
        // validate the request...
        return &interceptors.ValidationResult{Valid: true}, nil
    },
})

// Install on the server and create a chain for middleware.
ext.Install(mcpServer)
chain, err := ext.LocalChain(ctx, mcpServer)
mcpServer.AddReceivingMiddleware(gomiddleware.Middleware(chain))

mcpServer.Run(context.Background(), &mcp.StdioTransport{})
```

See [`examples/`](examples/) for complete working examples.

## Documentation

- [**DESIGN.md**](doc/DESIGN.md) — architecture, execution model, integration
  with the go-sdk.
- [**PERFORMANCE.md**](doc/PERFORMANCE.md) — per-request cost model, allocation
  summary, and optimization notes.
- [**CONFORMANCE.md**](doc/CONFORMANCE.md) — SEP conformance status.

Package API documentation is available via `go doc`:

```sh
go doc github.com/modelcontextprotocol/ext-interceptors/go/sdk/interceptors
```

## Related concepts

- [[SDKs]]
- [[Testing]]
- [[Architecture]]
