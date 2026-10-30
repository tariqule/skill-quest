/**
 * Runs code-game snippets on the real runtimes so Predict the Output, Spot the Bug and Parsons answers
 * are checked by execution, not by eye. Node-only: imported by tests and scripts/run-code-games.ts.
 * A language whose runtime is missing reports "skip" instead of failing.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { applyFix } from "./code-games";
import { normalizeOutput } from "./game";
import type { BugQuestion, OutputQuestion, ParsonsQuestion, Question } from "./types";

export type Runtime = "node" | "ts" | "python" | "go" | "sql" | "bash" | "java";
export type RunResult = { status: "ok"; out: string } | { status: "error"; out: string } | { status: "skip"; reason: string };

const LANG: Record<string, Runtime> = {
  js: "node", javascript: "node", ts: "ts", typescript: "ts", tsx: "ts", jsx: "ts",
  python: "python", py: "python", go: "go", sql: "sql", bash: "bash", sh: "bash", shell: "bash", git: "bash", java: "java",
};

export function runtimeFor(lang: string | undefined): Runtime | null {
  return (lang && LANG[lang.toLowerCase()]) || null;
}

const has = new Map<string, boolean>();
function available(cmd: string, args: string[]) {
  if (!has.has(cmd)) has.set(cmd, spawnSync(cmd, args, { stdio: "ignore" }).status === 0);
  return has.get(cmd)!;
}

const NEEDS: Record<Runtime, [string, string[]]> = {
  node: ["node", ["--version"]], ts: ["node", ["--version"]], python: ["python3", ["--version"]], go: ["go", ["version"]],
  sql: ["python3", ["-c", "import sqlite3"]], bash: ["bash", ["--version"]], java: ["java", ["-version"]],
};

export function runtimeAvailable(rt: Runtime) {
  const [cmd, args] = NEEDS[rt];
  if (rt === "bash" && !available("git", ["--version"])) return false;
  return available(cmd, args);
}

// Inside the repo so `import "react"` resolves from node_modules.
const ROOT = join(process.cwd(), "node_modules", ".cache", "code-games");

const SQL_RUNNER = String.raw`
import sqlite3, sys
db = sqlite3.connect(":memory:", isolation_level=None)
src = open(sys.argv[1]).read()
buf = ""
for line in src.splitlines(True):
    buf += line
    if sqlite3.complete_statement(buf):
        cur = db.execute(buf)
        buf = ""
        if cur.description:
            for row in cur.fetchall():
                print("|".join("" if v is None else str(v) for v in row))
`;

function exec(cmd: string, args: string[], cwd: string, env: NodeJS.ProcessEnv = {}): RunResult {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", timeout: 30_000, env: { ...process.env, ...env } });
  const out = (r.stdout ?? "") + (r.status === 0 ? "" : r.stderr ?? "");
  return r.status === 0 ? { status: "ok", out } : { status: "error", out: out || String(r.error ?? "failed") };
}

/** Run one program in `lang` and return what it printed. */
export function run(lang: string | undefined, program: string): RunResult {
  const rt = runtimeFor(lang);
  if (!rt) return { status: "skip", reason: `no runner for ${lang}` };
  if (!runtimeAvailable(rt)) return { status: "skip", reason: `${rt} not installed` };
  mkdirSync(ROOT, { recursive: true });
  const dir = mkdtempSync(join(ROOT, "run-"));
  try {
    switch (rt) {
      case "node":
        writeFileSync(join(dir, "main.mjs"), program);
        return exec("node", ["main.mjs"], dir);
      case "ts": {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ts = require("typescript") as typeof import("typescript");
        const js = ts.transpileModule(program, {
          compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
        }).outputText;
        writeFileSync(join(dir, "main.mjs"), js);
        return exec("node", ["main.mjs"], dir);
      }
      case "python":
        writeFileSync(join(dir, "main.py"), program);
        return exec("python3", ["main.py"], dir);
      case "go":
        writeFileSync(join(dir, "main.go"), program);
        return exec("go", ["run", "main.go"], dir, { GO111MODULE: "off" });
      case "sql":
        writeFileSync(join(dir, "q.sql"), program);
        writeFileSync(join(dir, "run.py"), SQL_RUNNER);
        return exec("python3", ["run.py", "q.sql"], dir);
      case "bash":
        writeFileSync(join(dir, "main.sh"), program);
        return exec("bash", ["-e", "main.sh"], dir, {
          HOME: dir, GIT_CONFIG_NOSYSTEM: "1", GIT_AUTHOR_NAME: "Ada", GIT_AUTHOR_EMAIL: "ada@example.com",
          GIT_COMMITTER_NAME: "Ada", GIT_COMMITTER_EMAIL: "ada@example.com",
          GIT_AUTHOR_DATE: "2026-01-01T12:00:00Z", GIT_COMMITTER_DATE: "2026-01-01T12:00:00Z",
        });
      case "java":
        writeFileSync(join(dir, "Main.java"), program);
        return exec("java", ["Main.java"], dir);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const wrap = (q: { harness?: string }, code: string) => (q.harness ? q.harness.replace("{{code}}", code) : code);

/** Check one code-game item by running it. Returns problems (empty when it checks out) or a skip reason. */
export function checkItem(q: Question): { problems: string[]; skipped?: string } {
  const lang = q.codeLang;
  const problems: string[] = [];
  const same = (a: string, b: string) => normalizeOutput(a) === normalizeOutput(b);
  if (q.type === "output") {
    const r = run(lang, wrap(q, q.code));
    if (r.status === "skip") return { problems, skipped: r.reason };
    if (r.status === "error") problems.push(`${q.id}: crashed\n${r.out}`);
    else if (!same(r.out, (q as OutputQuestion).answers[0])) problems.push(`${q.id}: printed ${JSON.stringify(r.out)}, answer ${JSON.stringify(q.answers[0])}`);
  } else if (q.type === "parsons") {
    const p = q as ParsonsQuestion;
    const r = run(lang, wrap(p, p.code));
    if (r.status === "skip") return { problems, skipped: r.reason };
    if (r.status === "error") problems.push(`${q.id}: solution crashed\n${r.out}`);
    else if (p.expected === undefined) problems.push(`${q.id}: runnable but has no expected output`);
    else if (!same(r.out, p.expected)) problems.push(`${q.id}: solution printed ${JSON.stringify(r.out)}, expected ${JSON.stringify(p.expected)}`);
  } else if (q.type === "bug") {
    const b = q as BugQuestion;
    const fixed = run(lang, wrap(b, applyFix(b, b.fixes[b.fix])));
    if (fixed.status === "skip") return { problems, skipped: fixed.reason };
    const buggy = run(lang, wrap(b, b.code));
    if (fixed.status === "error") problems.push(`${q.id}: fixed version crashed\n${fixed.out}`);
    else if (b.expected === undefined) problems.push(`${q.id}: runnable but has no expected output`);
    else if (!same(fixed.out, b.expected)) problems.push(`${q.id}: fixed printed ${JSON.stringify(fixed.out)}, expected ${JSON.stringify(b.expected)}`);
    if (buggy.status === "ok" && same(buggy.out, fixed.out)) problems.push(`${q.id}: buggy and fixed print the same thing, so the bug isn't shown`);
    // Every wrong fix should also fail, or it would be a second right answer.
    b.fixes.forEach((_, i) => {
      if (i === b.fix) return;
      const alt = run(lang, wrap(b, applyFix(b, b.fixes[i])));
      if (alt.status === "ok" && b.expected !== undefined && same(alt.out, b.expected)) problems.push(`${q.id}: wrong fix ${i} also prints the expected output`);
    });
  }
  return { problems };
}
