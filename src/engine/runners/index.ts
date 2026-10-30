import type { CodingChallenge } from "../types";
import { runInWorker, type RunResult } from "../coding";
import { languageOf } from "../coding-langs";

export type LiveRun = RunResult & { unavailable?: boolean };

/** Runs a challenge in the right language. Python and Java load their runtimes on first use. Browser only. */
export async function runChallenge(c: CodingChallenge, code: string, onStatus: (s: string) => void = () => {}): Promise<LiveRun> {
  const lang = languageOf(c);
  if (lang === "python") return (await import("./python")).runPython(c, code, onStatus);
  if (lang === "java") return (await import("./java")).runJava(c, code, onStatus);
  return runInWorker(code, c.fn, c.tests);
}

/** Begins the runtime download in the background so the first Run is quicker. */
export function warmRuntime(c: CodingChallenge) {
  const lang = languageOf(c);
  if (lang === "python") import("./python").then((m) => m.warmPython().catch(() => {}));
  if (lang === "java") import("./java").then((m) => m.warmJava().catch(() => {}));
}
