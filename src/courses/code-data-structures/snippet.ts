/** Joins lines into a code snippet. One argument per line keeps bug-hunt line numbers easy to check. */
export const js = (...lines: string[]) => lines.join("\n");
