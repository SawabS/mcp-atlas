---
id: "modelcontextprotocol-ruby-sdk-docs-installation-md-d237ff3624"
title: "Installation"
document_type: "sdk-documentation"
content_class: "source"
authority: "official-sdk"
repository: "modelcontextprotocol/ruby-sdk"
source_path: "docs/installation.md"
source_url: "https://github.com/modelcontextprotocol/ruby-sdk/blob/72a929bbc00c512fbaad82f1e14d02fae2539032/docs/installation.md"
commit: "72a929bbc00c512fbaad82f1e14d02fae2539032"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "NOASSERTION"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-sdk"
  - "mcp/category/sdks"
  - "mcp/sdk/ruby"
concepts:
  - "[[Architecture]]"
  - "[[Transports]]"
---

# Installation

Add this line to your application's Gemfile:

```ruby
gem 'mcp'
```

And then execute:

```console
$ bundle install
```

Or install it yourself as:

```console
$ gem install mcp
```

You may need to add additional dependencies depending on which features you wish to access. For example, the HTTP client transport requires the `faraday` gem:

```ruby
gem 'mcp'
gem 'faraday', '>= 2.0'
```

## Related concepts

- [[Architecture]]
- [[Transports]]
