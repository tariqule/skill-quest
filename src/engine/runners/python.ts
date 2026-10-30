import type { CodingChallenge } from "../types";
import type { RunResult } from "../coding";
import { PY_HARNESS, RUN_LIMIT_MS, parseHarnessOutput } from "../coding-langs";

/** Pyodide (CPython compiled to WebAssembly, MPL-2.0), loaded from jsDelivr the first time Python runs. */
export const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/";

const WORKER_SOURCE = `
let py = null;
self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === "init") {
    try {
      importScripts(m.base + "pyodide.js");
      py = await loadPyodide({ indexURL: m.base });
      py.runPython(m.harness);
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "fail", error: String((err && err.message) || err) });
    }
    return;
  }
  try {
    const out = py.globals.get("__cq_run")(m.code, m.fn, m.tests);
    self.postMessage({ type: "result", id: m.id, output: out });
  } catch (err) {
    self.postMessage({ type: "result", id: m.id, crash: String((err && err.message) || err) });
  }
};`;

type Msg = { type: "ready" } | { type: "fail"; error: string } | { type: "result"; id: number; output?: string; crash?: string };

let current: { worker: Worker; ready: Promise<void> } | null = null;
let seq = 0;

function start(): { worker: Worker; ready: Promise<void> } {
  const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  const ready = new Promise<void>((resolve, reject) => {
    const onMsg = (e: MessageEvent<Msg>) => {
      if (e.data.type === "ready") resolve();
      else if (e.data.type === "fail") reject(new Error(e.data.error));
      else return;
      worker.removeEventListener("message", onMsg);
    };
    worker.addEventListener("message", onMsg);
    worker.addEventListener("error", (e) => reject(new Error(e.message || "The Python worker failed to start.")), { once: true });
    setTimeout(() => reject(new Error("Python took more than 90 seconds to download.")), 90_000);
  });
  worker.postMessage({ type: "init", base: PYODIDE_BASE, harness: PY_HARNESS });
  return { worker, ready };
}

function stop() {
  current?.worker.terminate();
  current = null;
}

/** Starts downloading Python in the background (for example when the exercise page opens). */
export function warmPython(): Promise<void> {
  if (!current) current = start();
  const p = current.ready;
  p.catch(() => stop());
  return p;
}

export async function runPython(c: CodingChallenge, code: string, onStatus: (s: string) => void): Promise<RunResult & { unavailable?: boolean }> {
  onStatus("Loading Python (first run downloads about 10 MB)…");
  try {
    await warmPython();
  } catch (e) {
    return { unavailable: true, error: `Python couldn't load in this browser: ${(e as Error).message}. Check your connection and try again.`, logs: [], results: [] };
  }
  onStatus("Running…");
  const { worker } = current!;
  const id = ++seq;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      worker.removeEventListener("message", onMsg);
      stop(); // the only way to stop a runaway loop; the next run starts a fresh interpreter
      resolve({ timedOut: true, error: `Your code ran for more than ${RUN_LIMIT_MS.python / 1000} seconds and was stopped. Is there an infinite loop?`, logs: [], results: [] });
    }, RUN_LIMIT_MS.python);
    const onMsg = (e: MessageEvent<Msg>) => {
      const m = e.data;
      if (m.type !== "result" || m.id !== id) return;
      clearTimeout(timer);
      worker.removeEventListener("message", onMsg);
      if (m.crash || !m.output) resolve({ error: m.crash ?? "Python stopped unexpectedly.", logs: [], results: [] });
      else resolve(parseHarnessOutput(c, m.output));
    };
    worker.addEventListener("message", onMsg);
    worker.postMessage({ type: "run", id, code, fn: c.fn, tests: JSON.stringify(c.tests) });
  });
}
