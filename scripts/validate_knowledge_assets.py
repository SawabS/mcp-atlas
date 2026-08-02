#!/usr/bin/env python3
"""Validate generated knowledge, provenance, and retrieval assets."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DATA = ROOT / "app" / "public" / "data"
RETRIEVAL_INDEX = ROOT / "app" / "data" / "retrieval-chunks.jsonl"


def load_json(path: Path):
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def fail(message: str) -> None:
    raise SystemExit(f"Validation failed: {message}")


def main() -> None:
    stats = load_json(PUBLIC_DATA / "stats.json")
    documents = load_json(PUBLIC_DATA / "documents.json")
    registry = load_json(PUBLIC_DATA / "registry.json")
    graph = load_json(PUBLIC_DATA / "graph.json")

    if len(documents) != stats["documents"]:
        fail("document count differs from stats.json")
    if len(registry) != stats["registryServers"]:
        fail("registry count differs from stats.json")
    if not graph.get("nodes") or not graph.get("edges"):
        fail("concept graph is empty")

    document_ids: set[str] = set()
    for document in documents:
        document_id = document.get("id")
        if not document_id or document_id in document_ids:
            fail(f"missing or duplicate document id: {document_id}")
        document_ids.add(document_id)

        source_url = document.get("sourceUrl", "")
        commit = document.get("commit")
        if commit and f"/blob/{commit}/" not in source_url:
            fail(f"source URL is not commit pinned: {document_id}")

        body_path = PUBLIC_DATA / "documents" / f"{document_id}.json"
        if not body_path.is_file():
            fail(f"missing browser document: {body_path.relative_to(ROOT)}")

        vault_path = ROOT / "vault" / document["vaultPath"]
        if not vault_path.is_file():
            fail(f"missing vault note: {vault_path.relative_to(ROOT)}")

    chunk_count = 0
    seen_chunks: set[str] = set()
    with RETRIEVAL_INDEX.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            chunk = json.loads(line)
            chunk_id = chunk.get("id")
            if not chunk_id or chunk_id in seen_chunks:
                fail(f"missing or duplicate chunk id on line {line_number}")
            seen_chunks.add(chunk_id)
            chunk_count += 1

            source_url = chunk.get("sourceUrl", "")
            commit = chunk.get("commit")
            if commit and f"/blob/{commit}/" not in source_url:
                fail(f"chunk source URL is not commit pinned: {chunk_id}")

    if chunk_count != stats["retrievalChunks"]:
        fail("retrieval chunk count differs from stats.json")

    print(
        "Validated "
        f"{len(documents):,} documents, "
        f"{chunk_count:,} retrieval chunks, "
        f"{len(registry):,} active servers, and "
        f"{len(graph['nodes']):,} concepts."
    )


if __name__ == "__main__":
    main()
