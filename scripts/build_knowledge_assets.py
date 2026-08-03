#!/usr/bin/env python3
"""Build the presentation vault, web catalog, and retrieval index."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import posixpath
import re
import shutil
import textwrap
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


DOCUMENT_SUFFIXES = {".md", ".mdx", ".rst"}
EXCLUDED_PARTS = {
    ".git",
    ".next",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "target",
    "vendor",
}
CONCEPTS = {
    "Architecture": {
        "terms": ("architecture", "host", "client", "server"),
        "summary": "MCP uses a host, one or more clients, and servers that expose focused capabilities through negotiated protocol sessions.",
        "links": ("Lifecycle", "Transports", "Capabilities"),
    },
    "Lifecycle": {
        "terms": ("lifecycle", "initialize", "initialized", "shutdown"),
        "summary": "The lifecycle covers initialization, capability negotiation, normal operation, and orderly shutdown of an MCP connection.",
        "links": ("Architecture", "Capabilities", "Transports"),
    },
    "Capabilities": {
        "terms": ("capability", "capabilities", "negotiation"),
        "summary": "Clients and servers declare supported capabilities during initialization so each side can use only mutually understood features.",
        "links": ("Lifecycle", "Tools", "Resources", "Prompts"),
    },
    "Tools": {
        "terms": ("tools/list", "tools/call", "tool invocation", "tool result"),
        "summary": "Tools are server-exposed actions that a model or application can discover and invoke with structured arguments.",
        "links": ("Resources", "Prompts", "Security"),
    },
    "Resources": {
        "terms": ("resources/list", "resources/read", "resource template", "resource uri"),
        "summary": "Resources expose addressable context such as files, schemas, and application data through URI-based discovery and reading.",
        "links": ("Tools", "Prompts", "Roots"),
    },
    "Prompts": {
        "terms": ("prompts/list", "prompts/get", "prompt template"),
        "summary": "Prompts are reusable server-provided templates that help users and applications start structured model interactions.",
        "links": ("Tools", "Resources", "Sampling"),
    },
    "Sampling": {
        "terms": ("sampling/createMessage", "sampling request", "create message"),
        "summary": "Sampling lets a server request model generation through the client while the host retains model access and user control.",
        "links": ("Prompts", "Elicitation", "Security"),
    },
    "Elicitation": {
        "terms": ("elicitation", "elicit"),
        "summary": "Elicitation allows a server to request additional structured information from the user through the client.",
        "links": ("Sampling", "Security", "Capabilities"),
    },
    "Roots": {
        "terms": ("roots/list", "root uri", "filesystem root"),
        "summary": "Roots communicate filesystem or URI boundaries that a client makes relevant to a server.",
        "links": ("Resources", "Security", "Capabilities"),
    },
    "Transports": {
        "terms": ("streamable http", "stdio", "transport", "server-sent events"),
        "summary": "MCP messages can travel over local standard input and output or remote Streamable HTTP connections.",
        "links": ("Architecture", "Lifecycle", "Authorization"),
    },
    "Authorization": {
        "terms": ("oauth", "authorization", "protected resource metadata"),
        "summary": "Authorization defines how remote MCP clients obtain and use scoped access to protected servers and resources.",
        "links": ("Security", "Transports", "Registry"),
    },
    "Security": {
        "terms": ("security", "threat", "consent", "trust", "token"),
        "summary": "MCP security depends on explicit user consent, narrow permissions, trustworthy boundaries, and careful handling of untrusted server content.",
        "links": ("Authorization", "Tools", "Roots"),
    },
    "Registry": {
        "terms": ("registry", "server.json", "package registry"),
        "summary": "The MCP Registry publishes standardized server metadata that points to packages, repositories, and remote endpoints.",
        "links": ("Authorization", "Reference Servers", "Security"),
    },
    "Reference Servers": {
        "terms": ("reference server", "everything server", "filesystem server"),
        "summary": "Official reference servers and examples demonstrate protocol features and implementation patterns across supported SDKs.",
        "links": ("Registry", "Tools", "Resources"),
    },
    "SDKs": {
        "terms": ("sdk", "client session", "server session"),
        "summary": "Official SDKs provide typed protocol primitives and higher-level APIs for building clients and servers in multiple languages.",
        "links": ("Architecture", "Testing", "Reference Servers"),
    },
    "Testing": {
        "terms": ("conformance", "test suite", "inspector", "testing"),
        "summary": "Conformance suites and the MCP Inspector help implementations validate protocol behavior and troubleshoot integrations.",
        "links": ("SDKs", "Lifecycle", "Security"),
    },
}
AUTHORITY_PRIORITY = {
    "official-core": 0,
    "official-sdk": 1,
    "official-server": 2,
    "official-tooling": 3,
    "community": 4,
}


def compact_spaces(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str, limit: int = 100) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return normalized[:limit].rstrip("-") or "document"


def stable_id(repository: str, source_path: str) -> str:
    key = f"{repository}:{source_path}"
    digest = hashlib.sha1(key.encode("utf-8"), usedforsecurity=False).hexdigest()[:10]
    return f"{slugify(key, 86)}-{digest}"


def markdown_title(text: str, fallback: str) -> str:
    frontmatter = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if frontmatter:
        match = re.search(r"^title:\s*[\"']?(.+?)[\"']?\s*$", frontmatter.group(1), re.MULTILINE)
        if match:
            return compact_spaces(match.group(1))
    match = re.search(r"^#\s+(.+?)\s*$", text, re.MULTILINE)
    if match:
        return compact_spaces(re.sub(r"[`*_]", "", match.group(1)))
    return fallback.replace("-", " ").replace("_", " ").title()


def strip_frontmatter(text: str) -> str:
    return re.sub(r"^---\s*\n.*?\n---\s*\n", "", text, count=1, flags=re.DOTALL)


def rewrite_browser_links(markdown: str, repository: str, commit: str | None, source_path: str) -> str:
    revision = commit or "main"
    source_directory = posixpath.dirname(source_path)

    def replace(match: re.Match[str]) -> str:
        image_link = match.group(1) == "!"
        target = match.group(2).strip()
        if not target or target.startswith(("#", "http://", "https://", "mailto:", "data:")):
            return match.group(0)
        path_part, separator, anchor = target.partition("#")
        if not image_link and path_part.startswith("/docs/"):
            url = f"https://modelcontextprotocol.io{path_part}"
            if separator:
                url = f"{url}#{anchor}"
            return f"]({url})"
        if path_part.startswith("/posts/"):
            resolved = f"blog/static{path_part}"
        elif path_part.startswith("/"):
            resolved = path_part.lstrip("/")
        else:
            resolved = posixpath.normpath(posixpath.join(source_directory, path_part))
        if image_link:
            url = f"https://raw.githubusercontent.com/{repository}/{revision}/{resolved}"
        else:
            url = f"https://github.com/{repository}/blob/{revision}/{resolved}"
        if separator:
            url = f"{url}#{anchor}"
        return f"{match.group(1)}]({url})"

    return re.sub(r"(!?)\]\(([^)]+)\)", replace, markdown)


def normalize_document(text: str, suffix: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    if suffix == ".mdx":
        text = re.sub(r"^(?:import|export)\s+.*$", "", text, flags=re.MULTILINE)
        text = normalize_mdx_components(text)
    return text.strip() + "\n"


def normalize_mdx_components(text: str) -> str:
    """Translate documentation-site MDX components into portable Markdown."""
    protected: list[str] = []

    def protect(match: re.Match[str]) -> str:
        token = f"\0INDEX_SEGMENT_{len(protected)}\0"
        protected.append(match.group(0))
        return token

    value = re.sub(r"```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`", protect, text)

    def attribute(attributes: str, name: str) -> str:
        match = re.search(rf"\b{re.escape(name)}\s*=\s*(?:\"([^\"]*)\"|'([^']*)')", attributes, re.IGNORECASE)
        return (match.group(1) or match.group(2)) if match else ""

    def card(match: re.Match[str]) -> str:
        attributes, body = match.group(1), textwrap.dedent(match.group(2)).strip()
        title = attribute(attributes, "title") or "Learn more"
        href = attribute(attributes, "href")
        heading = f"[{title}]({href})" if href else title
        copy = f"\n\n{body}" if body else ""
        return f"\n### {heading}{copy}\n"

    def card_single(match: re.Match[str]) -> str:
        attributes = match.group(1)
        title = attribute(attributes, "title") or "Learn more"
        href = attribute(attributes, "href")
        return f"\n- [{title}]({href})\n" if href else f"\n- {title}\n"

    def titled_block(match: re.Match[str]) -> str:
        name, attributes, body = match.group(1), match.group(2), textwrap.dedent(match.group(3)).strip()
        title = attribute(attributes, "title") or attribute(attributes, "value") or name
        return f"\n#### {title}\n\n{body}\n"

    def callout(match: re.Match[str]) -> str:
        name, body = match.group(1), textwrap.dedent(match.group(2)).strip().replace("\n", "\n> ")
        return f"\n> **{name}:** {body}\n"

    value = re.sub(r"<Card\b([^>]*)>([\s\S]*?)</Card\s*>", card, value, flags=re.IGNORECASE)
    value = re.sub(r"<Card\b([^>]*)/>", card_single, value, flags=re.IGNORECASE)
    value = re.sub(r"<(Tab|Step|Accordion)\b([^>]*)>([\s\S]*?)</\1\s*>", titled_block, value, flags=re.IGNORECASE)
    value = re.sub(r"<(Warning|Info|Note|Tip|Danger)\b[^>]*>([\s\S]*?)</\1\s*>", callout, value, flags=re.IGNORECASE)
    value = re.sub(r"<(Badge|Tooltip)\b[^>]*>([\s\S]*?)</\1\s*>", r"\2", value, flags=re.IGNORECASE)
    value = re.sub(r"<Icon\b[^>]*/?>", "", value, flags=re.IGNORECASE)
    value = re.sub(r"<(?:Badge|Tooltip)\b[^>]*/>", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^\s*</?(?:CardGroup|Columns?|Tabs|Steps|AccordionGroup)\b[^>]*>\s*$", "", value, flags=re.IGNORECASE | re.MULTILINE)
    value = re.sub(r"&nbsp;", " ", value, flags=re.IGNORECASE)
    value = re.sub(r"[ \t]+\n", "\n", value)
    value = re.sub(r"\n{4,}", "\n\n\n", value)

    for index, segment in enumerate(protected):
        value = value.replace(f"\0INDEX_SEGMENT_{index}\0", segment)
    return value


def plain_text(markdown: str) -> str:
    value = strip_frontmatter(markdown)
    value = re.sub(r"```.*?```", " ", value, flags=re.DOTALL)
    value = re.sub(r"`([^`]+)`", r"\1", value)
    value = re.sub(r"!\[[^]]*]\([^)]*\)", " ", value)
    value = re.sub(r"\[([^]]+)]\([^)]*\)", r"\1", value)
    value = re.sub(r"<[^>]+>", " ", value)
    value = re.sub(r"[#>*_|~-]", " ", value)
    return compact_spaces(html.unescape(value))


def headings(markdown: str) -> list[str]:
    values = []
    for match in re.finditer(r"^#{1,4}\s+(.+?)\s*$", markdown, re.MULTILINE):
        heading = compact_spaces(re.sub(r"[`*_]", "", match.group(1)))
        if heading and heading not in values:
            values.append(heading)
    return values[:40]


def concepts_for(text: str) -> list[str]:
    lowered = text.lower()
    scored = []
    for name, config in CONCEPTS.items():
        score = sum(lowered.count(term.lower()) for term in config["terms"])
        if score:
            scored.append((score, name))
    return [name for _, name in sorted(scored, key=lambda item: (-item[0], item[1]))[:8]]


def category_for(repository_name: str, source_path: str, authority: str) -> str:
    lowered = source_path.lower()
    if repository_name == "modelcontextprotocol" and "specification" in lowered:
        return "Specification"
    if repository_name == "modelcontextprotocol":
        return "Core documentation"
    if authority == "official-sdk":
        return "SDKs"
    if authority == "official-server" or repository_name in {"servers", "servers-archived"}:
        return "Reference servers"
    if repository_name.startswith(("ext-", "experimental-ext-")):
        return "Extensions"
    if repository_name in {"registry", "dns"}:
        return "Registry"
    return "Tooling and community"


def document_freshness(source_path: str) -> int:
    lowered = source_path.lower()
    if "2026-07-28" in lowered:
        return 0
    if "/draft/" in f"/{lowered}/":
        return 1
    if re.search(r"/(?:202[0-5])-\d{2}-\d{2}/", f"/{lowered}"):
        return 4
    if any(name in lowered for name in ("changelog", "migration", "agents.md")):
        return 5
    return 2


def retrieval_eligible(source_path: str) -> bool:
    lowered = source_path.lower()
    excluded_names = (
        "agents.md",
        "changelog",
        "code_of_conduct",
        "code-of-conduct",
        "contributing",
        "maintainers",
    )
    return not any(name in lowered for name in excluded_names)


def presentation_eligible(source_path: str) -> bool:
    lowered = source_path.lower()
    excluded = (
        ".changeset/",
        ".claude/",
        ".github/",
        "/skills/",
        "agents.md",
        "changelog",
        "code_of_conduct",
        "code-of-conduct",
        "contributing",
        "maintainers",
    )
    return not any(value in lowered for value in excluded)


def source_permalink(repository: str, commit: str | None, source_path: str) -> str:
    revision = commit or "main"
    return f"https://github.com/{repository}/blob/{revision}/{source_path}"


def yaml_scalar(value: object) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    return json.dumps(str(value), ensure_ascii=False)


def yaml_list(name: str, values: Iterable[str]) -> list[str]:
    result = [f"{name}:"]
    for value in values:
        result.append(f"  - {yaml_scalar(value)}")
    return result


def note_frontmatter(document: dict) -> str:
    lines = [
        "---",
        f"id: {yaml_scalar(document['id'])}",
        f"title: {yaml_scalar(document['title'])}",
        f"document_type: {yaml_scalar(document['documentType'])}",
        f"content_class: {yaml_scalar('source')}",
        f"authority: {yaml_scalar(document['authority'])}",
        f"repository: {yaml_scalar(document['repository'])}",
        f"source_path: {yaml_scalar(document['sourcePath'])}",
        f"source_url: {yaml_scalar(document['sourceUrl'])}",
        f"commit: {yaml_scalar(document['commit'])}",
        f"retrieved_at: {yaml_scalar(document['retrievedAt'])}",
        f"license: {yaml_scalar(document['license'])}",
        f"generated: {yaml_scalar(True)}",
    ]
    lines.extend(yaml_list("tags", document["tags"]))
    lines.extend(yaml_list("concepts", [f"[[{value}]]" for value in document["concepts"]]))
    lines.append("---")
    return "\n".join(lines) + "\n\n"


def iter_sections(markdown: str) -> Iterable[tuple[str, str]]:
    current_heading = "Overview"
    buffer: list[str] = []
    for line in strip_frontmatter(markdown).splitlines():
        match = re.match(r"^#{1,4}\s+(.+?)\s*$", line)
        if match and buffer:
            yield current_heading, "\n".join(buffer).strip()
            buffer = []
        if match:
            current_heading = compact_spaces(re.sub(r"[`*_]", "", match.group(1)))
        buffer.append(line)
    if buffer:
        yield current_heading, "\n".join(buffer).strip()


def split_chunks(markdown: str, limit: int = 3600) -> Iterable[tuple[str, str]]:
    for heading, section in iter_sections(markdown):
        if len(section) <= limit:
            if len(plain_text(section)) >= 80:
                yield heading, section
            continue
        paragraphs = re.split(r"\n\s*\n", section)
        buffer = ""
        for paragraph in paragraphs:
            if buffer and len(buffer) + len(paragraph) + 2 > limit:
                if len(plain_text(buffer)) >= 80:
                    yield heading, buffer.strip()
                buffer = ""
            buffer = f"{buffer}\n\n{paragraph}" if buffer else paragraph
        if len(plain_text(buffer)) >= 80:
            yield heading, buffer.strip()


def reset_generated_directory(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def write_if_missing(path: Path, content: str) -> None:
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")


def build_curated_vault(vault: Path, concept_sources: dict[str, list[dict]], stats: dict) -> None:
    home = f"""---
title: MCP Knowledge Base
content_class: map
tags:
  - mcp/map
---

# MCP Knowledge Base

Explore {stats['documents']:,} official documents and {stats['registryServers']:,} active Registry entries.

## Core protocol

- [[Architecture]]
- [[Lifecycle]]
- [[Capabilities]]
- [[Transports]]
- [[Authorization]]
- [[Security]]

## Protocol primitives

- [[Tools]]
- [[Resources]]
- [[Prompts]]
- [[Sampling]]
- [[Elicitation]]
- [[Roots]]

## Ecosystem

- [[SDKs]]
- [[Reference Servers]]
- [[Registry]]
- [[Testing]]

## Maps

- [[Protocol Concepts]]
- [[SDK and Server Development]]
- [[Security and Authorization]]
- [[Registry and Distribution]]
"""
    write_if_missing(vault / "00 Home" / "MCP Knowledge Base.md", home)

    for name, config in CONCEPTS.items():
        source_lines = []
        for document in concept_sources.get(name, [])[:8]:
            source_lines.append(f"- [[{document['vaultLink']}|{document['title']}]]")
        related = "\n".join(f"- [[{item}]]" for item in config["links"])
        note = f"""---
title: {json.dumps(name)}
content_class: synthesis
generated: false
tags:
  - mcp/concept/{slugify(name)}
---

# {name}

{config['summary']}

## Related concepts

{related}

## Authoritative sources

{chr(10).join(source_lines) if source_lines else '- See [[MCP Knowledge Base]]'}
"""
        write_if_missing(vault / "20 Concepts" / f"{name}.md", note)

    maps = {
        "Protocol Concepts": ("Architecture", "Lifecycle", "Capabilities", "Tools", "Resources", "Prompts", "Sampling", "Elicitation", "Roots", "Transports"),
        "SDK and Server Development": ("SDKs", "Reference Servers", "Tools", "Resources", "Testing"),
        "Security and Authorization": ("Security", "Authorization", "Roots", "Transports"),
        "Registry and Distribution": ("Registry", "Reference Servers", "Authorization", "Security"),
    }
    for title, items in maps.items():
        content = f"# {title}\n\n" + "\n".join(f"- [[{item}]]" for item in items) + "\n"
        write_if_missing(vault / "80 Maps" / f"{title}.md", content)

    canvas_nodes = []
    canvas_edges = []
    positions = {
        "Architecture": (0, 0), "Lifecycle": (420, -240), "Capabilities": (420, 0),
        "Transports": (420, 240), "Tools": (860, -320), "Resources": (860, -110),
        "Prompts": (860, 100), "Sampling": (860, 310),
    }
    for index, (name, (x, y)) in enumerate(positions.items()):
        canvas_nodes.append({"id": f"node-{index}", "type": "file", "file": f"20 Concepts/{name}.md", "x": x, "y": y, "width": 320, "height": 180})
    node_ids = {name: f"node-{index}" for index, name in enumerate(positions)}
    for source, target in (("Architecture", "Lifecycle"), ("Architecture", "Capabilities"), ("Architecture", "Transports"), ("Capabilities", "Tools"), ("Capabilities", "Resources"), ("Capabilities", "Prompts"), ("Capabilities", "Sampling")):
        canvas_edges.append({"id": f"edge-{len(canvas_edges)}", "fromNode": node_ids[source], "toNode": node_ids[target]})
    canvas = {"nodes": canvas_nodes, "edges": canvas_edges}
    write_if_missing(vault / "80 Maps" / "MCP Architecture.canvas", json.dumps(canvas, indent=2) + "\n")

    bases = {
        "MCP Servers.base": 'filters:\n  and:\n    - file.hasTag("mcp/server")\nviews:\n  - type: table\n    name: Active MCP servers\n',
        "SDK Documentation.base": 'filters:\n  and:\n    - file.hasTag("mcp/sdk")\nviews:\n  - type: table\n    name: SDK documentation\n',
    }
    for filename, content in bases.items():
        write_if_missing(vault / "50 Registry" / filename, content)

    obsidian = vault / ".obsidian"
    obsidian.mkdir(parents=True, exist_ok=True)
    (obsidian / "app.json").write_text(json.dumps({"alwaysUpdateLinks": True, "newFileLocation": "folder", "newFileFolderPath": "90 AI Notes"}, indent=2) + "\n", encoding="utf-8")
    (obsidian / "graph.json").write_text(json.dumps({"collapse-filter": False, "search": '-path:"Sources/_raw"', "showTags": True, "showAttachments": False}, indent=2) + "\n", encoding="utf-8")
    for path in (vault / "90 AI Notes", vault / "Attachments"):
        path.mkdir(parents=True, exist_ok=True)
        keep = path / ".gitkeep"
        keep.touch(exist_ok=True)


def build_graph() -> dict:
    nodes = []
    edges = []
    groups = {
        "Architecture": "core", "Lifecycle": "core", "Capabilities": "core", "Transports": "core",
        "Tools": "primitive", "Resources": "primitive", "Prompts": "primitive", "Sampling": "primitive",
        "Elicitation": "primitive", "Roots": "primitive", "Authorization": "security", "Security": "security",
        "Registry": "ecosystem", "Reference Servers": "ecosystem", "SDKs": "ecosystem", "Testing": "ecosystem",
    }
    for name, config in CONCEPTS.items():
        nodes.append({"id": slugify(name), "label": name, "group": groups[name], "summary": config["summary"]})
        for target in config["links"]:
            edge = tuple(sorted((slugify(name), slugify(target))))
            if edge not in edges:
                edges.append(edge)
    return {"nodes": nodes, "edges": [{"source": source, "target": target} for source, target in edges]}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    args = parser.parse_args()
    root = args.root.resolve()
    vault = root / "vault"
    app_public = root / "app" / "public" / "data"
    app_server_data = root / "app" / "data"
    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    source_metadata = {}
    with (root / "manifests" / "source-files.jsonl").open(encoding="utf-8") as source:
        for line in source:
            item = json.loads(line)
            if item["source_type"] == "github":
                source_metadata[(item["repository"], item["path"])] = item

    sources_dir = vault / "Sources"
    documents_dir = app_public / "documents"
    reset_generated_directory(sources_dir)
    reset_generated_directory(documents_dir)
    app_server_data.mkdir(parents=True, exist_ok=True)
    app_public.mkdir(parents=True, exist_ok=True)

    raw_documents = []
    repos_root = root / "official-repos"
    for repository_path in sorted(repos_root.iterdir(), key=lambda path: path.name.casefold()):
        if not (repository_path / ".git").is_dir():
            continue
        repository = f"modelcontextprotocol/{repository_path.name}"
        for path in sorted(repository_path.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in DOCUMENT_SUFFIXES or any(part in EXCLUDED_PARTS for part in path.parts):
                continue
            source_path = path.relative_to(repository_path).as_posix()
            if not presentation_eligible(source_path):
                continue
            metadata = source_metadata.get((repository, source_path))
            if not metadata:
                continue
            text = normalize_document(path.read_text(encoding="utf-8", errors="replace"), path.suffix.lower())
            body = plain_text(text)
            if len(body) < 80:
                continue
            title = markdown_title(text, path.stem)
            concept_names = concepts_for(body)
            authority = metadata["authority"]
            category = category_for(repository_path.name, source_path, authority)
            document_id = stable_id(repository, source_path)
            commit = metadata.get("commit")
            source_url = source_permalink(repository, commit, source_path)
            tags = ["mcp", f"mcp/authority/{authority}", f"mcp/category/{slugify(category)}"]
            if authority == "official-sdk":
                tags.append(f"mcp/sdk/{repository_path.name.removesuffix('-sdk')}")
            document_type = "specification" if category == "Specification" else "sdk-documentation" if category == "SDKs" else "official-documentation"
            vault_relative = Path(category) / repository_path.name / Path(source_path).with_suffix(".md")
            vault_link = str((Path("Sources") / vault_relative).with_suffix("")).replace("\\", "/")
            document = {
                "id": document_id,
                "title": title,
                "excerpt": body[:520] + ("..." if len(body) > 520 else ""),
                "content": text,
                "documentType": document_type,
                "authority": authority,
                "repository": repository,
                "sourcePath": source_path,
                "sourceUrl": source_url,
                "commit": commit,
                "retrievedAt": metadata.get("retrieved_at", generated_at),
                "license": metadata.get("license"),
                "category": category,
                "tags": tags,
                "concepts": concept_names,
                "headings": headings(text),
                "wordCount": len(body.split()),
                "vaultPath": (Path("Sources") / vault_relative).as_posix(),
                "vaultLink": vault_link,
            }
            raw_documents.append(document)

    raw_documents.sort(key=lambda item: (AUTHORITY_PRIORITY.get(item["authority"], 9), document_freshness(item["sourcePath"]), item["category"], item["repository"], item["sourcePath"]))
    catalog = []
    concept_sources: dict[str, list[dict]] = defaultdict(list)
    retrieval_chunks = []
    seen_chunk_hashes = set()
    category_counts = Counter()
    authority_counts = Counter()

    for document in raw_documents:
        vault_path = vault / document["vaultPath"]
        vault_path.parent.mkdir(parents=True, exist_ok=True)
        related = "\n".join(f"- [[{name}]]" for name in document["concepts"])
        note = note_frontmatter(document) + strip_frontmatter(document["content"])
        if related:
            note += f"\n## Related concepts\n\n{related}\n"
        vault_path.write_text(note, encoding="utf-8")

        browser_document = dict(document)
        browser_document["content"] = rewrite_browser_links(
            strip_frontmatter(document["content"]),
            document["repository"],
            document["commit"],
            document["sourcePath"],
        )
        browser_document.pop("retrievedAt", None)
        (documents_dir / f"{document['id']}.json").write_text(json.dumps(browser_document, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        catalog_item = {key: value for key, value in browser_document.items() if key != "content"}
        catalog.append(catalog_item)
        category_counts[document["category"]] += 1
        authority_counts[document["authority"]] += 1
        for concept in document["concepts"]:
            concept_sources[concept].append(document)

        if not retrieval_eligible(document["sourcePath"]):
            continue
        for index, (heading, chunk_text) in enumerate(split_chunks(document["content"])):
            normalized = compact_spaces(plain_text(chunk_text)).lower()
            content_hash = hashlib.sha256(normalized.encode("utf-8")).hexdigest()
            if content_hash in seen_chunk_hashes:
                continue
            seen_chunk_hashes.add(content_hash)
            anchor = slugify(heading, 140)
            retrieval_chunks.append({
                "id": f"{document['id']}:{index}",
                "documentId": document["id"],
                "title": document["title"],
                "heading": heading,
                "text": chunk_text,
                "authority": document["authority"],
                "repository": document["repository"],
                "sourcePath": document["sourcePath"],
                "sourceUrl": f"{document['sourceUrl']}#{anchor}" if anchor != "overview" else document["sourceUrl"],
                "commit": document["commit"],
                "category": document["category"],
            })

    registry_catalog = []
    with (root / "registry" / "servers-latest.jsonl").open(encoding="utf-8") as source:
        for line in source:
            record = json.loads(line)
            server = record.get("server", {})
            registry_meta = record.get("_meta", {}).get("io.modelcontextprotocol.registry/official", {})
            packages = server.get("packages") or []
            remotes = server.get("remotes") or []
            repository_url = (server.get("repository") or {}).get("url")
            registry_key = f"{server.get('name', 'server')}:{server.get('version', '')}"
            registry_digest = hashlib.sha1(
                registry_key.encode("utf-8"), usedforsecurity=False
            ).hexdigest()[:10]
            item = {
                "id": f"{slugify(server.get('name', 'server'), 125)}-{registry_digest}",
                "name": server.get("name", "Unknown server"),
                "title": server.get("title") or server.get("name", "Unknown server"),
                "description": server.get("description") or "No description provided.",
                "version": server.get("version"),
                "repositoryUrl": repository_url,
                "websiteUrl": server.get("websiteUrl"),
                "packages": [{"type": package.get("registryType"), "identifier": package.get("identifier"), "transport": (package.get("transport") or {}).get("type")} for package in packages],
                "remotes": [{"type": remote.get("type"), "url": remote.get("url")} for remote in remotes],
                "updatedAt": registry_meta.get("updatedAt"),
            }
            registry_catalog.append(item)
            registry_text = compact_spaces(" ".join(filter(None, [item["name"], item["title"], item["description"], repository_url or "", " ".join(str(package.get("identifier") or "") for package in packages)])))
            retrieval_chunks.append({
                "id": f"registry:{item['id']}",
                "documentId": f"registry:{item['id']}",
                "title": item["title"],
                "heading": "Registry entry",
                "text": registry_text,
                "authority": "community",
                "repository": None,
                "sourcePath": item["name"],
                "sourceUrl": repository_url or item["websiteUrl"] or "https://registry.modelcontextprotocol.io/",
                "commit": None,
                "category": "Registry server",
            })

    registry_catalog.sort(key=lambda item: item["title"].casefold())
    stats = {
        "generatedAt": generated_at,
        "documents": len(catalog),
        "retrievalChunks": len(retrieval_chunks),
        "registryServers": len(registry_catalog),
        "repositories": len({item["repository"] for item in catalog}),
        "categories": dict(sorted(category_counts.items())),
        "authorities": dict(sorted(authority_counts.items())),
    }
    graph = build_graph()
    (app_public / "documents.json").write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (app_public / "registry.json").write_text(json.dumps(registry_catalog, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (app_public / "graph.json").write_text(json.dumps(graph, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (app_public / "stats.json").write_text(json.dumps(stats, indent=2) + "\n", encoding="utf-8")
    with (app_server_data / "retrieval-chunks.jsonl").open("w", encoding="utf-8") as output:
        for chunk in retrieval_chunks:
            output.write(json.dumps(chunk, ensure_ascii=False, separators=(",", ":")) + "\n")
    build_curated_vault(vault, concept_sources, stats)
    manifest_dir = vault / "_manifests"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    (manifest_dir / "generation-summary.json").write_text(json.dumps(stats, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(stats, indent=2))


if __name__ == "__main__":
    main()
