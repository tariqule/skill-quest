import { readdirSync } from "node:fs";
import { join } from "node:path";
import { exampleStep } from "@/components/learn/copy";
import { describe, expect, it } from "vitest";
import { BOOK_CHAPTERS } from "./book-concepts";
import { CURRICULUM, MODULE_TITLES } from "./curriculum";
import { TOPIC_CONTENT } from "./registry";
import { boldTerms, MAX_TERMS_PER_CARD, MODULE_IDS, QUIZ_SHAPE, readerScreens, topicWarnings, validateTopic, type TopicContent } from "./schema";

const MODULES_DIR = join(__dirname, "modules");
const topicFiles = readdirSync(MODULES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readdirSync(join(MODULES_DIR, d.name)).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts")).map((f) => `./modules/${d.name}/${f}`));

const valid: TopicContent = TOPIC_CONTENT[0];

describe("curriculum", () => {
  it("has 68 unique topics across 11 titled modules", () => {
    expect(CURRICULUM).toHaveLength(68);
    expect(new Set(CURRICULUM.map((t) => t.id)).size).toBe(68);
    expect(new Set(CURRICULUM.map((t) => t.module))).toEqual(new Set(MODULE_IDS));
    expect(Object.keys(MODULE_TITLES)).toEqual([...MODULE_IDS]);
  });

  it("only lists prerequisites that come earlier", () => {
    const seen = new Set<string>();
    for (const t of CURRICULUM) {
      for (const pre of t.prereqs) expect(seen.has(pre), `${t.id} needs ${pre}`).toBe(true);
      seen.add(t.id);
    }
  });
});

describe("registry", () => {
  it("picks up every topic file under modules/", async () => {
    const loaded = await Promise.all(topicFiles.map(async (f) => ((await import(f)) as { default: TopicContent }).default));
    expect(new Set(TOPIC_CONTENT)).toEqual(new Set(loaded));
    expect(TOPIC_CONTENT).toHaveLength(topicFiles.length);
  });

  it("keeps each file in its module's folder and on the curriculum", () => {
    const outline = new Map(CURRICULUM.map((t) => [t.id, t]));
    for (const t of TOPIC_CONTENT) {
      expect(outline.get(t.id)?.module, t.id).toBe(t.module);
      expect(topicFiles.some((f) => f.startsWith(`./modules/${t.module}-`)), t.id).toBe(true);
    }
  });

  it.each([
    ["m1", 6],
    ["m2", 4],
    ["m3", 2],
    ["m4", 7],
    ["m5", 2],
  ] as const)("writes all of module %s (%i topics), in curriculum order", (module, n) => {
    const ids = CURRICULUM.filter((t) => t.module === module).map((t) => t.id);
    expect(TOPIC_CONTENT.filter((t) => t.module === module).map((t) => t.id)).toEqual(ids);
    expect(ids).toHaveLength(n);
  });

  it("lists written topics in curriculum order", () => {
    const order = CURRICULUM.map((t) => t.id);
    const written = TOPIC_CONTENT.map((t) => order.indexOf(t.id));
    expect(written).toEqual([...written].sort((a, b) => a - b));
  });
});

describe.each(TOPIC_CONTENT.map((t) => [t.id, t] as const))("topic %s", (_, t) => {
  it("passes boundary validation", () => {
    expect(validateTopic(t)).toEqual([]);
  });

  it("has no wording warnings, such as always or never in a true/false statement", () => {
    expect(topicWarnings(t)).toEqual([]);
  });

  it(`mixes ${QUIZ_SHAPE.mcq} multiple choice and ${QUIZ_SHAPE.tf} true/false, one true and one false`, () => {
    expect(t.quiz.filter((q) => q.kind === "mcq")).toHaveLength(QUIZ_SHAPE.mcq);
    const tf = t.quiz.flatMap((q) => (q.kind === "tf" ? [q.answer] : []));
    expect(tf.sort()).toEqual([false, true]);
  });

  it("only needs earlier topics for its practice items", () => {
    const before = CURRICULUM.slice(0, CURRICULUM.findIndex((o) => o.id === t.id)).map((o) => o.id);
    for (const need of t.practiceNeeds ?? []) expect(before).toContain(need);
  });
});

describe("topicWarnings", () => {
  it("flags always or never in a true/false statement, and nothing else", () => {
    const tf = (statement: string) => ({ kind: "tf" as const, id: "t-x-q9", statement, answer: false, explanation: "x" });
    expect(topicWarnings({ ...valid, quiz: [tf("Caches never go stale.")], practice: [] })).toHaveLength(1);
    expect(topicWarnings({ ...valid, quiz: [tf("ALWAYS wins.")], practice: [tf("Caches can go stale.")] })).toHaveLength(1);
    expect(topicWarnings({ ...valid, quiz: [tf("Caches can go stale.")], practice: [] })).toEqual([]);
  });
});

describe("validateTopic error paths", () => {
  const problems = (patch: Partial<TopicContent>) => validateTopic({ ...valid, ...patch });

  it("rejects a bad id, too few screens and no worked example", () => {
    expect(problems({ id: "Intro" }).join()).toMatch(/id must look like/);
    expect(problems({ screens: valid.screens.filter((s) => s.kind === "idea").slice(0, 2) }).join()).toMatch(/at least 4 screens.*worked example/);
  });

  it("rejects missing or insecure sources", () => {
    expect(problems({ sources: [] }).join()).toMatch(/credit at least one source/);
    expect(problems({ sources: [{ ...valid.sources[0], url: "http://x" }] }).join()).toMatch(/https link/);
  });

  it("rejects the wrong quiz shape and one-sided true/false", () => {
    expect(problems({ quiz: valid.quiz.filter((q) => q.kind === "mcq") }).join()).toMatch(/3 multiple choice and 2 true\/false/);
    const allTrue = valid.quiz.map((q) => (q.kind === "tf" ? { ...q, answer: true } : q));
    expect(problems({ quiz: allTrue }).join()).toMatch(/one true and one false/);
  });

  it("rejects giveaway options, duplicate options, questions posing as statements, and bad ids", () => {
    const quiz = valid.quiz.map((q) => {
      switch (q.kind) {
        case "mcq":
          return { ...q, id: "x-1", options: [q.options[q.answer].repeat(3), "a", "a", "b"] as const, answer: 0 as const };
        case "tf":
          return { ...q, statement: "Is it?" };
      }
    });
    const msg = problems({ quiz }).join("\n");
    expect(msg).toMatch(/gives itself away/);
    expect(msg).toMatch(/duplicate options/);
    expect(msg).toMatch(/not a question/);
    expect(msg).toMatch(/must start with "t-intro-"/);
    expect(msg).toMatch(/is repeated/);
  });

  it("enforces the course voice on screens", () => {
    const long = Array.from({ length: 45 }, () => "word").join(" ");
    const msg = problems({ screens: [...valid.screens, { kind: "idea", text: `a = b → c — ${long}` }] }).join("\n");
    expect(msg).toMatch(/shorthand/);
    expect(msg).toMatch(/arrow/);
    expect(msg).toMatch(/em dash/);
    expect(msg).toMatch(/longer than 40 words/);
  });

  it("labels only the first worked-example step with the title", () => {
    expect(readerScreens({ kind: "example", title: "T", steps: ["one", "two"] })).toEqual(["**Worked example: T. Step 1 of 2.** one", "**Step 2 of 2.** two"]);
    expect(readerScreens({ kind: "example", title: "T", steps: ["one", "two"] }).every(exampleStep)).toBe(true);
    expect(exampleStep("**Steps** matter")).toBe(false);
  });
});

describe("one idea per card", () => {
  it("counts distinct bolded terms, folding plurals and contained forms", () => {
    expect(boldTerms("The **leader-follower** setup has a **leader** and **followers**.")).toEqual(["leader-follower", "leader", "follower"]);
    expect(boldTerms("A **cache** in front, then a second **Caches** hit.")).toEqual(["cache"]);
    expect(boldTerms("**synchronous** vs **asynchronous**")).toEqual(["synchronous", "asynchronous"]);
    expect(boldTerms("plain text")).toEqual([]);
  });
  it("flags a card that bolds two new terms", () => {
    const t = TOPIC_CONTENT.find((x) => x.id === "t-replication")!;
    const bad = { ...t, screens: [...t.screens, { kind: "idea" as const, text: "**Last-write-wins** drops data. A **CRDT** merges it." }] };
    expect(validateTopic(bad).join("\n")).toMatch(/teaches 2 ideas/);
  });
  it("holds in every module: no card bolds two terms", () => {
    const multi = TOPIC_CONTENT.flatMap((t) => t.screens.flatMap((s) => (s.kind === "idea" && boldTerms(s.text).length > MAX_TERMS_PER_CARD ? [`${t.id}: ${s.text}`] : [])));
    expect(multi).toEqual([]);
  });
  it("shows the LWW vs CRDT picture on the CRDT card", () => {
    const t = TOPIC_CONTENT.find((x) => x.id === "t-replication")!;
    const crdt = t.screens.find((s) => s.kind === "idea" && s.text.includes("**CRDT**"));
    expect(crdt && crdt.kind === "idea" && crdt.visual?.kind).toBe("tiles");
  });
});

describe("book coverage", () => {
  const written = new Set(TOPIC_CONTENT.map((t) => t.id));
  const taught = TOPIC_CONTENT.map((t) => [JSON.stringify(t.visual), ...t.screens.flatMap(readerScreens), t.tip].join("\n")).join("\n");
  const done = BOOK_CHAPTERS.filter((ch) => ch.topics.every((id) => written.has(id)));

  it("lists all 15 chapters, each with topics on the curriculum", () => {
    expect(BOOK_CHAPTERS.map((ch) => ch.chapter)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
    const onCurriculum = new Set(CURRICULUM.map((t) => t.id));
    for (const ch of BOOK_CHAPTERS) for (const id of ch.topics) expect(onCurriculum.has(id), `ch ${ch.chapter}: ${id}`).toBe(true);
  });

  it.each(done.map((ch) => [ch.chapter, ch] as const))("teaches every concept from chapter %i", (_, ch) => {
    expect(ch.concepts.length).toBeGreaterThan(0);
    expect(ch.concepts.filter((x) => !x.match.test(taught)).map((x) => x.name)).toEqual([]);
  });

  for (const ch of BOOK_CHAPTERS.filter((x) => !done.includes(x))) it.todo(`chapter ${ch.chapter}: ${ch.title}`);
});
