# MCP Index web application

This directory contains the browser interface and grounded chat backend for the MCP Index knowledge base.

The interface includes a source-linked home dashboard, searchable library, document reader, active Registry catalogue, and an Obsidian-style interactive graph. A purpose-built canvas renderer draws the deterministic constellation and keeps its camera, adjacency index, and label collision pass outside React. Dark and light themes, responsive navigation, and a resizable grounded chat panel are included.

## Commands

```bash
npm install
npm run assets
npm run verify:data
npm run dev
npm run typecheck
npm run lint
npm run build
npm run build:pages
```

The standard build includes the `/api/chat` route. The Pages build emits static files into `out/` and expects a public backend URL in `NEXT_PUBLIC_CHAT_API_URL` if chat should remain available.

Generated browser data is in `public/data/`. Server-only retrieval chunks are in `data/retrieval-chunks.jsonl`. Source generation and validation scripts remain at the project root in `../scripts/`.

See the root [README](../README.md), [architecture guide](../docs/ARCHITECTURE.md), and [AI engineering guide](../docs/AI-ENGINEERING.md) for setup, provenance, retrieval, model access, citations, and deployment details.
