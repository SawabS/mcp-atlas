#!/usr/bin/env python3
"""Download a stable manifest of public repositories in the official MCP organization."""

from __future__ import annotations

import json
import os
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


API_URL = "https://api.github.com/orgs/modelcontextprotocol/repos"


def fetch_json(url: str) -> list[dict]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "mcp-knowledge-corpus/1.0",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    for attempt in range(5):
        try:
            with urlopen(Request(url, headers=headers), timeout=60) as response:
                return json.load(response)
        except (HTTPError, URLError, TimeoutError) as error:
            if attempt == 4:
                raise RuntimeError(f"GitHub API request failed: {url}: {error}") from error
            time.sleep(2**attempt)
    raise AssertionError("unreachable")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: sync_github_manifest.py OUTPUT.json")

    output_path = Path(sys.argv[1])
    repositories: list[dict] = []
    page = 1

    while True:
        url = f"{API_URL}?type=public&sort=full_name&per_page=100&page={page}"
        response = fetch_json(url)
        if not response:
            break
        repositories.extend(response)
        if len(response) < 100:
            break
        page += 1

    manifest = [
        {
            "nameWithOwner": item["full_name"],
            "name": item["name"],
            "url": item["html_url"],
            "cloneUrl": item["clone_url"],
            "description": item.get("description"),
            "isArchived": item["archived"],
            "isFork": item["fork"],
            "defaultBranch": item.get("default_branch"),
            "updatedAt": item["updated_at"],
            "license": (item.get("license") or {}).get("spdx_id"),
        }
        for item in repositories
    ]
    manifest.sort(key=lambda item: item["nameWithOwner"].casefold())

    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = output_path.with_suffix(output_path.suffix + ".part")
    temporary_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary_path.replace(output_path)
    print(f"Saved {len(manifest)} official repository records to {output_path}")


if __name__ == "__main__":
    main()
