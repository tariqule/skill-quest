"use client";

import { Fragment, type ReactNode } from "react";

const KEYWORDS = new Set(
  (
    "const let var function return if else for while do switch case break continue new class extends super this typeof instanceof in of " +
    "async await yield import export from default try catch finally throw null undefined true false void delete static public private " +
    "protected interface type enum implements readonly abstract keyof as is def lambda pass None True False and or not elif with print " +
    "int long double float boolean char String final package throws synchronized volatile record sealed permits " +
    "func go defer chan select range struct map nil fallthrough goto"
  ).split(" "),
);

/** Upper-case keywords for SQL (matched case-insensitively) and Dockerfile instructions. */
const UPPER_KEYWORDS: Record<string, Set<string>> = {
  sql: new Set(
    (
      "SELECT FROM WHERE JOIN INNER LEFT RIGHT FULL OUTER CROSS ON AS AND OR NOT NULL IS IN LIKE BETWEEN GROUP BY ORDER HAVING LIMIT " +
      "OFFSET INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE INDEX VIEW DROP ALTER ADD PRIMARY KEY FOREIGN REFERENCES UNIQUE DEFAULT " +
      "DISTINCT COUNT SUM AVG MIN MAX CASE WHEN THEN ELSE END UNION ALL EXISTS WITH OVER PARTITION ROW_NUMBER RANK BEGIN COMMIT ROLLBACK " +
      "TRANSACTION ASC DESC TRUE FALSE CHECK CONSTRAINT RETURNING COALESCE"
    ).split(" "),
  ),
  dockerfile: new Set("FROM RUN COPY ADD CMD ENTRYPOINT WORKDIR ENV ARG EXPOSE USER LABEL VOLUME HEALTHCHECK SHELL ONBUILD STOPSIGNAL AS".split(" ")),
};

/** YAML: colour keys and list dashes, then fall back to the generic tokenizer for values. */
function highlightYaml(source: string): ReactNode[] {
  return source.split("\n").flatMap((line, li) => {
    const m = line.match(/^(\s*)(- )?([\w.\/-]+)(:)(.*)$/);
    const parts: ReactNode[] = m
      ? [
          m[1],
          m[2] ? <span key={`d${li}`} className="text-slate-500">{m[2]}</span> : null,
          <span key={`k${li}`} className="text-sky-300">{m[3]}</span>,
          m[4],
          ...highlight(m[5], li * 1000, "yaml"),
        ]
      : highlight(line, li * 1000, "yaml");
    return li === 0 ? parts : ["\n", ...parts];
  });
}

/** Languages where `#` starts a comment (elsewhere, e.g. JS private fields, it doesn't). */
const HASH_COMMENT_LANGS = new Set(["python", "py", "yaml", "yml", "bash", "sh", "shell", "ruby", "dockerfile"]);

/** Languages where `//` is not a comment (Python floor division, URLs in CSS/HTML, shell paths). */
const NO_SLASH_COMMENT_LANGS = new Set([...HASH_COMMENT_LANGS, "sql", "css", "html", "text"]);

/** Very small tokenizer: comments, strings, numbers, and keywords get a colour. No HTML injection. */
function highlight(source: string, keyBase = 0, lang = ""): ReactNode[] {
  const comments = ["\\/\\*[\\s\\S]*?\\*\\/"];
  if (!NO_SLASH_COMMENT_LANGS.has(lang)) comments.push("\\/\\/[^\\n]*");
  if (HASH_COMMENT_LANGS.has(lang)) comments.push("#[^\\n]*");
  if (lang === "sql") comments.push("--[^\\n]*");
  if (lang === "html") comments.push("<!--[\\s\\S]*?-->");
  const comment = comments.join("|");
  const upper = UPPER_KEYWORDS[lang];
  const rest = /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/;
  const re = new RegExp(`(${comment})|${rest.source}`, "g");
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = keyBase;
  while ((m = re.exec(source))) {
    if (m.index > last) out.push(source.slice(last, m.index));
    const [tok, comment, str, num, word] = m;
    const cls = comment ? "text-slate-500 italic" : str ? "text-emerald-300" : num ? "text-amber-300" : word && (upper ? upper.has(word.toUpperCase()) : KEYWORDS.has(word)) ? "text-violet-300" : "";
    out.push(cls ? <span key={i++} className={cls}>{tok}</span> : tok);
    last = m.index + tok.length;
  }
  if (last < source.length) out.push(source.slice(last));
  return out;
}

/** Syntax-coloured spans for a piece of code (no wrapper), for editors and inline blanks. */
export function Tokens({ code, lang }: { code: string; lang?: string }) {
  return <>{lang === "yaml" || lang === "yml" ? highlightYaml(code) : highlight(code, 0, lang?.toLowerCase())}</>;
}

/** A code snippet for lessons and questions. */
export function CodeBlock({ code, lang, caption }: { code: string; lang?: string; caption?: string }) {
  return (
    <figure className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        {lang && <div className="border-b border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{lang}</div>}
        <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-relaxed text-slate-100">
          <code>
            {lang === "yaml" || lang === "yml"
              ? highlightYaml(code.replace(/^\n+|\s+$/g, ""))
              : highlight(code.replace(/^\n+|\s+$/g, ""), 0, lang?.toLowerCase())}
          </code>
        </pre>
      </div>
      {caption && <figcaption className="mt-1 text-xs text-slate-400">{caption}</figcaption>}
    </figure>
  );
}

/**
 * Two snippets side by side. `tone="contrast"` (default) colours them as bad vs good,
 * e.g. "bug" vs "fix"; `tone="neutral"` is for plain comparisons like interface vs abstract class.
 */
export function CodeCompare({
  left,
  right,
  lang,
  tone = "contrast",
}: {
  left: { title: string; code: string };
  right: { title: string; code: string };
  lang?: string;
  tone?: "contrast" | "neutral";
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {[left, right].map((s, i) => (
        <div key={i}>
          <div className={`mb-1 text-xs font-bold uppercase tracking-wider ${tone === "neutral" ? "text-sky-300" : i === 0 ? "text-rose-300" : "text-emerald-300"}`}>{s.title}</div>
          <CodeBlock code={s.code} lang={lang} />
        </div>
      ))}
    </div>
  );
}

/** Strip the common indentation from a multi-line snippet written inside a template literal. */
export function dedent(code: string) {
  const lines = code.replace(/^\n+|\s+$/g, "").split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length));
  return lines.map((l) => l.slice(indent)).join("\n");
}

/** Text with `inline code` spans. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") && p.endsWith("`") && p.length > 2 ? (
          <code key={i} className="whitespace-pre-wrap rounded bg-white/10 px-1 py-0.5 font-mono text-[0.92em] text-sky-200">
            {p.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
