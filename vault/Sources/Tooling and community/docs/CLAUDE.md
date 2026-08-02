---
id: "modelcontextprotocol-docs-claude-md-e907ca3d1f"
title: "MCP Documentation Guidelines"
document_type: "official-documentation"
content_class: "source"
authority: "official-tooling"
repository: "modelcontextprotocol/docs"
source_path: "CLAUDE.md"
source_url: "https://github.com/modelcontextprotocol/docs/blob/573dc60c2e7aab2605b29d0bf27194aa7b02e4fb/CLAUDE.md"
commit: "573dc60c2e7aab2605b29d0bf27194aa7b02e4fb"
retrieved_at: "2026-08-02T09:18:38+03:00"
license: "MIT"
generated: true
tags:
  - "mcp"
  - "mcp/authority/official-tooling"
  - "mcp/category/tooling-and-community"
concepts:
---

# MCP Documentation Guidelines

## Build Commands
- Preview changes locally: `mintlify dev`
- Deploy: Automatic after PR merge to main branch

## Style Guidelines
- Follow existing MDX formatting and components
- Keep content clear, concise, and technically accurate
- Include practical code examples where appropriate
- Test all links and code samples before submitting
- Maintain consistent structure with existing documentation
- When documenting CLI commands, use two-line format with the prompt on a separate line: `$ claude` followed by `> /command`
- Use appropriate headings: "When to use", "Steps", and "Tips" for tutorials
- Branch naming convention: prefix with "ashwin/" (e.g., "ashwin/add-mcp-cli-docs")

## File Organization
- Place new pages in appropriate sections (concepts, tutorials, etc.)
- Update docs.json when adding new pages
- Follow existing file naming conventions (kebab-case.mdx)
- Include proper frontmatter in MDX files

## Documentation Standards
- Prioritize user understanding over technical completeness
- Document both basic syntax and concrete examples
- Structure command documentation with clear formatting
- For image analysis examples, use quotes: `$ claude "Analyze this image: /path/to/image.png"`
