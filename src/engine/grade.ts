import { prepareParsons } from "./code-games";
import { codeLines, isCorrect, prepare, type PreparedQuestion } from "./game";
import type { Question } from "./types";

/**
 * `prepare` without shuffling: options, items and fixes stay in authored order, so `picked`
 * indexes refer to the question as written. Used to grade answers sent to the server.
 */
export function prepareInOrder(q: Question): PreparedQuestion {
  const identity = <T,>(xs: T[]) => [...xs];
  switch (q.type) {
    case "fill": {
      const shuffled: string[] = [];
      const groups: number[][] = [];
      const correct: number[] = [];
      for (const b of q.blanks) {
        const start = shuffled.length;
        groups.push(b.options.map((_, k) => start + k));
        shuffled.push(...b.options);
        correct.push(start + b.answer);
      }
      return { ...q, kind: "fill", shuffled, prompts: [], correct, groups };
    }
    case "parsons": {
      const p = prepareParsons(q, identity);
      return { ...q, kind: "parsons", shuffled: p.blocks, prompts: [], correct: [], parsons: p };
    }
    case "bug":
      return { ...q, kind: "bug", shuffled: codeLines(q.code), prompts: [], correct: [q.line - 1], fixOptions: [...q.fixes], fixCorrect: q.fix };
    case "order":
      return { ...q, kind: "order", shuffled: [...q.items], prompts: [], correct: q.items.map((_, i) => i) };
    case "match":
      return { ...q, kind: "match", shuffled: q.pairs.map(([, r]) => r), prompts: q.pairs.map(([p]) => p), correct: q.pairs.map((_, i) => i) };
    case "lines":
    case "output":
      return prepare(q); // neither shuffles
    default:
      return { ...q, kind: "choice", shuffled: [...q.options], prompts: [], correct: [...q.answer] };
  }
}

/** Grade one answer given in authored order. */
export function gradeAnswer(q: Question, picked: number[]) {
  const p = prepareInOrder(q);
  return { correct: isCorrect(p, picked), answer: p.kind === "output" ? [] : p.kind === "bug" ? [p.correct[0], p.fixCorrect ?? -1] : p.correct };
}
