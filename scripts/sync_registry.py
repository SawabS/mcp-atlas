#!/usr/bin/env python3
"""Mirror the cursor-paginated official MCP Registry without executing packages."""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://registry.modelcontextprotocol.io/v0.1/servers"
STATUS_KEY = "io.modelcontextprotocol.registry/official"


def fetch_page(url: str) -> dict:
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "mcp-knowledge-corpus/1.0",
        },
    )
    for attempt in range(5):
        try:
            with urlopen(request, timeout=90) as response:
                return json.load(response)
        except (HTTPError, URLError, TimeoutError) as error:
            if attempt == 4:
                raise RuntimeError(f"Registry request failed: {url}: {error}") from error
            time.sleep(2**attempt)
    raise AssertionError("unreachable")


def status_of(record: dict) -> str | None:
    return record.get("_meta", {}).get(STATUS_KEY, {}).get("status")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: sync_registry.py REGISTRY_DIRECTORY")

    registry_dir = Path(sys.argv[1])
    pages_dir = registry_dir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    active_path = registry_dir / "servers-latest.jsonl"
    all_path = registry_dir / "servers-all-latest.jsonl"
    active_part = active_path.with_suffix(active_path.suffix + ".part")
    all_part = all_path.with_suffix(all_path.suffix + ".part")

    cursor = None
    page_number = 1
    total_count = 0
    active_count = 0

    with active_part.open("w", encoding="utf-8") as active_output, all_part.open(
        "w", encoding="utf-8"
    ) as all_output:
        while True:
            parameters = {
                "limit": 100,
                "version": "latest",
                "include_deleted": "true",
            }
            if cursor:
                parameters["cursor"] = cursor

            url = f"{BASE_URL}?{urlencode(parameters)}"
            page = fetch_page(url)
            records = page.get("servers", [])

            page_path = pages_dir / f"page-{page_number:05d}.json"
            page_part = page_path.with_suffix(page_path.suffix + ".part")
            page_part.write_text(
                json.dumps(page, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            page_part.replace(page_path)

            for record in records:
                line = json.dumps(record, ensure_ascii=False, separators=(",", ":")) + "\n"
                all_output.write(line)
                if status_of(record) != "deleted":
                    active_output.write(line)
                    active_count += 1

            total_count += len(records)
            cursor = page.get("metadata", {}).get("nextCursor")
            print(
                f"Registry page {page_number}: {len(records)} records; "
                f"total={total_count}; active={active_count}"
            )
            if not cursor:
                break
            page_number += 1

    active_part.replace(active_path)
    all_part.replace(all_path)

    # Remove stale page files left over if the Registry has shrunk.
    for stale_page in pages_dir.glob("page-*.json"):
        if int(stale_page.stem.split("-")[-1]) > page_number:
            stale_page.unlink()

    summary = {
        "pages": page_number,
        "recordsTotal": total_count,
        "recordsActive": active_count,
        "recordsDeleted": total_count - active_count,
    }
    (registry_dir / "summary.json").write_text(
        json.dumps(summary, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Saved {active_count} active Registry records to {active_path}")


if __name__ == "__main__":
    main()
