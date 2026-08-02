---
id: "modelcontextprotocol-python-sdk-security-md-4edf018f08"
title: "Security Policy"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/python-sdk"
source_path: "SECURITY.md"
source_url: "https://github.com/modelcontextprotocol/python-sdk/blob/a4f4ccd091138771535e17191123f20b30fda68e/SECURITY.md"
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
  - "[[Security]]"
---

# Security Policy

Thank you for helping keep the Model Context Protocol and its ecosystem secure.

## Supported Versions

| Version                                  | Line                    | Support                                     |
| ---------------------------------------- | ----------------------- | ------------------------------------------- |
| 2.x (newest release)                     | current stable (`main`) | bug fixes, security fixes, new features     |
| 1.x newest release (`v1.x` branch)       | maintenance             | critical bug fixes and security fixes       |
| older 1.x releases, and all pre-releases | unsupported             | upgrade to the newest 1.x release or to 2.x |

Only the newest release of a supported line receives fixes, so reproduce against
it before reporting. If your project depends on `mcp` and is not yet ready for
2.x, keep a `<2` upper bound on your `mcp` requirement and follow the
[migration guide](https://py.sdk.modelcontextprotocol.io/migration/) when you
migrate.

## Reporting Security Issues

If you discover a security vulnerability in this repository, please report it through
the [GitHub Security Advisory process](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
for this repository.

Please **do not** report security vulnerabilities through public GitHub issues, discussions,
or pull requests.

## What to Include

To help us triage and respond quickly, please include:

- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- Any suggested fixes (optional)

## Related concepts

- [[Security]]
