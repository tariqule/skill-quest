const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** "3 questions and 1 design prompt"; falls back to "the topics after it" when nothing new opens. */
export function unlockPhrase(unlocks: { questions: number; prompts: number }): string {
  const parts = [unlocks.questions && plural(unlocks.questions, "question"), unlocks.prompts && plural(unlocks.prompts, "design prompt")].filter(Boolean);
  return parts.length ? parts.join(" and ") : "the topics after it";
}
