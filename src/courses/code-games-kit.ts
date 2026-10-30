import type { BugQuestion, OutputQuestion, ParsonsQuestion, SkillLevel, Verified } from "@/engine/types";

/** Join snippet lines (keeps the source free of template-literal escaping). */
export const L = (...lines: string[]) => lines.join("\n");

interface Common {
  /** Short id; the kit adds the track prefix and game, for example "python-pz-01". */
  n: string;
  domain: string;
  level: SkillLevel;
  lesson: string;
  prompt: string;
  explanation: string;
  /** Defaults to the kit's language. */
  lang?: string;
  /** Defaults to the kit's setting: "run" when the language has a runner on the box. */
  verified?: Verified;
  harness?: string;
}

/**
 * Builders for one track's code games, so each item states only what's special about it.
 * `verified` says whether the track's answers were executed ("run") or checked by hand ("reasoned").
 */
export function gameKit(prefix: string, lang: string, verified: Verified) {
  const base = (c: Common, game: string) => ({
    id: `${prefix}-${game}-${c.n}`,
    domain: c.domain,
    level: c.level,
    lesson: c.lesson,
    prompt: c.prompt,
    explanation: c.explanation,
    codeLang: c.lang ?? lang,
    verified: c.verified ?? verified,
    ...(c.harness ? { harness: c.harness } : {}),
  });
  return {
    parsons: (c: Common & Pick<ParsonsQuestion, "code" | "distractors" | "indent" | "hint" | "expected">): ParsonsQuestion => ({
      ...base(c, "pz"),
      type: "parsons",
      code: c.code,
      ...(c.distractors ? { distractors: c.distractors } : {}),
      ...(c.indent ? { indent: true } : {}),
      ...(c.hint ? { hint: c.hint } : {}),
      ...(c.expected !== undefined ? { expected: c.expected } : {}),
    }),
    bug: (c: Common & Pick<BugQuestion, "code" | "line" | "fixes" | "fix" | "expected" | "trace">): BugQuestion => ({
      ...base(c, "bug"),
      type: "bug",
      code: c.code,
      line: c.line,
      fixes: c.fixes,
      fix: c.fix,
      ...(c.expected !== undefined ? { expected: c.expected } : {}),
      ...(c.trace ? { trace: c.trace } : {}),
    }),
    output: (c: Common & Pick<OutputQuestion, "code" | "answers" | "choices" | "trace">): OutputQuestion => ({
      ...base(c, "out"),
      type: "output",
      code: c.code,
      answers: c.answers,
      ...(c.choices ? { choices: c.choices } : {}),
      ...(c.trace ? { trace: c.trace } : {}),
    }),
  };
}
