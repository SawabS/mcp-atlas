---
id: "modelcontextprotocol-rust-sdk-docs-contribute-md-430270fe1f"
title: "Discuss first"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/rust-sdk"
source_path: "docs/CONTRIBUTE.MD"
source_url: "https://github.com/modelcontextprotocol/rust-sdk/blob/830e088d733c7964c806a2305760dd8deb30dff9/docs/CONTRIBUTE.MD"
commit: "830e088d733c7964c806a2305760dd8deb30dff9"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/rust"
concepts:
---

# Discuss first
If you have a idea, make sure it is discussed before you make a PR. 

# Fmt And Clippy
You can use [just](https://github.com/casey/just) to help you fix your commit rapidly:
```shell
just fix
```

# How Can I Rewrite My Commit Message?
You can `git reset --soft upstream/main` and `git commit --forge`, this will merge your changes into one commit.

Or you also can use git rebase. But we will still merge them into one commit when it is merged.

# Check Code Coverage
If you are developing on vscode, you can use vscode plugin [Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters)

And also need to install llvm-cov
```sh
cargo install cargo-llvm-cov

rustup component add llvm-tools-preview
```

If you are using coverage gutters plugin, add these config to let it know lcov output.
```json
{
    "coverage-gutters.coverageFileNames": [
        "coverage.lcov",
    ],
    "coverage-gutters.coverageBaseDir": "target/llvm-cov-target",
}
```
