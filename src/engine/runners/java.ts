import type { CodingChallenge } from "../types";
import type { RunResult } from "../coding";
import { RUN_LIMIT_MS, cleanJavaCompileLog, javaProgram, parseHarnessOutput } from "../coding-langs";

/**
 * Java runs in a hidden same-origin frame (public/runners/java.html) that loads CheerpJ, a Java 8 JVM
 * compiled to WebAssembly, and compiles with the Eclipse compiler (ECJ) served from /runners. A frame,
 * not a worker, because CheerpJ needs a document; removing the frame is how a runaway program is stopped.
 */
const FRAME_URL = "/runners/java.html";

type Msg = { source: "cq-java"; type: "ready" } | { source: "cq-java"; type: "fail"; error: string } | { source: "cq-java"; type: "result"; id: number; output?: string | null; compileError?: string; crash?: string };

let current: { frame: HTMLIFrameElement; ready: Promise<void> } | null = null;
let seq = 0;

function start() {
  const frame = document.createElement("iframe");
  frame.src = FRAME_URL;
  frame.title = "Java runner";
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.style.cssText = "position:fixed;width:1px;height:1px;left:-10px;top:-10px;border:0;opacity:0;pointer-events:none";
  const ready = new Promise<void>((resolve, reject) => {
    const onMsg = (e: MessageEvent<Msg>) => {
      if (e.source !== frame.contentWindow || e.data?.source !== "cq-java") return;
      if (e.data.type === "ready") resolve();
      else if (e.data.type === "fail") reject(new Error(e.data.error));
      else return;
      window.removeEventListener("message", onMsg);
    };
    window.addEventListener("message", onMsg);
    setTimeout(() => reject(new Error("Java took more than 90 seconds to download.")), 90_000);
  });
  document.body.appendChild(frame);
  return { frame, ready };
}

function stop() {
  current?.frame.remove();
  current = null;
}

export function warmJava(): Promise<void> {
  if (!current) current = start();
  const p = current.ready;
  p.catch(() => stop());
  return p;
}

export async function runJava(c: CodingChallenge, code: string, onStatus: (s: string) => void): Promise<RunResult & { unavailable?: boolean }> {
  onStatus("Loading the Java runtime (first run downloads about 20 MB)…");
  try {
    await warmJava();
  } catch (e) {
    return { unavailable: true, error: `Java couldn't load in this browser: ${(e as Error).message}. Check your connection, or try a desktop browser.`, logs: [], results: [] };
  }
  onStatus("Compiling and running (the first compile takes a few seconds)…");
  const { frame } = current!;
  const id = ++seq;
  const source = javaProgram(c, code);
  return new Promise((resolve) => {
    const limit = RUN_LIMIT_MS.java;
    const timer = setTimeout(() => {
      window.removeEventListener("message", onMsg);
      stop();
      resolve({ timedOut: true, error: `Your code ran for more than ${limit / 1000} seconds and was stopped. Is there an infinite loop?`, logs: [], results: [] });
    }, limit);
    const onMsg = (e: MessageEvent<Msg>) => {
      const m = e.data;
      if (e.source !== frame.contentWindow || m?.source !== "cq-java" || m.type !== "result" || m.id !== id) return;
      clearTimeout(timer);
      window.removeEventListener("message", onMsg);
      if (m.compileError) resolve({ error: `Compile error:\n${cleanJavaCompileLog(m.compileError)}`, logs: [], results: [] });
      else if (m.output) {
        try {
          resolve(parseHarnessOutput(c, m.output));
        } catch {
          resolve({ error: "The program ended without reporting results. Did it call System.exit?", logs: [], results: [] });
        }
      } else resolve({ error: m.crash ?? "The program ended without reporting results. Did it call System.exit?", logs: [], results: [] });
    };
    window.addEventListener("message", onMsg);
    frame.contentWindow?.postMessage({ target: "cq-java", id, source }, location.origin);
  });
}
