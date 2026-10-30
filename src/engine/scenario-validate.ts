import { CHOICE_SPECIFIC, chainParents, chainPaths, STAR_PRIMER, type ScenarioItem } from "./scenarios";
import { LONGEST_OPTION_RATIO } from "./validate";

/**
 * Structural and quality checks for scenario-game items. Returns error strings (empty = valid).
 * `lessonIds` is the course's lesson ids, for the teach-before-test rule.
 */
export function validateScenarios(courseId: string, items: ScenarioItem[], lessonIds: Set<string>): string[] {
  const out: string[] = [];
  const err = (x: ScenarioItem, m: string) => out.push(`[${courseId}] ${x.type} "${x.id}": ${m}`);
  const ids = new Set<string>();
  for (const x of items) {
    if (ids.has(x.id)) err(x, "duplicate id");
    ids.add(x.id);
    if (!x.title.trim()) err(x, "missing title");
    if (x.lesson === undefined) {
      if (!(x.type === "interview" && x.kind === "behavioral" && STAR_PRIMER.length > 0)) err(x, "must link to a lesson");
    } else if (!lessonIds.has(x.lesson)) err(x, `lesson "${x.lesson}" does not exist in this course`);
    for (const s of x.sources ?? []) if (!/^https:\/\//.test(s.url)) err(x, `source "${s.title}" needs an https URL`);

    if (x.type === "architect") {
      if (x.requirements.length < 2) err(x, "needs at least 2 requirements");
      if (x.slots.length < 2) err(x, "needs at least 2 slots");
      if (x.tiles.length <= x.slots.length) err(x, "needs more tiles than slots (distractors)");
      const tileIds = new Set(x.tiles.map((t) => t.id));
      if (tileIds.size !== x.tiles.length) err(x, "duplicate tile ids");
      if (new Set(x.slots.map((s) => s.id)).size !== x.slots.length) err(x, "duplicate slot ids");
      for (const t of x.tiles) if (!t.why.trim()) err(x, `tile "${t.id}" has no explanation`);
      if (!x.solutions.length) err(x, "needs a solution");
      const used = new Set<string>();
      for (const sol of x.solutions) {
        for (const s of x.slots) {
          if (!sol[s.id]) err(x, `solution leaves slot "${s.id}" empty`);
          else if (!tileIds.has(sol[s.id])) err(x, `solution uses unknown tile "${sol[s.id]}"`);
          else used.add(sol[s.id]);
        }
        if (new Set(Object.values(sol)).size !== Object.values(sol).length) err(x, "a solution reuses a tile");
      }
      const right = x.tiles.filter((t) => used.has(t.id));
      const wrong = x.tiles.filter((t) => !used.has(t.id));
      const longestWrong = Math.max(0, ...wrong.map((t) => t.label.length));
      for (const t of right) if (longestWrong && t.label.length > longestWrong * LONGEST_OPTION_RATIO + 8) err(x, `correct tile "${t.id}" is much longer than every distractor`);
    }

    if (x.type === "interview") {
      if (x.minutes < 1 || x.minutes > 20) err(x, "minutes must be 1-20");
      if (x.rubric.length < 3) err(x, "rubric needs at least 3 lines");
      if (x.keyPoints.length < 3) err(x, "needs at least 3 key points");
      if (x.model.length < 80) err(x, "model answer too short");
    }

    if (x.type === "chain") {
      if (!x.steps[x.start]) err(x, "start step missing");
      for (const [id, s] of Object.entries(x.steps)) {
        if (s.choices.length < 2) err(x, `step "${id}" needs 2+ choices`);
        if (s.choices.filter((c) => c.best).length !== 1) err(x, `step "${id}" needs exactly one best choice`);
        for (const c of s.choices) {
          if (!c.why.trim()) err(x, `step "${id}" choice without explanation`);
          if (c.next && !x.steps[c.next]) err(x, `step "${id}" points at missing step "${c.next}"`);
        }
        const best = s.choices.find((c) => c.best);
        const longestWrong = Math.max(0, ...s.choices.filter((c) => !c.best).map((c) => c.text.length));
        if (best && longestWrong && best.text.length > longestWrong * LONGEST_OPTION_RATIO) err(x, `step "${id}": best choice is the giveaway longest (${best.text.length} vs ${longestWrong})`);
      }
      // Narrative consistency: a step reached from one weak choice must name it; a step reached from several must be choice-neutral.
      const parents = chainParents(x);
      for (const [id, s] of Object.entries(x.steps)) {
        const ps = parents[id] ?? [];
        const texts = new Set(ps.map((p) => p.choice.text));
        if (s.consequenceOf !== undefined) {
          if (texts.size !== 1 || !texts.has(s.consequenceOf)) err(x, `consequence step "${id}" must have exactly one parent choice ("${s.consequenceOf}")`);
          if (!s.situation.includes(`“${s.consequenceOf}”`)) err(x, `consequence step "${id}" must name its parent choice`);
          if (CHOICE_SPECIFIC.test(s.situation.replace(/^You went with “[^”]*”\.\s*/, ""))) err(x, `consequence step "${id}" body assumes a specific pick`);
        } else {
          if (ps.some((p) => !p.choice.best) && texts.size === 1) err(x, `step "${id}" follows one weak choice but isn't marked as its consequence`);
          if (CHOICE_SPECIFIC.test(s.situation)) err(x, `rejoin step "${id}" assumes a specific earlier pick: "${s.situation}"`);
        }
      }
      const paths = chainPaths(x);
      const reached = new Set(paths.flat());
      for (const id of Object.keys(x.steps)) if (!reached.has(id)) err(x, `step "${id}" is unreachable`);
      for (const p of paths) {
        if (p.includes("∞")) err(x, `cycle on path ${p.join("→")}`);
        else if (p.includes("?")) err(x, `missing step on path ${p.join("→")}`);
        else if (p.length < 3 || p.length > 5) err(x, `path ${p.join("→")} has ${p.length} decisions (needs 3-5)`);
      }
    }

    if (x.type === "matcher") {
      if (x.pairs.length < 3 || x.pairs.length > 8) err(x, "needs 3-8 pairs");
      if (new Set(x.pairs.map((p) => p[0])).size !== x.pairs.length) err(x, "duplicate left items");
      if (new Set(x.pairs.map((p) => p[1])).size !== x.pairs.length) err(x, "duplicate right items (ambiguous match)");
      if (x.mode === "clouds" && !(x.sources ?? []).length) err(x, "cross-cloud facts need an official source");
      if (x.notes && x.notes.length !== x.pairs.length) err(x, "notes must match pairs");
    }
  }
  return out;
}
