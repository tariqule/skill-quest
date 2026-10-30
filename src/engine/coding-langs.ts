import type { CodingChallenge, CodingLanguage } from "./types";
import type { RunResult, TestResult } from "./coding";

export const LANGUAGE_LABEL: Record<CodingLanguage, string> = { js: "JavaScript", python: "Python", java: "Java" };

export const languageOf = (c: Pick<CodingChallenge, "language">): CodingLanguage => c.language ?? "js";

/** How long a run may take once the language runtime is loaded. */
export const RUN_LIMIT_MS: Record<CodingLanguage, number> = { js: 3000, python: 5000, java: 15000 };

/** What the starter must contain so the harness can find the player's function. */
export function definesEntry(c: CodingChallenge): boolean {
  const lang = languageOf(c);
  if (lang === "python") return new RegExp(`^def\\s+${c.fn}\\s*\\(`, "m").test(c.starter);
  if (lang === "java") return /\bclass\s+Solution\b/.test(c.starter) && new RegExp(`\\b${c.fn}\\s*\\(`).test(c.starter);
  return new RegExp(`function\\s+${c.fn}\\b|(?:const|let|var)\\s+${c.fn}\\s*=`).test(c.starter);
}

// ───────────── Python ─────────────

/**
 * Python test harness, run by Pyodide in the browser and by `python3` in `npm test`.
 * `__cq_run(code, fn, tests_json)` returns a JSON string shaped like RunResult.
 * The player's code is compiled as "solution.py" so tracebacks show only their own lines.
 */
export const PY_HARNESS = String.raw`
import json as __json, math as __math, sys as __sys, io as __io, traceback as __tb, contextlib as __ctx

def __cq_norm(v):
    if isinstance(v, (list, tuple)):
        return [__cq_norm(x) for x in v]
    if isinstance(v, dict):
        return {k: __cq_norm(x) for k, x in v.items()}
    return v

def __cq_eq(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return type(a) is type(b) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return a == b or __math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9)
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(__cq_eq(x, y) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        return set(a) == set(b) and all(__cq_eq(a[k], b[k]) for k in a)
    return a == b

def __cq_show(v):
    try:
        return repr(v)
    except Exception:
        return "<unprintable>"

def __cq_error(e):
    te = __tb.TracebackException.from_exception(e)
    frames = [f for f in te.stack if f.filename == "solution.py"]
    lines = [f"line {f.lineno}, in {f.name}" + (f": {f.line}" if f.line else "") for f in frames[-3:]]
    head = "".join(te.format_exception_only()).strip()
    return (head + ("\n  " + "\n  ".join(lines) if lines else ""))[:1500]

def __cq_run(code, fn, tests_json):
    tests = __json.loads(tests_json)
    out = __io.StringIO()
    ns = {"__name__": "solution"}
    res = {"logs": [], "results": []}
    def logs():
        return out.getvalue().splitlines()[:60]
    try:
        with __ctx.redirect_stdout(out):
            exec(compile(code, "solution.py", "exec"), ns)
    except SyntaxError as e:
        res["error"] = f"SyntaxError on line {e.lineno}: {e.msg}" + (f"\n  {e.text.rstrip()}" if e.text else "")
        res["logs"] = logs()
        return __json.dumps(res)
    except BaseException as e:
        res["error"] = __cq_error(e)
        res["logs"] = logs()
        return __json.dumps(res)
    f = ns.get(fn)
    if not callable(f):
        res["error"] = f"Define a function named {fn}."
        return __json.dumps(res)
    for t in tests:
        hidden = bool(t.get("hidden"))
        r = {"name": t.get("name") or "test", "hidden": hidden}
        args = __json.loads(__json.dumps(t["args"]))
        if not hidden:
            r["args"] = ", ".join(__cq_show(a) for a in t["args"])
        try:
            with __ctx.redirect_stdout(out):
                got = f(*args)
            r["ok"] = __cq_eq(__cq_norm(got), t["expected"])
            if not hidden:
                r["got"] = __cq_show(got)
                r["expected"] = __cq_show(t["expected"])
        except RecursionError as e:
            r["ok"] = False
            r["error"] = "RecursionError: maximum recursion depth exceeded (check the base case)"
        except BaseException as e:
            r["ok"] = False
            r["error"] = __cq_error(e)
        res["results"].append(r)
    res["logs"] = logs()
    return __json.dumps(res)
`;

// ───────────── Java ─────────────

/** Java source for a value of the given type, built from a JSON test value. */
export function javaLiteral(type: string, v: unknown): string {
  const t = type.replace(/\s+/g, "");
  if (v === null) return "null";
  if (t.endsWith("[]")) {
    const inner = t.slice(0, -2);
    if (!Array.isArray(v)) throw new Error(`expected an array for ${type}`);
    return `new ${t}{${v.map((x) => javaLiteral(inner, x)).join(", ")}}`;
  }
  const generic = t.match(/^(List|Set|Map)<(.+)>$/);
  if (generic) {
    const [, kind, body] = generic;
    if (kind === "Map") {
      const [k, val] = splitTop(body);
      const entries = Object.entries(v as Record<string, unknown>);
      return `__map(${["new Object[0]", ...entries.map(([key, x]) => `${javaLiteral(k, k === "Integer" ? Number(key) : key)}, ${javaLiteral(val, x)}`)].join(", ")})`;
    }
    const items = (v as unknown[]).map((x) => javaLiteral(body, x)).join(", ");
    return kind === "Set" ? `new LinkedHashSet<${body}>(Arrays.<${body}>asList(${items}))` : `new ArrayList<${body}>(Arrays.<${body}>asList(${items}))`;
  }
  switch (t) {
    case "int":
    case "Integer":
    case "short":
    case "byte":
      return String(v);
    case "long":
    case "Long":
      return `${v}L`;
    case "double":
    case "Double":
    case "float": {
      const s = String(v);
      return /[.eE]/.test(s) ? s : `${s}.0`;
    }
    case "boolean":
    case "Boolean":
      return String(v);
    case "char":
    case "Character":
      return `'${javaEscape(String(v))}'`;
    case "String":
      return `"${javaEscape(String(v))}"`;
    default:
      throw new Error(`unsupported Java type ${type}`);
  }
}

function splitTop(s: string): [string, string] {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "<") depth++;
    else if (s[i] === ">") depth--;
    else if (s[i] === "," && depth === 0) return [s.slice(0, i), s.slice(i + 1)];
  }
  throw new Error(`bad Map type ${s}`);
}

const javaEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\t/g, "\\t");

/** Display of a test argument in Java-ish form. */
export function javaShow(v: unknown): string {
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(javaShow).join(", ")}]`;
  if (v && typeof v === "object") return `{${Object.entries(v).map(([k, x]) => `${k}=${javaShow(x)}`).join(", ")}}`;
  return String(v);
}

/** Lines of the harness's own imports; they share line 1 with the player's code, so line numbers match. */
const JAVA_IMPORTS = "import java.util.*; import java.util.function.*; import java.util.stream.*; ";

/**
 * Builds Main.java: the player's code first (so compiler line numbers are their line numbers), then a
 * `Main` class that calls `new Solution().fn(...)` for each test, captures System.out, and writes a
 * RunResult as JSON to the file named by the first program argument (or prints it when there is none).
 */
export function javaProgram(c: CodingChallenge, code: string): string {
  if (!c.java) throw new Error(`${c.id} needs java types`);
  const user = code.replace(/\bpublic\s+(final\s+)?class\s+Solution\b/, (_m, f) => `${f ?? ""}class Solution`);
  const calls = c.tests
    .map((t, i) => {
      const args = t.args.map((a, j) => javaLiteral(c.java!.params[j], a)).join(", ");
      const exp = javaLiteral(c.java!.returns, t.expected);
      return `    __test(sb, ${i}, ${JSON.stringify(t.name ?? "test")}, ${t.hidden ? "true" : "false"}, new __Call() { public Object call() throws Throwable { return new Solution().${c.fn}(${args}); } }, ${exp});`;
    })
    .join("\n");
  return `${JAVA_IMPORTS}${instrumentJavaLoops(user)}

class __Timeout extends Error { }
class __T {
  static long d = Long.MAX_VALUE;
  static int c = 0;
  static boolean t() { if ((++c & 1023) == 0 && System.currentTimeMillis() > d) throw new __Timeout(); return true; }
}

class Main {
  interface __Call { Object call() throws Throwable; }
  static java.io.ByteArrayOutputStream __buf = new java.io.ByteArrayOutputStream();
  static int __n = 0;
  @SuppressWarnings("unchecked") static <K, V> Map<K, V> __map(Object[] none, Object... kv) { Map<K, V> m = new LinkedHashMap<K, V>(); for (int i = 0; i + 1 < kv.length; i += 2) m.put((K) kv[i], (V) kv[i + 1]); return m; }
  static String __q(String s) {
    StringBuilder b = new StringBuilder("\\"");
    for (char ch : s.toCharArray()) {
      if (ch == '"' || ch == '\\\\') b.append('\\\\').append(ch);
      else if (ch == '\\n') b.append("\\\\n");
      else if (ch < 32) b.append(String.format("\\\\u%04x", (int) ch));
      else b.append(ch);
    }
    return b.append('"').toString();
  }
  static Object __norm(Object v) {
    if (v == null) return null;
    if (v.getClass().isArray()) { List<Object> l = new ArrayList<Object>(); int n = java.lang.reflect.Array.getLength(v); for (int i = 0; i < n; i++) l.add(__norm(java.lang.reflect.Array.get(v, i))); return l; }
    if (v instanceof Set) { List<Object> sorted = new ArrayList<Object>(); for (Object x : (Set<?>) v) sorted.add(__norm(x)); Collections.sort(sorted, new Comparator<Object>() { public int compare(Object a, Object b) { return __show(a).compareTo(__show(b)); } }); Map<String, Object> s = new LinkedHashMap<String, Object>(); s.put("$set", sorted); return s; }
    if (v instanceof Collection) { List<Object> l = new ArrayList<Object>(); for (Object x : (Collection<?>) v) l.add(__norm(x)); return l; }
    if (v instanceof Map) { Map<String, Object> m = new TreeMap<String, Object>(); for (Map.Entry<?, ?> e : ((Map<?, ?>) v).entrySet()) m.put(String.valueOf(e.getKey()), __norm(e.getValue())); return m; }
    if (v instanceof Character) return String.valueOf(v);
    return v;
  }
  static boolean __eq(Object a, Object b) {
    if (a == null || b == null) return a == b;
    if (a instanceof Number && b instanceof Number) {
      if (a instanceof Double || a instanceof Float || b instanceof Double || b instanceof Float) { double x = ((Number) a).doubleValue(), y = ((Number) b).doubleValue(); return x == y || Math.abs(x - y) <= 1e-9 * Math.max(1, Math.max(Math.abs(x), Math.abs(y))); }
      return ((Number) a).longValue() == ((Number) b).longValue();
    }
    if (a instanceof List && b instanceof List) { List<?> x = (List<?>) a, y = (List<?>) b; if (x.size() != y.size()) return false; for (int i = 0; i < x.size(); i++) if (!__eq(x.get(i), y.get(i))) return false; return true; }
    if (a instanceof Map && b instanceof Map) { Map<?, ?> x = (Map<?, ?>) a, y = (Map<?, ?>) b; if (!x.keySet().equals(y.keySet())) return false; for (Object k : x.keySet()) if (!__eq(x.get(k), y.get(k))) return false; return true; }
    return a.equals(b);
  }
  static String __show(Object v) {
    if (v == null) return "null";
    if (v instanceof String) return __q((String) v);
    if (v instanceof List) { StringBuilder b = new StringBuilder("["); for (Object x : (List<?>) v) { if (b.length() > 1) b.append(", "); b.append(__show(x)); } return b.append("]").toString(); }
    if (v instanceof Map) { Map<?, ?> m = (Map<?, ?>) v; if (m.size() == 1 && m.containsKey("$set")) return "set" + __show(m.get("$set")); StringBuilder b = new StringBuilder("{"); for (Map.Entry<?, ?> e : m.entrySet()) { if (b.length() > 1) b.append(", "); b.append(e.getKey()).append("=").append(__show(e.getValue())); } return b.append("}").toString(); }
    return String.valueOf(v);
  }
  static String __err(Throwable t) {
    StringBuilder b = new StringBuilder(t.toString());
    int shown = 0;
    for (StackTraceElement e : t.getStackTrace()) {
      if (e.getClassName().startsWith("Main")) break;
      if (e.getFileName() != null && e.getFileName().equals("Main.java") && shown < 3) { b.append("\\n  at line ").append(e.getLineNumber()).append(", in ").append(e.getMethodName()); shown++; }
    }
    return b.toString();
  }
  static void __test(StringBuilder sb, int i, String name, boolean hidden, __Call c, Object expected) {
    if (__n++ > 0) sb.append(",");
    sb.append("{\\"name\\":").append(__q(name)).append(",\\"hidden\\":").append(hidden);
    try {
      Object got = __norm(c.call());
      Object exp = __norm(expected);
      sb.append(",\\"ok\\":").append(__eq(got, exp));
      if (!hidden) sb.append(",\\"got\\":").append(__q(__show(got))).append(",\\"expected\\":").append(__q(__show(exp)));
    } catch (__Timeout e) {
      throw e;
    } catch (StackOverflowError e) {
      sb.append(",\\"ok\\":false,\\"error\\":").append(__q("StackOverflowError: the recursion never stops (check the base case)"));
    } catch (Throwable e) {
      sb.append(",\\"ok\\":false,\\"error\\":").append(__q(__err(e)));
    }
    sb.append("}");
  }
  public static void main(String[] argv) throws Exception {
    java.io.PrintStream real = System.out;
    System.setOut(new java.io.PrintStream(__buf, true, "UTF-8"));
    StringBuilder sb = new StringBuilder("{\\"results\\":[");
    __T.d = System.currentTimeMillis() + ${JAVA_LOOP_LIMIT_MS};
    try {
${calls}
    } catch (__Timeout e) {
      sb = new StringBuilder("{\\"timedOut\\":true,\\"results\\":[");
    }
    System.out.flush();
    System.setOut(real);
    String logs = new String(__buf.toByteArray(), "UTF-8");
    String[] lines = logs.isEmpty() ? new String[0] : logs.split("\\n", -1);
    sb.append("],\\"logs\\":[");
    int shown = 0;
    for (int i = 0; i < lines.length && shown < 60; i++) { if (i == lines.length - 1 && lines[i].isEmpty()) break; if (shown++ > 0) sb.append(","); sb.append(__q(lines[i])); }
    sb.append("]}");
    if (argv.length > 0) { java.io.Writer w = new java.io.OutputStreamWriter(new java.io.FileOutputStream(argv[0]), "UTF-8"); w.write(sb.toString()); w.close(); }
    else real.println(sb.toString());
  }
}
`;
}

/** How long the Java tests may run before loops are stopped (compiling is not counted). */
export const JAVA_LOOP_LIMIT_MS = 5000;

/** Text put in front of every loop condition so a runaway loop can be stopped. */
export const JAVA_TICK = "__T.t() && ";

/**
 * Puts a deadline check into every `while`, `do ... while` and classic `for` condition of the player's code,
 * on the same line so line numbers do not move. CheerpJ runs Java on the page's main thread, so a busy loop
 * would freeze the tab: the check throws once the run is past its deadline instead. Strings, chars and
 * comments are skipped. Enhanced for loops end on their own and are left alone.
 */
export function instrumentJavaLoops(code: string): string {
  const n = code.length;
  const isId = (ch: string | undefined) => !!ch && /[A-Za-z0-9_$]/.test(ch);
  const skipQuoted = (j: number): number => {
    const q = code[j];
    j++;
    while (j < n && code[j] !== q) j += code[j] === "\\" ? 2 : 1;
    return j + 1;
  };
  // Code positions (outside strings and comments) to insert text at.
  const inserts: [number, string][] = [];
  // From an index inside a "(", returns the index of the matching ")" and of the first top-level ";".
  const header = (from: number) => {
    let depth = 0;
    let semis: number[] = [];
    let k = from;
    while (k < n) {
      const c = code[k];
      if (c === '"' || c === "'") {
        k = skipQuoted(k);
        continue;
      }
      if (c === "(" || c === "[" || c === "{") depth++;
      else if (c === ")" || c === "]" || c === "}") {
        if (depth === 0) return { close: k, semis };
        depth--;
      } else if (c === ";" && depth === 0) semis = [...semis, k];
      k++;
    }
    return { close: n, semis };
  };
  // A loop whose condition is the constant `true` must stay constant (the compiler's reachability rules
  // depend on it), so the check goes at the start of a braced body instead.
  const tickBody = (close: number) => {
    let j = close + 1;
    while (j < n && /\s/.test(code[j])) j++;
    if (code[j] === "{") inserts.push([j + 1, " __T.t();"]);
  };
  let i = 0;
  while (i < n) {
    const ch = code[i];
    if (ch === "/" && code[i + 1] === "/") {
      const e = code.indexOf("\n", i);
      i = e < 0 ? n : e;
      continue;
    }
    if (ch === "/" && code[i + 1] === "*") {
      const e = code.indexOf("*/", i + 2);
      i = e < 0 ? n : e + 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      i = skipQuoted(i);
      continue;
    }
    const kw = isId(code[i - 1]) ? null : (["while", "for"] as const).find((w) => code.startsWith(w, i) && !isId(code[i + w.length]));
    if (!kw) {
      i++;
      continue;
    }
    let j = i + kw.length;
    while (j < n && /\s/.test(code[j])) j++;
    if (code[j] !== "(") {
      i = j;
      continue;
    }
    const start = j + 1;
    const h = header(start);
    if (kw === "while") {
      if (code.slice(start, h.close).trim() === "true") tickBody(h.close);
      else inserts.push([start, JAVA_TICK]);
    } else if (h.semis.length >= 2) {
      const cond = code.slice(h.semis[0] + 1, h.semis[1]).trim();
      if (cond === "" || cond === "true") tickBody(h.close);
      else inserts.push([h.semis[0] + 1, JAVA_TICK]);
    }
    i = start;
  }
  let out = code;
  for (const [at, text] of inserts.sort((x, y) => y[0] - x[0])) out = out.slice(0, at) + text + out.slice(at);
  return out;
}

/** Makes ECJ's or javac's log readable: drops headers and internal paths. */
export function cleanJavaCompileLog(log: string): string {
  const lines = log.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.includes("__T.t()")) continue;
    const caret = lines[i + 1] && /^\s*\^+\s*$/.test(lines[i + 1]) ? lines[i + 1].indexOf("^") : -1;
    let cut = 0;
    const re = /__T\.t\(\)( && |; ?)?| __T\.t\(\);/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(l))) if (caret >= 0 && m.index < caret) cut += m[0].length;
    lines[i] = l.replace(re, "");
    if (cut > 0) lines[i + 1] = lines[i + 1].slice(0, caret - cut) + lines[i + 1].slice(caret);
  }
  return lines
    .filter((l) => !/^#|^----------$|^\d+ problems? \(/.test(l.trim()))
    .join("\n")
    .replace(/\/str\/[^\s]*Main\.java|[^\s]*Main\.java/g, "Solution.java")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 3000);
}

/** Parses a harness's JSON output into a RunResult, adding Java-ish argument display. */
export function parseHarnessOutput(c: CodingChallenge, raw: string): RunResult {
  const r = JSON.parse(raw) as { error?: string; timedOut?: boolean; logs?: string[]; results: TestResult[] };
  if (r.timedOut) return { timedOut: true, error: `Your code ran for more than ${JAVA_LOOP_LIMIT_MS / 1000} seconds and was stopped. Is there an infinite loop?`, logs: r.logs ?? [], results: [] };
  const results = r.results.map((x, i) => ({
    ...x,
    args: x.hidden ? undefined : (x.args ?? (languageOf(c) === "java" ? c.tests[i].args.map(javaShow).join(", ") : undefined)),
  }));
  return { error: r.error, logs: r.logs ?? [], results };
}
