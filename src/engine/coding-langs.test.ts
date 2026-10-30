import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { summarize, type RunResult } from "./coding";
import { JAVA_TICK, PY_HARNESS, cleanJavaCompileLog, instrumentJavaLoops, definesEntry, javaLiteral, javaProgram, parseHarnessOutput } from "./coding-langs";
import type { CodingChallenge } from "./types";

const ALL = COURSES.flatMap((c) => (c.coding ?? []).map((x) => [`${c.id}/${x.id}`, x] as const));
const PY = ALL.filter(([, c]) => c.language === "python");
const JAVA = ALL.filter(([, c]) => c.language === "java");

const has = (cmd: string, args: string[]) => spawnSync(cmd, args).status === 0;
const HAS_PY = has("python3", ["--version"]);
/** javac from PATH, JAVA_HOME, or next to the real `java` binary. */
function findJavac(): string | null {
  if (has("javac", ["-version"])) return "javac";
  const homes = [process.env.JAVA_HOME];
  const java = spawnSync("sh", ["-c", "readlink -f \"$(command -v java)\""], { encoding: "utf8" }).stdout?.trim();
  if (java) homes.push(dirname(dirname(java)));
  for (const h of homes) if (h && existsSync(join(h, "bin", "javac")) && has(join(h, "bin", "javac"), ["-version"])) return join(h, "bin", "javac");
  return null;
}
const JAVAC = findJavac();
const HAS_JAVA = !!JAVAC && has("java", ["-version"]);

/** Runs the same harness Pyodide runs, with the local python3. */
function runPy(c: CodingChallenge, code: string): RunResult & { timedOut?: boolean } {
  const dir = mkdtempSync(join(tmpdir(), "cq-py-"));
  const script = join(dir, "run.py");
  writeFileSync(script, `${PY_HARNESS}\nimport sys\n_d = __json.load(sys.stdin)\nprint(__cq_run(_d["code"], _d["fn"], __json.dumps(_d["tests"])))\n`);
  const r = spawnSync("python3", [script], { input: JSON.stringify({ code, fn: c.fn, tests: c.tests }), timeout: 3000, encoding: "utf8" });
  if (r.error || r.status !== 0) return { timedOut: true, error: String(r.error ?? r.stderr), logs: [], results: [] };
  return parseHarnessOutput(c, r.stdout.trim().split("\n").pop()!);
}

/** Compiles the generated Main.java against the Java 8 library and runs it. */
function runJava(c: CodingChallenge, code: string): RunResult & { timedOut?: boolean } {
  const dir = mkdtempSync(join(tmpdir(), "cq-java-"));
  writeFileSync(join(dir, "Main.java"), javaProgram(c, code));
  const javac = spawnSync(JAVAC!, ["--release", "8", "-nowarn", "-Xlint:none", "-d", dir, join(dir, "Main.java")], { encoding: "utf8", timeout: 60_000 });
  if (javac.status !== 0) return { error: `Compile error:\n${cleanJavaCompileLog(javac.stderr)}`, logs: [], results: [] };
  const out = join(dir, "result.json");
  const run = spawnSync("java", ["-cp", dir, "Main", out], { encoding: "utf8", timeout: 10_000 });
  if (run.error) return { timedOut: true, error: String(run.error), logs: [], results: [] };
  return parseHarnessOutput(c, readFileSync(out, "utf8"));
}

const failures = (r: RunResult) => [r.error, ...r.results.filter((t) => !t.ok).map((t) => `${t.name}: got ${t.got} expected ${t.expected} ${t.error ?? ""}`)].filter(Boolean);

describe("exercise sets", () => {
  it("Python and Java each have at least 10 exercises across levels, linked to lessons", () => {
    for (const set of [PY, JAVA]) {
      expect(set.length).toBeGreaterThanOrEqual(10);
      expect(new Set(set.map(([, c]) => c.level)).size).toBeGreaterThanOrEqual(4);
      for (const [, c] of set) {
        expect(c.lesson, c.id).toBeTruthy();
        expect(c.complexity, c.id).toBeTruthy();
        expect(definesEntry(c), c.id).toBe(true);
        expect(c.tests.some((t) => t.hidden), `${c.id} has a hidden test`).toBe(true);
      }
    }
  });

  it("Java reference solutions stay on the Java 8 library and avoid var (the browser runtime is Java 8)", () => {
    for (const [, c] of JAVA) expect(c.solution, c.id).not.toMatch(/\bvar\s|List\.of|Map\.of|Set\.of|(?<!Collectors)\.toList\(\)|\brecord\s/);
  });
});

describe("java literals", () => {
  it("builds arrays, lists, maps and escapes strings", () => {
    expect(javaLiteral("int[]", [1, 2])).toBe("new int[]{1, 2}");
    expect(javaLiteral("int[][]", [[1], []])).toBe("new int[][]{new int[]{1}, new int[]{}}");
    expect(javaLiteral("List<String>", ["a\"b"])).toBe('new ArrayList<String>(Arrays.<String>asList("a\\"b"))');
    expect(javaLiteral("long", 5)).toBe("5L");
    expect(javaLiteral("double", 2)).toBe("2.0");
    expect(javaLiteral("Map<String, Integer>", { a: 1 })).toBe('__map(new Object[0], "a", 1)');
    expect(javaLiteral("String", null)).toBe("null");
  });

  it("puts the harness imports on line 1 so compiler line numbers match the editor", () => {
    const [, c] = JAVA[0];
    const src = javaProgram(c, "class Solution {\n  int x() {}\n}");
    expect(src.split("\n")[1]).toBe("  int x() {}");
    expect(javaProgram(c, "public class Solution {}")).not.toMatch(/public class Solution/);
  });

  it("cleans compiler logs", () => {
    expect(cleanJavaCompileLog("----------\n1. ERROR in /str/r1x9/Main.java (at line 3)\n\tfoo\n----------\n1 problem (1 error)")).toBe("1. ERROR in Solution.java (at line 3)\n\tfoo");
  });
});

describe.runIf(HAS_PY)("python harness", () => {
  const [, c] = PY.find(([, x]) => x.fn === "sum_evens")!;
  it("reports syntax errors with the line, runtime errors from the player's code only, and print output", () => {
    expect(runPy(c, "def sum_evens(nums)\n    return 0").error).toMatch(/SyntaxError on line 1/);
    const r = runPy(c, "def sum_evens(nums):\n    print('hi')\n    return nums[99]");
    expect(r.results[0].error).toMatch(/IndexError[\s\S]*line 3, in sum_evens/);
    expect(r.results[0].error).not.toMatch(/__cq_run|run\.py/);
    expect(r.logs[0]).toBe("hi");
    expect(runPy(c, "x = 1").error).toMatch(/Define a function named sum_evens/);
  });
  it("does not treat True as 1", () => {
    expect(runPy(c, "def sum_evens(nums):\n    return True").results.find((t) => t.name === "no evens")!.ok).toBe(false);
  });
});

describe("java loop guard", () => {
  it("adds a deadline check to while, do-while and classic for conditions only", () => {
    const src = 'while (true) {\n  go();\n}\nwhile (a < b) x++;\ndo { y(); } while(z);\nfor (int i = 0; i < n; i++) {}\nfor (;;) {}\nfor (String s : xs) {}\nString w = "while (x)"; // for (;;)\nint forward = 1; whilst(); char c = \'(\';';
    const all = instrumentJavaLoops(src).split("\n");
    expect(all[0]).toBe("while (true) { __T.t();");
    const out = all.slice(3);
    expect(out[0]).toBe(`while (${JAVA_TICK}a < b) x++;`);
    expect(out[1]).toBe(`do { y(); } while(${JAVA_TICK}z);`);
    expect(out[2]).toBe(`for (int i = 0;${JAVA_TICK} i < n; i++) {}`);
    expect(out[3]).toBe("for (;;) { __T.t();}");
    expect(out.slice(4)).toEqual(src.split("\n").slice(7));
  });
  it("hides the guard in compile errors and keeps the caret under the right token", () => {
    const log = `1. ERROR in /str/r1-Main.java (at line 3)\n\twhile (${JAVA_TICK}i < n.foo) {\n\t                       ^^^`;
    expect(cleanJavaCompileLog(log)).toBe("1. ERROR in Solution.java (at line 3)\n\twhile (i < n.foo) {\n\t            ^^^");
  });
});

describe.runIf(HAS_JAVA)("java harness", () => {
  it("stops a runaway loop with a timeout instead of hanging", () => {
    const [, c] = JAVA.find(([, x]) => x.fn === "max")!;
    const r = runJava(c, "class Solution {\n  int max(int[] nums) {\n    while (true) { }\n  }\n}");
    expect(r.timedOut).toBe(true);
    expect(r.error).toMatch(/infinite loop/);
  }, 30_000);
  const [, c] = JAVA.find(([, x]) => x.fn === "max")!;
  it("maps compile errors to the player's line and reports exceptions with their line", () => {
    expect(runJava(c, "class Solution {\n  int max(int[] nums) {\n    return nums[0]\n  }\n}").error).toMatch(/line 3|:3:/);
    const r = runJava(c, "class Solution {\n  int max(int[] nums) {\n    System.out.println(\"hi\");\n    return nums[5];\n  }\n}");
    expect(r.results[0].error).toMatch(/ArrayIndexOutOfBounds[\s\S]*at line 4, in max/);
    expect(r.logs[0]).toBe("hi");
  });
  it("names endless recursion as a StackOverflowError with the player's line", () => {
    const r = runJava(c, "class Solution {\n  int max(int[] nums) {\n    return max(nums);\n  }\n}");
    expect(r.results[0].error).toMatch(/StackOverflowError: your method probably calls itself forever[\s\S]*at line 3, in max/);
  }, 30_000);
  it("shows expected and actual values for a wrong answer", () => {
    const t = runJava(c, "class Solution {\n  int max(int[] nums) {\n    return -999;\n  }\n}").results.find((x) => !x.hidden)!;
    expect(t.ok).toBe(false);
    expect(t.got).toBe("-999");
    expect(t.expected).toBeTruthy();
  }, 30_000);
});

describe.runIf(HAS_PY).each(PY)("%s", (_, c) => {
  it("reference solution passes every test", () => expect(failures(runPy(c, c.solution))).toEqual([]), 15_000);
  it("starter does not already pass", () => expect(summarize(runPy(c, c.starter)).allPassed).toBe(false), 15_000);
});

describe.runIf(HAS_JAVA).each(JAVA)("%s", (_, c) => {
  it("reference solution passes every test", () => expect(failures(runJava(c, c.solution))).toEqual([]), 60_000);
  it("starter does not already pass", () => expect(summarize(runJava(c, c.starter)).allPassed).toBe(false), 60_000);
});

// Keeps the local JDK honest: `--release 8` must reject Java 9+ library calls.
describe.runIf(HAS_JAVA)("java 8 library check", () => {
  it("rejects List.of under --release 8", () => {
    const dir = mkdtempSync(join(tmpdir(), "cq-j8-"));
    writeFileSync(join(dir, "A.java"), "class A { Object x = java.util.List.of(1); }");
    expect(() => execFileSync(JAVAC!, ["--release", "8", "-d", dir, join(dir, "A.java")], { stdio: "pipe" })).toThrow();
  }, 60_000);
});

describe.runIf(HAS_PY)("python failure messages", () => {
  const [, c] = PY[0];
  it("shows expected and actual values for a wrong answer", () => {
    const t = runPy(c, `def ${c.fn}(*args):\n    return "nope"\n`).results.find((x) => !x.hidden)!;
    expect(t.ok).toBe(false);
    expect(t.got).toBe("'nope'");
    expect(t.expected).toBeTruthy();
  });
  it("keeps the expected value when the code throws", () => {
    const t = runPy(c, `def ${c.fn}(*args):\n    raise ValueError("boom")\n`).results.find((x) => !x.hidden)!;
    expect(t.error).toMatch(/ValueError/);
    expect(t.expected).toBeTruthy();
  });
  it("names endless recursion and points at the line", () => {
    const r = runPy(c, `def ${c.fn}(*args):\n    return ${c.fn}(*args)\n`);
    expect(r.results[0].error).toMatch(/RecursionError: your function probably calls itself forever[\s\S]*line 2/);
  });
});
