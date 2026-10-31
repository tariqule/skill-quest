import type { Question, Topic } from "@/engine/types";
import { boldTerms, readerScreens, type TopicContent } from "../system-design/schema";

/**
 * Tag accuracy audit for the older questions that PR 1 tagged automatically. A question's tags
 * come from its lesson's stand-in topics, so a question that really drills another topic (say,
 * sharding arithmetic in a replication lesson) ends up gated behind the wrong lesson. This scores
 * each question against every topic's taught vocabulary and flags it when an untagged topic
 * matches better than all of its tags.
 */

const META = new Set(["id", "domain", "lesson", "level", "type", "verified", "codeLang", "concepts"]);

/** Every human-readable string in a question: prompt, code, options, pairs, explanation. */
export function questionText(q: Question): string {
  const out: string[] = [];
  const walk = (v: unknown, key?: string) => {
    if (key && META.has(key)) return;
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach((x) => walk(x));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
  };
  walk(q);
  return out.join(" ");
}

/** Splits a pattern on its top-level `|` only, so `scale (up|out)` stays one alternative. */
function alternatives(source: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === "\\") i++;
    else if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "|" && depth === 0) {
      out.push(source.slice(start, i));
      start = i + 1;
    }
  }
  return [...out, source.slice(start)];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * A topic's lesson terms: the alternatives of its `match` pattern plus, once its lesson is
 * written, every term the lesson bolds. Each is a case-insensitive word-start pattern.
 */
export function topicTerms(topic: Topic, content?: TopicContent): RegExp[] {
  const fromMatch = alternatives(topic.match.source).map((alt) => new RegExp(alt, "i"));
  const taught = content ? [...new Set(content.screens.flatMap(readerScreens).flatMap(boldTerms))].filter((t) => t.length > 3 && !t.startsWith("worked example")) : [];
  return [...fromMatch, ...taught.map((t) => new RegExp(`\\b${escape(t)}`, "i"))];
}

/** How many distinct lesson terms of a topic the text uses. */
export const score = (text: string, terms: readonly RegExp[]) => terms.filter((r) => r.test(text)).length;

/** Share of questions above which a term counts as generic vocabulary. */
export const COMMON = 0.08;

export interface TagFlag {
  id: string;
  tags: string[];
  tagScore: number;
  better: { id: string; score: number };
}

/** Questions where some untagged topic shares more lesson terms than the best of the question's tags. */
export function auditTags(questions: readonly Question[], topics: readonly Topic[], content: readonly TopicContent[]): TagFlag[] {
  const byId = new Map(content.map((c) => [c.id, c]));
  const texts = new Map(questions.map((q) => [q.id, questionText(q)]));
  // Words like "request" or "server" appear across the whole course and say nothing about which
  // topic a question drills, so a term used by more than COMMON of the questions is ignored.
  const specific = (r: RegExp) => [...texts.values()].filter((x) => r.test(x)).length <= COMMON * texts.size;
  const terms = new Map(topics.map((t) => [t.id, topicTerms(t, byId.get(t.id)).filter(specific)]));
  const flags: TagFlag[] = [];
  for (const q of questions) {
    const tags = q.concepts ?? [];
    const text = texts.get(q.id)!;
    const tagScore = Math.max(0, ...tags.map((t) => score(text, terms.get(t) ?? [])));
    let better: TagFlag["better"] | undefined;
    for (const t of topics) {
      if (tags.includes(t.id)) continue;
      const s = score(text, terms.get(t.id)!);
      if (s > tagScore && (!better || s > better.score)) better = { id: t.id, score: s };
    }
    if (better) flags.push({ id: q.id, tags, tagScore, better });
  }
  return flags;
}
