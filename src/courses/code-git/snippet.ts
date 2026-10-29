/** Joins lines into a code snippet. One argument per line keeps bug-hunt line numbers easy to check. */
export const sh = (...lines: string[]) => lines.join("\n");
