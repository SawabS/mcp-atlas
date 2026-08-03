/**
 * Retrieval evaluation.
 *
 * Runs a fixed set of questions a user would plausibly ask against the real
 * ranker and reports how often the correct document is retrieved. `expect` is
 * the source path a grounded answer has to be built on, so a plausible but
 * wrong page does not score.
 *
 *   npm run eval:retrieval            report hit@1, hit@3 and hit@8
 *   npm run eval:retrieval -- --detail   show the top result per question
 *   npm run eval:retrieval -- --sweep    grid search the ranking weights
 *
 * Run from `app/`, since the ranker resolves the corpus relative to cwd.
 */
import { registerHooks } from "node:module";

// `server-only` is a Next.js build marker with no Node resolution. Stub it so
// the ranker can be imported unchanged, rather than evaluating a copy of it.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
    return next(specifier, context);
  },
});

const { retrieve, RANKING } = await import("../src/lib/retrieval.ts");

type Case = { question: string; expect: RegExp };

const cases: Case[] = [
  { question: "What is MCP?", expect: /getting-started\/intro|learn\/architecture|specification\/2026-07-28\/(index|architecture)/i },
  { question: "In one sentence, what is the Model Context Protocol?", expect: /getting-started\/intro|learn\/architecture|specification\/2026-07-28\/(index|architecture)/i },
  { question: "How does the initialization handshake work?", expect: /lifecycle|specification\/2026-07-28\/basic\/index/i },
  { question: "What is the difference between tools and resources?", expect: /server\/(tools|resources)|learn\/server-concepts/i },
  { question: "How should I secure a remote MCP server?", expect: /authorization|security|connect-remote-servers/i },
  { question: "What is sampling in MCP?", expect: /client\/sampling|learn\/client-concepts/i },
  { question: "How does elicitation work?", expect: /client\/elicitation/i },
  { question: "What transports does MCP support?", expect: /basic\/transports/i },
  { question: "How do I publish a server to the registry?", expect: /registry\/(quickstart|publish|guides)/i },
  { question: "What does the tools/call method do?", expect: /server\/tools|schema/i },
  { question: "How does capability negotiation work?", expect: /lifecycle|architecture|basic\/index/i },
  { question: "What are roots?", expect: /client\/roots/i },
  { question: "How does OAuth authorization work in MCP?", expect: /authorization|extensions\/auth/i },
  { question: "What is a prompt template?", expect: /server\/prompts/i },
  { question: "How do I build a server with the Python SDK?", expect: /python-sdk|develop\/build-server/i },
  { question: "What is the current protocol revision?", expect: /versioning|specification\/2026-07-28\/index|revision/i },
  { question: "How do progress notifications work?", expect: /patterns\/progress/i },
  { question: "What is argument completion?", expect: /utilities\/completion/i },
  { question: "How are errors reported in MCP?", expect: /schema|error|specification\/2026-07-28\/basic/i },
  { question: "What is the MCP Registry?", expect: /registry\/(faq|about|index|overview)/i },
  { question: "How does pagination work?", expect: /utilities\/pagination/i },
  { question: "What is a resource template?", expect: /server\/resources/i },
  { question: "What is stdio transport?", expect: /transports\/stdio/i },
  { question: "How does streamable HTTP work?", expect: /transports\/streamable-http/i },
  { question: "How do I cancel a request?", expect: /patterns\/cancellation/i },
  { question: "What are resource subscriptions?", expect: /patterns\/subscriptions|server\/resources/i },
];

type Score = { empty: number; hit1: number; hit3: number; hit8: number };

function measure(): Score {
  const score: Score = { empty: 0, hit1: 0, hit3: 0, hit8: 0 };
  for (const item of cases) {
    const results = retrieve(item.question, 8);
    if (!results.length) {
      score.empty += 1;
      continue;
    }
    const hits = results.map((result) => item.expect.test(result.sourcePath));
    if (hits[0]) score.hit1 += 1;
    if (hits.slice(0, 3).some(Boolean)) score.hit3 += 1;
    if (hits.some(Boolean)) score.hit8 += 1;
  }
  return score;
}

function report(label: string, score: Score) {
  const n = cases.length;
  const pct = (value: number) => `${value}/${n} (${Math.round((value / n) * 100)}%)`.padEnd(10);
  console.log(`${label.padEnd(30)} empty ${String(score.empty).padEnd(3)} hit@1 ${pct(score.hit1)} hit@3 ${pct(score.hit3)} hit@8 ${pct(score.hit8)}`);
}

if (process.argv.includes("--sweep")) {
  // Ranked by hit@1, then hit@3, so the top result is what improves first.
  const grid: Array<[number, number, number, number, number]> = [];
  for (const title of [2, 2.6, 3.2, 4]) {
    for (const heading of [0.8, 1.4, 2]) {
      for (const titleB of [0.15, 0.3, 0.5]) {
        for (const coverage of [0.35, 0.5, 0.65]) {
          for (const prior of [1, 1.5, 2, 2.6]) {
            grid.push([title, heading, titleB, coverage, prior]);
          }
        }
      }
    }
  }
  const runs = grid.map(([title, heading, titleB, coverage, prior]) => {
    RANKING.titleWeight = title;
    RANKING.headingWeight = heading;
    RANKING.titleB = titleB;
    RANKING.coverageFloor = coverage;
    RANKING.priorScale = prior;
    return { title, heading, titleB, coverage, prior, score: measure() };
  });
  runs.sort((a, b) => b.score.hit1 - a.score.hit1 || b.score.hit3 - a.score.hit3 || b.score.hit8 - a.score.hit8);
  console.log(`\ntop 15 of ${runs.length} configurations\n`);
  for (const run of runs.slice(0, 15)) {
    report(`title=${run.title} head=${run.heading} tB=${run.titleB} cov=${run.coverage} prior=${run.prior}`, run.score);
  }
} else {
  const start = performance.now();
  const score = measure();
  report("current ranking", score);
  console.log(`\n${cases.length} questions in ${Math.round(performance.now() - start)}ms (index build included)`);

  if (process.argv.includes("--detail")) {
    console.log();
    for (const item of cases) {
      const results = retrieve(item.question, 8);
      const mark = !results.length ? "EMPTY" : item.expect.test(results[0].sourcePath) ? "ok   " : "MISS ";
      console.log(`${mark} ${item.question.slice(0, 50).padEnd(52)} ${results[0]?.sourcePath ?? ""}`);
    }
  }
}
