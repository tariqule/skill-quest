import type { CodingTest } from "./types";

export interface TestResult {
  name: string;
  ok: boolean;
  hidden: boolean;
  /** What the call returned, as text. Hidden tests omit it. */
  got?: string;
  expected?: string;
  args?: string;
  error?: string;
}

export interface RunResult {
  /** The code failed to load, or the function is missing. */
  error?: string;
  /** console.log output from the run (first 60 lines). */
  logs: string[];
  results: TestResult[];
  /** Ran past the time limit and was stopped. */
  timedOut?: boolean;
}

/**
 * The runner, as plain JavaScript text. In the browser it runs inside a Web Worker (so the page
 * stays responsive, can't be touched by the player's code, and can be terminated if the code never
 * ends). `npm test` evaluates the same text in Node to check every reference solution.
 */
export const RUNNER_SOURCE = `
function __show(v) {
  if (v === undefined) return "undefined";
  if (typeof v === "function") return "[Function]";
  if (typeof v === "bigint") return v + "n";
  if (typeof v === "symbol") return String(v);
  try {
    return JSON.stringify(v, (k, x) => (x instanceof Set ? { "Set": [...x] } : x instanceof Map ? { "Map": [...x] } : typeof x === "bigint" ? x + "n" : x === undefined ? "undefined" : Number.isNaN(x) ? "NaN" : x === Infinity ? "Infinity" : x === -Infinity ? "-Infinity" : x));
  } catch (e) { return String(v); }
}
function __eq(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Set || a instanceof Map) return b instanceof a.constructor && __eq([...a], [...b]);
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && __eq(a[k], b[k]));
}
async function __run(code, fn, tests) {
  const logs = [];
  const fmt = (a) => (typeof a === "string" ? a : __show(a));
  const fakeConsole = { log: (...a) => logs.length < 60 && logs.push(a.map(fmt).join(" ")), info: (...a) => logs.length < 60 && logs.push(a.map(fmt).join(" ")), warn: (...a) => logs.length < 60 && logs.push("warn: " + a.map(fmt).join(" ")), error: (...a) => logs.length < 60 && logs.push("error: " + a.map(fmt).join(" ")) };
  let f;
  try {
    f = new Function("console", code + "\\n;return typeof " + fn + " === 'function' ? " + fn + " : undefined;")(fakeConsole);
  } catch (e) {
    return { error: String(e && e.message ? e.name + ": " + e.message : e), logs, results: [] };
  }
  if (!f) return { error: "Define a function named " + fn + ".", logs, results: [] };
  const results = [];
  for (const t of tests) {
    const base = { name: t.name || "test", hidden: !!t.hidden };
    try {
      const args = t.args.map(__clone);
      const out = await f(...args);
      const ok = __eq(out, __revive(t.expected));
      results.push({ ...base, ok, got: t.hidden ? undefined : __show(out), expected: t.hidden ? undefined : __show(__revive(t.expected)), args: t.hidden ? undefined : t.args.map(__show).join(", ") });
    } catch (e) {
      results.push({ ...base, ok: false, error: String(e && e.message ? e.name + ": " + e.message : e), args: t.hidden ? undefined : t.args.map(__show).join(", ") });
    }
  }
  return { logs, results };
}
function __clone(v) { return v === null || typeof v !== "object" ? __revive(v) : __revive(JSON.parse(JSON.stringify(v))); }
function __revive(v) {
  if (Array.isArray(v)) return v.map(__revive);
  if (v && typeof v === "object") {
    if (Object.keys(v).length === 1 && Array.isArray(v.$set)) return new Set(v.$set.map(__revive));
    if (Object.keys(v).length === 1 && Array.isArray(v.$map)) return new Map(v.$map.map(([k, x]) => [__revive(k), __revive(x)]));
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, __revive(x)]));
  }
  if (v === "$undefined") return undefined;
  if (v === "$NaN") return NaN;
  if (v === "$Infinity") return Infinity;
  return v;
}
`;

const WORKER_SOURCE = `${RUNNER_SOURCE}
self.onmessage = async (e) => {
  const { code, fn, tests } = e.data;
  self.postMessage(await __run(code, fn, tests));
};`;

/** Test cases are JSON; use these markers inside `args` / `expected` for values JSON can't hold. */
export const T = {
  undefined: "$undefined",
  nan: "$NaN",
  infinity: "$Infinity",
  set: (items: unknown[]) => ({ $set: items }),
  map: (entries: [unknown, unknown][]) => ({ $map: entries }),
};

const TIME_LIMIT_MS = 3000;

/** Run `code` against `tests` in a sandboxed worker, stopping it after a few seconds. Browser only. */
export function runInWorker(code: string, fn: string, tests: CodingTest[]): Promise<RunResult> {
  return new Promise((resolve) => {
    let worker: Worker;
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
    try {
      worker = new Worker(url);
    } catch {
      URL.revokeObjectURL(url);
      resolve({ error: "This browser can't run code in a sandbox.", logs: [], results: [] });
      return;
    }
    const done = (r: RunResult) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(r);
    };
    const timer = setTimeout(() => done({ timedOut: true, error: "Your code ran for more than 3 seconds and was stopped. Is there an infinite loop?", logs: [], results: [] }), TIME_LIMIT_MS);
    worker.onmessage = (e: MessageEvent<RunResult>) => done(e.data);
    worker.onerror = (e) => done({ error: e.message || "Your code crashed.", logs: [], results: [] });
    worker.postMessage({ code, fn, tests });
  });
}

/** Run in the current JavaScript engine (used by `npm test`; never call this with player code). */
export async function runLocally(code: string, fn: string, tests: CodingTest[]): Promise<RunResult> {
  const run = new Function(`${RUNNER_SOURCE}; return __run;`)() as (c: string, f: string, t: CodingTest[]) => Promise<RunResult>;
  return run(code, fn, tests);
}

/** Summary line for a run. */
export function summarize(r: RunResult) {
  const visible = r.results.filter((t) => !t.hidden);
  const passed = r.results.filter((t) => t.ok).length;
  return { passed, total: r.results.length, allPassed: !r.error && r.results.length > 0 && passed === r.results.length, visible };
}
