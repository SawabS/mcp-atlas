import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import type { RetrievalChunk, RetrievedSource } from "@/lib/knowledge-types";

/*
 * Retrieval is lexical BM25 over an in-process inverted index.
 *
 * The corpus is small enough to index on first use (29k chunks, ~1.3M tokens),
 * so there is no vector store, no network hop and no external service in the
 * answer path. Ranking is Okapi BM25 with field weighting, then a prior that
 * prefers the specification and current material over mirrored registry blurbs.
 *
 * See docs/RETRIEVAL.md for the full walkthrough.
 */

/*
 * Ranking parameters, in one place so they can be swept against the question
 * set in scripts/evaluate-retrieval.ts rather than guessed at.
 *
 * Title, heading and body are scored as three separate BM25 fields rather than
 * concatenated into one stream. A four word page title would otherwise be
 * swamped by body length normalisation, and a chunk heading would carry the
 * same authority as the title of the page it sits on.
 */
export const RANKING = {
  k1: 1.4,
  titleWeight: 2.6,
  headingWeight: 1.4,
  bodyWeight: 1,
  /*
   * Length normalisation per field. Body text gets the usual 0.75. Titles get
   * far less, because a short title is not evidence of relevance: without this
   * a repo README titled "MCP Python SDK" outranks the specification on the
   * question "what is MCP".
   */
  titleB: 0.3,
  headingB: 0.5,
  bodyB: 0.75,
  /** Floor for a chunk matching only part of the question. */
  coverageFloor: 0.65,
  /** How hard the source priors below push against the raw text score. */
  priorScale: 2,
  /** Registry blurbs, unless the question is about the registry itself. */
  registryPenalty: 0.18,
};

/** Structural words only. Domain words like "mcp" are handled by IDF instead. */
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "can", "did",
  "do", "does", "for", "from", "had", "has", "have", "how", "i", "if", "in",
  "into", "is", "it", "its", "me", "my", "not", "of", "on", "or", "our", "so",
  "than", "that", "the", "their", "them", "then", "there", "these", "they",
  "this", "to", "was", "we", "were", "what", "when", "where", "which", "who",
  "why", "will", "with", "would", "you", "your",
]);

/** Registry records only surface when the question is actually about them. */
const REGISTRY_HINTS = ["registry", "server", "servers", "package", "packages", "publish", "catalogue", "catalog"];

type IndexedChunk = RetrievalChunk & {
  searchableText: string;
  searchableTitle: string;
  searchableHeading: string;
};

type Posting = {
  /** Flat quads of chunk index, then title, heading and body frequency. */
  entries: number[];
  documentFrequency: number;
};

type Field = { lengths: Float64Array; average: number; b: () => number };

type Index = {
  chunks: IndexedChunk[];
  title: Field;
  heading: Field;
  body: Field;
  postings: Map<string, Posting>;
};

let cachedIndex: Index | undefined;

/**
 * Splits text the same way for indexing and for querying. Dotted and slashed
 * identifiers such as `tools/call` are kept whole and also split, so both the
 * exact method name and a bare "tools" find it.
 */
function tokenize(value: string): string[] {
  const matches = value.toLowerCase().match(/[a-z0-9][a-z0-9._/-]*/g) ?? [];
  const tokens: string[] = [];
  for (const match of matches) {
    const token = match.replace(/[._/-]+$/, "");
    if (token.length < 2) continue;
    tokens.push(token);
    if (/[._/-]/.test(token)) {
      for (const part of token.split(/[._/-]+/)) {
        if (part.length > 1) tokens.push(part);
      }
    }
  }
  return tokens;
}

function countInto(target: Map<string, number>, tokens: string[]) {
  for (const token of tokens) {
    target.set(token, (target.get(token) ?? 0) + 1);
  }
}

function buildIndex(): Index {
  const filePath = path.join(process.cwd(), "data", "retrieval-chunks.jsonl");
  const chunks: IndexedChunk[] = readFileSync(filePath, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const chunk = JSON.parse(line) as RetrievalChunk;
      return {
        ...chunk,
        searchableText: chunk.text.toLowerCase(),
        searchableTitle: chunk.title.toLowerCase(),
        searchableHeading: chunk.heading.toLowerCase(),
      };
    });

  const postings = new Map<string, Posting>();
  const titleLengths = new Float64Array(chunks.length);
  const headingLengths = new Float64Array(chunks.length);
  const bodyLengths = new Float64Array(chunks.length);
  let titleTotal = 0;
  let headingTotal = 0;
  let bodyTotal = 0;

  const titleCounts = new Map<string, number>();
  const headingCounts = new Map<string, number>();
  const bodyCounts = new Map<string, number>();

  const sum = (counts: Map<string, number>) => {
    let value = 0;
    for (const count of counts.values()) value += count;
    return value;
  };

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    titleCounts.clear();
    headingCounts.clear();
    bodyCounts.clear();
    countInto(titleCounts, tokenize(chunk.title));
    countInto(headingCounts, tokenize(chunk.heading));
    countInto(bodyCounts, tokenize(chunk.text));
    countInto(bodyCounts, tokenize(chunk.sourcePath));

    titleLengths[index] = sum(titleCounts);
    headingLengths[index] = sum(headingCounts);
    bodyLengths[index] = sum(bodyCounts);
    titleTotal += titleLengths[index];
    headingTotal += headingLengths[index];
    bodyTotal += bodyLengths[index];

    for (const token of new Set([...titleCounts.keys(), ...headingCounts.keys(), ...bodyCounts.keys()])) {
      let posting = postings.get(token);
      if (!posting) {
        posting = { entries: [], documentFrequency: 0 };
        postings.set(token, posting);
      }
      posting.entries.push(
        index,
        titleCounts.get(token) ?? 0,
        headingCounts.get(token) ?? 0,
        bodyCounts.get(token) ?? 0,
      );
      posting.documentFrequency += 1;
    }
  }

  const size = Math.max(1, chunks.length);
  return {
    chunks,
    title: { lengths: titleLengths, average: Math.max(1, titleTotal / size), b: () => RANKING.titleB },
    heading: { lengths: headingLengths, average: Math.max(1, headingTotal / size), b: () => RANKING.headingB },
    body: { lengths: bodyLengths, average: Math.max(1, bodyTotal / size), b: () => RANKING.bodyB },
    postings,
  };
}

function getIndex(): Index {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

/** Query terms, keeping stop words only when nothing else survives. */
function queryTerms(query: string): string[] {
  const tokens = [...new Set(tokenize(query))];
  const meaningful = tokens.filter((token) => !STOP_WORDS.has(token));
  return (meaningful.length ? meaningful : tokens).slice(0, 18);
}

function authorityWeight(authority: string): number {
  if (authority === "official-core") return 0.34;
  if (authority === "official-sdk") return 0.2;
  if (authority === "official-server") return 0.14;
  if (authority === "official-tooling") return 0.08;
  return 0;
}

function categoryWeight(category: string): number {
  if (category === "Specification") return 0.5;
  if (category === "Core documentation") return 0.3;
  if (category === "SDKs") return 0.16;
  if (category === "Extensions") return 0.12;
  if (category === "Reference servers") return 0.1;
  return 0;
}

function freshnessWeight(sourcePath: string): number {
  if (sourcePath.includes("2026-07-28")) return 0.3;
  if (sourcePath.includes("/draft/")) return 0.1;
  if (/\/202[0-5]-\d{2}-\d{2}\//.test(sourcePath)) return -0.4;
  return 0;
}

/**
 * Demotes material that is about the protocol rather than part of it, matching
 * the source policy: specification first, then core documentation, SDKs,
 * reference servers and tooling.
 *
 * Repository housekeeping has short generic titles stuffed with common terms,
 * and proposals and blog posts describe changes that may never have shipped.
 * Both punch well above their usefulness on a question like "what is MCP".
 */
function provenanceWeight(sourcePath: string): number {
  if (/(^|\/)(readme|claude|agents|contributing|changelog|license|code_of_conduct|security)\.mdx?$/i.test(sourcePath)) {
    return -0.55;
  }
  if (/(^|\/)seps\//i.test(sourcePath)) return -0.4;
  if (/(^|\/)blog\//i.test(sourcePath)) return -0.4;
  if (/(^|\/)index\.mdx?$/i.test(sourcePath) && !sourcePath.includes("specification/")) return -0.2;
  return 0;
}

/** Saturating BM25 term score for one field of one chunk. */
function fieldScore(frequency: number, field: Field, chunk: number): number {
  if (!frequency) return 0;
  const b = field.b();
  const norm = 1 - b + (b * field.lengths[chunk]) / field.average;
  return (frequency * (RANKING.k1 + 1)) / (frequency + RANKING.k1 * norm);
}

export function retrieve(query: string, limit = 8): RetrievedSource[] {
  const index = getIndex();
  const terms = queryTerms(query);
  if (!terms.length) return [];

  const total = index.chunks.length;
  const scores = new Float64Array(total);
  const matched = new Int32Array(total);
  const touched: number[] = [];

  for (const term of terms) {
    const posting = index.postings.get(term);
    if (!posting) continue;
    // Terms that appear almost everywhere, "mcp" among them, earn a low weight
    // here rather than being removed by hand.
    const idf = Math.log(1 + (total - posting.documentFrequency + 0.5) / (posting.documentFrequency + 0.5));
    const { entries } = posting;
    for (let i = 0; i < entries.length; i += 4) {
      const chunk = entries[i];
      const contribution =
        fieldScore(entries[i + 1], index.title, chunk) * RANKING.titleWeight +
        fieldScore(entries[i + 2], index.heading, chunk) * RANKING.headingWeight +
        fieldScore(entries[i + 3], index.body, chunk) * RANKING.bodyWeight;

      if (scores[chunk] === 0) touched.push(chunk);
      scores[chunk] += idf * contribution;
      matched[chunk] += 1;
    }
  }

  if (!touched.length) return [];

  const normalizedQuery = query.trim().toLowerCase();
  const registryQuery = REGISTRY_HINTS.some((hint) => normalizedQuery.includes(hint));

  const ranked: Array<{ chunk: IndexedChunk; score: number }> = [];
  for (const position of touched) {
    const chunk = index.chunks[position];
    let score = scores[position];

    // Covering more of the question beats matching one term many times.
    score *= RANKING.coverageFloor + (1 - RANKING.coverageFloor) * (matched[position] / terms.length);

    // An exact phrase hit is strong evidence the passage is on topic.
    if (normalizedQuery.length > 6) {
      if (chunk.searchableTitle.includes(normalizedQuery)) score *= 1.5;
      else if (chunk.searchableHeading.includes(normalizedQuery)) score *= 1.35;
      else if (chunk.searchableText.includes(normalizedQuery)) score *= 1.2;
    }

    const prior =
      authorityWeight(chunk.authority) +
      categoryWeight(chunk.category) +
      freshnessWeight(chunk.sourcePath) +
      provenanceWeight(chunk.sourcePath);
    score *= Math.max(0.1, 1 + RANKING.priorScale * prior);

    // Two thirds of the corpus is mirrored registry metadata. It answers
    // "which servers exist", never "how does the protocol work".
    if (chunk.authority === "community") score *= registryQuery ? 0.9 : RANKING.registryPenalty;

    ranked.push({ chunk, score });
  }

  ranked.sort((left, right) => right.score - left.score);

  const selected: RetrievedSource[] = [];
  const perDocument = new Map<string, number>();
  const registryLimit = registryQuery ? 4 : 1;
  let registryCount = 0;

  for (const item of ranked) {
    const seen = perDocument.get(item.chunk.documentId) ?? 0;
    if (seen >= 2) continue;
    if (item.chunk.authority === "community") {
      if (registryCount >= registryLimit) continue;
      registryCount += 1;
    }
    selected.push({ ...item.chunk, rank: selected.length + 1, score: Number(item.score.toFixed(3)) });
    perDocument.set(item.chunk.documentId, seen + 1);
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
