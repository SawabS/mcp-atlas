#!/usr/bin/env python3
"""Create file-level provenance metadata for downstream indexing and ingestion."""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


TEXT_SUFFIXES = {
    ".c", ".cc", ".cpp", ".cs", ".css", ".go", ".h", ".html", ".java",
    ".js", ".json", ".jsx", ".kt", ".md", ".mdx", ".proto", ".py", ".rb",
    ".rs", ".rst", ".sh", ".sql", ".toml", ".ts", ".tsx", ".txt", ".xml",
    ".yaml", ".yml",
}
EXCLUDED_PARTS = {".git", "node_modules", "dist", "build", ".next", "coverage"}


def digest(path: Path) -> str:
    hasher = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            hasher.update(block)
    return f"sha256:{hasher.hexdigest()}"


def repository_commit(path: Path) -> str | None:
    try:
        return subprocess.check_output(
            ["git", "-C", str(path), "rev-parse", "HEAD"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except subprocess.CalledProcessError:
        return None


def authority_for(repository: str) -> str:
    if repository == "modelcontextprotocol/modelcontextprotocol":
        return "official-core"
    if repository.endswith("-sdk") or repository.split("/")[-1] in {"python-sdk", "typescript-sdk"}:
        return "official-sdk"
    if repository.split("/")[-1] in {"servers", "quickstart-resources"}:
        return "official-server"
    return "official-tooling"


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: build_source_manifest.py CORPUS_ROOT")

    root = Path(sys.argv[1]).resolve()
    retrieved_at = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    repository_metadata = {
        item["name"]: item
        for item in json.loads(
            (root / "manifests" / "official-repositories.json").read_text(encoding="utf-8")
        )
    }
    output_path = root / "manifests" / "source-files.jsonl"
    temporary_path = output_path.with_suffix(output_path.suffix + ".part")
    count = 0

    with temporary_path.open("w", encoding="utf-8") as output:
        for path in sorted((root / "website").glob("*")):
            if path.is_file():
                record = {
                    "authority": "official-core",
                    "source_type": "website",
                    "repository": None,
                    "path": str(path.relative_to(root)),
                    "commit": None,
                    "retrieved_at": retrieved_at,
                    "spec_version": None,
                    "license": None,
                    "content_hash": digest(path),
                    "bytes": path.stat().st_size,
                }
                output.write(json.dumps(record, ensure_ascii=False, separators=(",", ":")) + "\n")
                count += 1

        repos_root = root / "official-repos"
        for repo_path in sorted(repos_root.iterdir()):
            if not (repo_path / ".git").is_dir():
                continue
            repository = f"modelcontextprotocol/{repo_path.name}"
            metadata = repository_metadata.get(repo_path.name, {})
            commit = repository_commit(repo_path)
            for path in sorted(repo_path.rglob("*")):
                if (
                    not path.is_file()
                    or path.suffix.lower() not in TEXT_SUFFIXES
                    or any(part in EXCLUDED_PARTS for part in path.parts)
                ):
                    continue
                record = {
                    "authority": authority_for(repository),
                    "source_type": "github",
                    "repository": repository,
                    "path": str(path.relative_to(repo_path)),
                    "commit": commit,
                    "retrieved_at": retrieved_at,
                    "spec_version": None,
                    "license": metadata.get("license"),
                    "content_hash": digest(path),
                    "bytes": path.stat().st_size,
                }
                output.write(json.dumps(record, ensure_ascii=False, separators=(",", ":")) + "\n")
                count += 1

        registry_ingestion_files = {
            root / "registry" / "openapi.yaml",
            root / "registry" / "servers-latest.jsonl",
            root / "registry" / "summary.json",
        }
        for path in sorted(registry_ingestion_files):
            if path.is_file():
                record = {
                    "authority": "community",
                    "source_type": "registry",
                    "repository": None,
                    "path": str(path.relative_to(root)),
                    "commit": None,
                    "retrieved_at": retrieved_at,
                    "spec_version": None,
                    "license": None,
                    "content_hash": digest(path),
                    "bytes": path.stat().st_size,
                }
                output.write(json.dumps(record, ensure_ascii=False, separators=(",", ":")) + "\n")
                count += 1

    temporary_path.replace(output_path)
    summary = {
        "generatedAt": retrieved_at,
        "sourceFiles": count,
        "manifest": "manifests/source-files.jsonl",
    }
    (root / "manifests" / "corpus-summary.json").write_text(
        json.dumps(summary, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Indexed {count} source files in {output_path}")


if __name__ == "__main__":
    main()
