# MCP Atlas

MCP Atlas is a source-first knowledge base for the Model Context Protocol. It combines a reproducible mirror of official MCP material, an Obsidian-compatible vault, a browser application, an active server catalogue, a concept graph, and a grounded AI guide with exact source links.

Everything for the project lives inside this `mcp-knowledge/` directory.

## What is included

- 42 official MCP repositories pinned to exact commits
- 1,114 browsable knowledge documents
- 29,239 deduplicated retrieval chunks
- 19,638 active MCP Registry server records
- 16 connected protocol concepts, with a full 1,130-node note graph
- Commit-pinned GitHub links for official source citations
- A generated Obsidian vault with maps, concepts, Canvas, and Bases
- A responsive Next.js web app with search, reader, constellation graph, Registry, and chat views
- Dark and light themes, mobile navigation, and a resizable grounded chat drawer

Current counts are generated in `app/public/data/stats.json` and may change after a corpus refresh.

## Project layout

```text
mcp-knowledge/
├── app/                     # Next.js web application and browser data
├── vault/                   # Obsidian-compatible presentation vault
│   ├── 00 Home/
│   ├── 20 Concepts/
│   ├── 50 Registry/
│   ├── 80 Maps/
│   └── Sources/             # generated source notes
├── official-repos/          # canonical official repository mirrors
├── website/                 # official website text snapshots
├── registry/                # official Registry snapshots
├── manifests/               # provenance, commits, hashes, and counts
├── scripts/                 # sync, generation, and validation tools
└── docs/                    # architecture and hosting guidance
```

The source mirror and presentation layers stay separate. Refreshing generated content does not overwrite curated concept notes and maps.

## Run the web app

Prerequisites are Node.js 20 or newer, npm, and Python 3.

```bash
cd app
npm install
npm run dev
```

Open `http://localhost:3000`.

For the grounded chat, copy `.env.example` to `.env` at the project root and add at least one server-side API key. The app also accepts the existing legacy variable names listed in `app/src/lib/models.ts`. API keys are read only by the server route and are never included in browser assets.

## Refresh generated knowledge

After the canonical corpus has been synchronized:

```bash
cd app
npm run assets
npm run verify:data
```

`assets` rebuilds the vault, browser documents, graph, Registry catalogue, and retrieval index. `verify:data` checks counts, unique IDs, exact commit links, and corresponding source files.

To refresh the upstream corpus first:

```bash
chmod +x scripts/sync-mcp-corpus.sh
./scripts/sync-mcp-corpus.sh
```

The synchronizer downloads text and metadata. It never installs or executes collected packages.

## Quality checks

```bash
cd app
npm run verify:data
npm run typecheck
npm run lint
npm run build
npm run build:pages
npm audit
```

### Retrieval quality

Grounded answers are only as good as what is retrieved for them, so the ranker
has its own evaluation over a fixed set of questions.

```bash
cd app
npm run eval:retrieval              # hit@1, hit@3 and hit@8
npm run eval:retrieval -- --detail  # the top result for each question
npm run eval:retrieval -- --sweep   # grid search the ranking weights
```

## Hosting

For the complete application, including the private model key and `/api/chat`, deploy `app/` to a Node.js or Vercel environment and configure `NVIDIA_NEMOTRON_API_KEY`.

GitHub Pages can host the static explorer. The included workflow builds `app/out`. Because GitHub Pages cannot keep API secrets, its chat panel must call a separately hosted backend through `NEXT_PUBLIC_CHAT_API_URL`. Set `CHAT_API_URL` as a GitHub repository variable and restrict the backend with `ALLOWED_ORIGIN`.

Detailed data flow, security boundaries, and publishing options are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The model boundary, streaming event contract, citation validation, and operational AI engineering are documented in [docs/AI-ENGINEERING.md](docs/AI-ENGINEERING.md).

## Source policy

Retrieval favors the current specification, then official core documentation, SDK documentation and examples, reference servers, official tooling, and finally active Registry metadata. Repeated text is deduplicated by normalized content hash.

How a question becomes a cited answer, from corpus build through BM25F ranking to the citation links, is documented in [docs/RETRIEVAL.md](docs/RETRIEVAL.md).

Registry records are treated as untrusted metadata. Deleted Registry records remain only in audit snapshots and do not enter the default catalogue or retrieval index.
