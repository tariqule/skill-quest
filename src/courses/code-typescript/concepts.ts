/**
 * Key TypeScript concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["interface", /\binterface\b/i],
  ["type alias", /type alias|\btype \w+ =/i],
  ["any", /\bany\b/],
  ["unknown", /\bunknown\b/],
  ["never", /\bnever\b/],
  ["literal type", /literal/i],
  ["union", /union|\|/i],
  ["intersection", /intersection|&/],
  ["narrowing", /narrow/i],
  ["typeof guard", /typeof/],
  ["instanceof", /instanceof/],
  ["in operator", /\bin\b operator|"\w+" in /],
  ["discriminated union", /discriminat/i],
  ["type predicate", /type predicate|asserts \w+ is|\): \w+ is /],
  ["exhaustiveness", /exhaustive/i],
  ["generic", /generic|<T/i],
  ["constraint", /extends/],
  ["keyof", /keyof/],
  ["Partial", /Partial/],
  ["Pick / Omit", /\b(Pick|Omit)\b/],
  ["Record", /\bRecord\b/],
  ["Readonly", /Readonly|readonly/],
  ["optional property", /optional|\?:/i],
  ["mapped type", /mapped|in keyof/i],
  ["conditional type", /conditional type|extends .* \?/i],
  ["infer", /\binfer\b/],
  ["strict mode", /strict/i],
  ["noImplicitAny", /noImplicitAny/],
  ["strictNullChecks", /strictNullChecks/],
  ["tsconfig", /tsconfig/i],
  ["declaration file", /\.d\.ts|declare /i],
  ["satisfies", /satisfies/],
  ["as assertion", /\bas const\b|type assertion|\bas \w+\b/],
  ["non-null assertion", /non-null|!\./],
  ["enum", /\benum\b/i],
  ["tuple", /tuple/i],
];
