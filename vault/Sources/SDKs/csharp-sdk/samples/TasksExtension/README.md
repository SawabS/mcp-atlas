---
id: "modelcontextprotocol-csharp-sdk-samples-tasksextension-readme-md-8898d2fd04"
title: "Tasks Extension Sample"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/csharp-sdk"
source_path: "samples/TasksExtension/README.md"
source_url: "https://github.com/modelcontextprotocol/csharp-sdk/blob/79e13b3e2c35300551ee2af4642e5f35d468ceb5/samples/TasksExtension/README.md"
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
  - "[[Lifecycle]]"
  - "[[Transports]]"
---

# Tasks Extension Sample

Demonstrates the MCP tasks extension ([SEP-2663](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2663-tasks-extension.md)) end-to-end in a single process.

The server is configured with an in-memory `IMcpTaskStore`, which is sufficient to make any
`[McpServerTool]` method automatically run as a background task when the client opts into the
tasks extension on a per-request basis.

The client invokes the `run-report` tool with **`CallToolAsTaskAsync` (manual poll)**. It
receives a `ResultOrCreatedTask<CallToolResult>` and, when the server runs the call as a
background task, drives the lifecycle directly with `GetTaskAsync` — polling at the server's
suggested cadence until the task reaches a terminal state (`Completed`, `Failed`, or
`Cancelled`). If the server returns an inline result instead of creating a task, the sample
surfaces that result and stops.

Both ends of the conversation are connected in-process over an in-memory `Pipe`, so no separate
server process or HTTP transport is required.

## Run

```bash
dotnet run --project samples/TasksExtension/TasksExtension.csproj
```

Expected output:

```
=== CallToolAsTaskAsync (manual poll) ===
  task created: id=… status=Working pollIntervalMs=250
  poll 1: still working …
  …
  task completed after N poll(s): report ready
```

## Notes

- For production deployments — especially stateless HTTP servers — implement
  `IMcpTaskStore` against durable storage and register it as a singleton (see
  [docs/concepts/tasks/tasks.md](../../docs/concepts/tasks/tasks.md) for the contract).

## Related concepts

- [[Architecture]]
- [[Lifecycle]]
- [[Transports]]
