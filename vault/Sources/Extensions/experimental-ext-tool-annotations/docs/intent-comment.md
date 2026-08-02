---
id: "modelcontextprotocol-experimental-ext-tool-annotations-docs-intent-comment-md-a335a7a4d8"
title: "Intent comments (posted)"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/experimental-ext-tool-annotations"
source_path: "docs/intent-comment.md"
source_url: "https://github.com/modelcontextprotocol/experimental-ext-tool-annotations/blob/e29b74f3bda7c4fd7b6effa9a1b81df349fa6a1a/docs/intent-comment.md"
commit: "e29b74f3bda7c4fd7b6effa9a1b81df349fa6a1a"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/extensions"
concepts:
  - "[[Security]]"
  - "[[Architecture]]"
  - "[[Capabilities]]"
---

# Intent comments (posted)

Both comments below have been **posted**. Kept here as the source of record,
in sync with [sep-disposition.md](./sep-disposition.md).

- **SEP-1913** umbrella comment — [posted 2026-06-10](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1913#issuecomment-4675047154).
- **SEP-2061** coordination note — [posted 2026-06-10](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2061#issuecomment-4675049171);
  @localden then **closed SEP-2061 on 2026-06-13** in favour of the
  `action-metadata` extension.

---

## For SEP-1913

> **Intent: split this SEP and migrate to the Extensions Track**
> >
> A note on direction for everyone following this thread. When SEP-1913 was
> first framed, the **Extensions Track** (SEP-2133) and the `experimental-ext-*`
> incubation process didn't exist in their current form. They now do, and
> they're a better fit for this work than a single Standards Track SEP.
> >
> Two things pushed us here:
> >
> - @localden's review ask for a **narrower first cut** — the concern that a
>   broad taxonomy with array-or-scalar polymorphism is hard to remove or change
>   once it lands.
> - The Tool Annotations IG's
>   [May 28 decision](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2820)
>   to pursue trust/privacy as an **experimental extension first**, gather
>   adoption evidence, then ask core maintainers to absorb anything.
> >
> So the plan is to \*\*split this proposal into a few small,
> independently-shippable extensions\*\*, each with its own
> `io.modelcontextprotocol/…` identifier, reference implementation, and path to
> an Extensions Track SEP. Incubation is in
> [`experimental-ext-tool-annotations`](https://github.com/modelcontextprotocol/experimental-ext-tool-annotations).
> >
> It's now scaffolded as \*\*two extensions plus a `schemes/` folder\*\* of
> interchangeable data-labelling approaches, shipped as a stacked set of PRs:
> >
> - [#2](https://github.com/modelcontextprotocol/experimental-ext-tool-annotations/pull/2) — repo scaffolding + the `trust-annotations` extension (the base).
> - [#3](https://github.com/modelcontextprotocol/experimental-ext-tool-annotations/pull/3) — the `action-metadata` extension.
> - [#4](https://github.com/modelcontextprotocol/experimental-ext-tool-annotations/pull/4) — FIDES as a data-labelling \*\*scheme\*\* under `schemes/`.
> >
> | Extension | Scope |
> |---|---|
> | `trust-annotations` | The narrow data-classification taxonomy (`sensitive`, `untrusted`) + an open-ended `evidenceRef` pointer for richer, out-of-band evidence. |
> | `action-metadata` | Tool I/O + outcome contract (folds in @rreichel3's SEP-2061). |
> >
> \*\*Data-labelling schemes (the `evidenceRef` slot).\*\* Richer evidence models
> are \*not\* extensions and \*not\* a wire root. They live in `schemes/` as
> interchangeable fillers of the `trust-annotations` `evidenceRef` slot, each
> selected by an `evidenceRef.type` value, so a deployment can adopt one, several,
> or none without changing the extension. FIDES information-flow control
> ([arXiv:2505.23643](https://arxiv.org/abs/2505.23643)) is the first worked scheme
> (`ifc.fides.v1`) — the public/private-repo confidentiality case, with
> github-mcp-server as an emitter example. The folder is built to hold the range of
> other models raised in review (coarse data classification, design-pattern
> controls, capability tokens, cosigning, sequence-shape, attestation).
> >
> Deliberately removed: `maliciousActivityHint` (the structural concerns raised
> here are unresolved) and session-level propagation rules.
> >
> This follows the same Standards-Track → Extensions-Track refactor pattern as
> SEP-2127 (#2893). This PR is now the `trust-annotations` base of the stack; the
> `action-metadata` extension and the `schemes/` folder are stacked on it.
> Everything is still in the incubation phase, so naming, design, and the choice of
> what to put forward as an extension are all open for discussion in the IG.

---

## For SEP-2061 (coordination note)

> @rreichel3 — splitting this out into an independent extension as discussed: https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1913#issuecomment-4675047154

## Related concepts

- [[Security]]
- [[Architecture]]
- [[Capabilities]]
