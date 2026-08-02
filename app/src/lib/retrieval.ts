import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import type { RetrievalChunk, RetrievedSource } from "@/lib/knowledge-types";

const STOP_WORDS = new Set([
  "a", "about", "an", "and", "are", "as", "at", "be", "by", "can", "do",
  "does", "for", "from", "how", "i", "in", "is", "it", "mcp", "me", "of", "on",
  "or", "that", "the", "this", "to", "what", "when", "where", "which", "with",
]);

type IndexedChunk = RetrievalChunk & {
  searchableText: string;
  searchableTitle: string;
  searchableHeading: string;
  searchablePath: string;
};

let cachedChunks: IndexedChunk[] | undefined;

function loadChunks(): IndexedChunk[] {
  if (cachedChunks) {
    return cachedChunks;
  }
  const filePath = path.join(process.cwd(), "data", "retrieval-chunks.jsonl");
  cachedChunks = readFileSync(filePath, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const chunk = JSON.parse(line) as RetrievalChunk;
      return {
        ...chunk,
        searchableText: chunk.text.toLowerCase(),
        searchableTitle: chunk.title.toLowerCase(),
        searchableHeading: chunk.heading.toLowerCase(),
        searchablePath: chunk.sourcePath.toLowerCase(),
      };
    });
  return cachedChunks;
}

function tokenize(query: string): string[] {
  const values = query.toLowerCase().match(/[a-z0-9][a-z0-9._/-]*/g) ?? [];
  return [...new Set(values.filter((value) => value.length > 1 && !STOP_WORDS.has(value)))].slice(0, 14);
}

function occurrences(text: string, term: string): number {
  let count = 0;
  let position = text.indexOf(term);
  while (position !== -1 && count < 4) {
    count += 1;
    position = text.indexOf(term, position + term.length);
  }
  return count;
}

function authorityBoost(authority: string): number {
  if (authority === "official-core") return 4;
  if (authority === "official-sdk") return 2.5;
  if (authority === "official-server") return 1.5;
  return 0;
}

function freshnessBoost(sourcePath: string): number {
  if (sourcePath.includes("2026-07-28")) return 3;
  if (sourcePath.includes("/draft/")) return 1.5;
  if (/\/202[0-5]-\d{2}-\d{2}\//.test(sourcePath)) return -2;
  return 0;
}

function categoryBoost(category: string): number {
  if (category === "Specification") return 8;
  if (category === "Core documentation") return 4;
  if (category === "SDKs") return 2;
  if (category === "Registry server") return -2;
  return 0;
}

export function retrieve(query: string, limit = 8): RetrievedSource[] {
  const chunks = loadChunks();
  const normalizedQuery = query.trim().toLowerCase();
  const terms = tokenize(query);
  if (!terms.length) {
    return [];
  }

  const scored: Array<{ chunk: IndexedChunk; score: number }> = [];
  for (const chunk of chunks) {
    let score = authorityBoost(chunk.authority) + freshnessBoost(chunk.sourcePath) + categoryBoost(chunk.category);
    if (normalizedQuery.length > 4) {
      if (chunk.searchableTitle.includes(normalizedQuery)) score += 24;
      if (chunk.searchableHeading.includes(normalizedQuery)) score += 18;
      if (chunk.searchableText.includes(normalizedQuery)) score += 9;
    }
    let matchedTerms = 0;
    for (const term of terms) {
      let matched = false;
      if (chunk.searchableTitle.includes(term)) {
        score += 9;
        matched = true;
      }
      if (chunk.searchableHeading.includes(term)) {
        score += 6;
        matched = true;
      }
      if (chunk.searchablePath.includes(term)) {
        score += 4;
        matched = true;
      }
      const count = occurrences(chunk.searchableText, term);
      if (count) {
        score += Math.min(count, 3) * 1.4;
        matched = true;
      }
      if (matched) matchedTerms += 1;
    }
    if (matchedTerms === terms.length && terms.length > 1) score += 6;
    if (matchedTerms > 0 && score > 2) scored.push({ chunk, score });
  }

  scored.sort((left, right) => right.score - left.score);
  const selected: RetrievedSource[] = [];
  const perDocument = new Map<string, number>();
  const communityLimit = normalizedQuery.includes("registry") || terms.some((term) => term.includes("/") || term.includes(".")) ? 4 : 1;
  let communityCount = 0;
  for (const item of scored) {
    const count = perDocument.get(item.chunk.documentId) ?? 0;
    if (count >= 2) continue;
    if (item.chunk.authority === "community" && communityCount >= communityLimit) continue;
    selected.push({ ...item.chunk, rank: selected.length + 1, score: Number(item.score.toFixed(2)) });
    perDocument.set(item.chunk.documentId, count + 1);
    if (item.chunk.authority === "community") communityCount += 1;
    if (selected.length >= limit) break;
  }
  return selected;
}

export function formatContext(sources: RetrievedSource[]): string {
  return sources
    .map((source) => {
      const label = `S${source.rank}`;
      return `<source id="${label}">\nTitle: ${source.title}\nHeading: ${source.heading}\nAuthority: ${source.authority}\nRepository: ${source.repository ?? "MCP Registry"}\nPath: ${source.sourcePath}\nPermalink: ${source.sourceUrl}\nContent:\n${source.text}\n</source>`;
    })
    .join("\n\n");
}
