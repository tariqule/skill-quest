const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "one quick question", "five quick questions": the real count, so the reader and the quiz say the same thing. */
export function quickQuestions(n: number): string {
  const count = WORDS[n] ?? String(n);
  return `${count} quick question${n === 1 ? "" : "s"}`;
}

/** The line above a gentle lesson quiz. */
export function quizIntro(n: number): string {
  const text = `${quickQuestions(n)} about what you just read. Take your time.`;
  return text[0].toUpperCase() + text.slice(1);
}

/** True for a worked-example step card, which numbers itself ("Step 2 of 4") and so needs no card badge. */
export const exampleStep = (text: string): boolean => /^\*\*(Worked example: .*?)?Step \d+ of \d+\.\*\*/.test(text);
