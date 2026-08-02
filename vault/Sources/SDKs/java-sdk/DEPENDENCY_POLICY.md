---
id: "modelcontextprotocol-java-sdk-dependency-policy-md-cae3702dfc"
title: "Dependency Policy"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/java-sdk"
source_path: "DEPENDENCY_POLICY.md"
source_url: "https://github.com/modelcontextprotocol/java-sdk/blob/fd004989b9484c9b81be6b03463396797b354804/DEPENDENCY_POLICY.md"
commit: "fd004989b9484c9b81be6b03463396797b354804"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/java"
concepts:
  - "[[SDKs]]"
  - "[[Security]]"
---

# Dependency Policy

As a library consumed by downstream projects, the MCP Java SDK takes a conservative approach to dependency updates. Dependencies are kept stable unless there is a specific reason to update, such as a security vulnerability, a bug fix, or a need for new functionality.

## Update Triggers

Dependencies are updated when:

- A **security vulnerability** is disclosed (via GitHub security alerts).
- A bug in a dependency directly affects the SDK.
- A new dependency feature is needed for SDK development.
- A dependency drops support for a Java version the SDK still targets.

Routine version bumps without a clear motivation are avoided to minimize churn for downstream consumers.

## What We Don't Do

The SDK does not run scheduled version bumps for production Maven dependencies. Updating a dependency can force downstream consumers to adopt that update transitively, which can be disruptive for projects with strict dependency policies.

Dependencies are only updated when there is a concrete reason, not simply because a newer version is available.

## Automated Tooling

- **GitHub security updates** are enabled at the repository level and automatically open pull requests for Maven packages with known vulnerabilities. This is a GitHub repo setting, separate from the `dependabot.yml` configuration.
- **GitHub Actions versions** are kept up to date via Dependabot on a monthly schedule (see `.github/dependabot.yml`).
- **Maven dependencies** are monitored via Dependabot on a monthly schedule for non-production updates only (see `.github/dependabot.yml`).

## Related concepts

- [[SDKs]]
- [[Security]]
