---
id: "modelcontextprotocol-experimental-ext-interceptors-go-sdk-doc-conformance-md-b40f978825"
title: "SEP Conformance"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/experimental-ext-interceptors"
source_path: "go/sdk/doc/CONFORMANCE.md"
source_url: "https://github.com/modelcontextprotocol/experimental-ext-interceptors/blob/7cf90c9ccb8f3a2c382e2de5c443ab118385818f/go/sdk/doc/CONFORMANCE.md"
commit: "7cf90c9ccb8f3a2c382e2de5c443ab118385818f"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "Apache-2.0"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/extensions"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
  - "[[SDKs]]"
  - "[[Capabilities]]"
  - "[[Elicitation]]"
  - "[[Lifecycle]]"
  - "[[Roots]]"
  - "[[Sampling]]"
---

# SEP Conformance

Status of this Go SDK implementation against the SEP-2624 interceptor proposal.

## Implemented

| Area | Notes |
|------|-------|
| Validation interceptors | Parallel execution, severity-based blocking, fail-open support |
| Mutation interceptors | Sequential execution, priority ordering, payload threading via `json.RawMessage` |
| Interceptor metadata | Name, version, description, events, phase, priorityHint (polymorphic JSON), compat, configSchema, mode, failOpen |
| Event names | Constants for all standard server-side MCP methods; JSON-RPC method names used directly as event names |
| Protocol methods | `interceptors/list` for discovery, `interceptor/invoke` for invocation — both registered as custom JSON-RPC methods |
| `InterceptorChain` (SEP) | `chain.Chain` type with `chain.ChainEntry` objects pairing interceptor descriptors with MCP client sessions |
| `ChainEntry` (SEP) | `chain.ChainEntry` struct holds `InterceptorInfo` + `*mcp.ClientSession` |
| Chain discovery | `chain.Chain.AddMCPServer()` calls `interceptors/list` to discover interceptors from an MCP server |
| Chain execution | `chain.Chain.Execute()` invokes interceptors via `interceptor/invoke` on the appropriate server per entry |
| `InvokeResult` envelope | Per-interceptor result with interceptor name, type, phase, duration, validation/mutation result, mutated payload |
| `chain.ExecutionResult` | Aggregated chain result with status, results, finalPayload, validationSummary, abortedAt, totalDurationMs |
| JSON-RPC error mapping | Typed error data structs: -32602 for validation, -32603 for mutation, -32000 for timeout |
| Trust-boundary execution order | Request: validate (parallel) then mutate (sequential); Response: mutate (sequential) then validate (parallel) |
| Priority ordering | Mutators sorted by `priorityHint.Resolve(phase)` ascending, alphabetical tiebreak |
| Fail-open behavior | `FailOpen: true` interceptors log errors without aborting the chain |
| Audit mode | `ModeAudit` records results without blocking; mutated payloads not propagated |
| Timeout & context | Per-interceptor timeouts via `InvokeParams.TimeoutMs`, chain-level context cancellation, `InvocationContext` with principal/traceId |
| Receiving direction (client → server) | All server-side method calls intercepted via `AddReceivingMiddleware` |
| Capability declaration | Interceptor metadata injected into `initialize` response via `Capabilities.Extensions` |
| First-party (in-process) deployment | `Server.LocalChain()` creates an in-memory transport `chain.Chain`; interceptors invoked via JSON-RPC even in-process |
| Third-party and hybrid deployment | Chain entries can point to any `*mcp.ClientSession` — local (in-memory), stdio, or HTTP transport |
| `json.RawMessage` payloads | Interceptor handlers receive `json.RawMessage` via `interceptor/invoke`, matching the SEP's JSON-level payload model |

## Not Implemented

| Area | SEP expects | Notes |
|------|-------------|-------|
| Wildcard event matching | `"*/request"`, `"*/response"`, `"*"` | `matchesEvent` does exact match only; wildcard patterns are planned |
| Server → client interception | Client features as interceptable events: `"sampling/createMessage"`, `"elicitation/create"`, `"roots/list"` | Requires `Server.AddSendingMiddleware` support in the go-sdk |
| Per-interceptor config passthrough | `ChainExecutionParams.Config` map | Wired through to `InvokeParams.Config` but not yet used by middleware |
| Remote interceptor servers | Connecting chain to external MCP servers over stdio/HTTP | Infrastructure is ready (`chain.Chain.AddMCPServer` accepts any `*mcp.ClientSession`); no convenience helpers yet |

## Related concepts

- [[Architecture]]
- [[Transports]]
- [[SDKs]]
- [[Capabilities]]
- [[Elicitation]]
- [[Lifecycle]]
- [[Roots]]
- [[Sampling]]
