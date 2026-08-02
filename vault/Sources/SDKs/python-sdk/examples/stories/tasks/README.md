---
id: "modelcontextprotocol-python-sdk-examples-stories-tasks-readme-md-0c136429a4"
title: "tasks"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "examples/stories/tasks/README.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/examples/stories/tasks/README.md"
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
  - "[[Architecture]]"
  - "[[Capabilities]]"
  - "[[Testing]]"
  - "[[Tools]]"
---

# tasks

Task-augmented execution: a requestor augments a `tools/call` with a `task`, the
receiver returns a `CreateTaskResult` immediately, and the requestor polls
`tasks/get` and retrieves the deferred result.

**Status: deferred.** Tasks ship in 2026-07-28 as
[SEP-2663](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/seps/2663-tasks-extension.md),
an `io.modelcontextprotocol/tasks` extension that is wire-incompatible with the
2025-11-25 in-core design still carried (types-only) in `mcp_types`. The runtime
needs to be built to the SEP — server-decided augmentation (ignoring the legacy
`params.task`), the `{tasks/get, tasks/update, tasks/cancel}` method set, the
`resultType: "task"` envelope, `execution.taskSupport` gating, and `ttlMs`
fields — so it lands in a separate PR with the conformance `tasks-*` scenarios
wired in.

## Spec

[SEP-2663 — Tasks extension](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/seps/2663-tasks-extension.md)
· [SEP-2133 — extensions capability](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2133)

## See also

`apps/` (the additive half of the extension API).

## Related concepts

- [[Architecture]]
- [[Capabilities]]
- [[Testing]]
- [[Tools]]
