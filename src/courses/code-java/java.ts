/**
 * Tagged template for Java snippets: keeps backslashes as written (raw) and
 * strips the common indentation, so snippets can be indented with the source.
 * Don't use `${…}` inside a snippet.
 */
export function java(strings: TemplateStringsArray, ...values: unknown[]): string {
  const raw = String.raw({ raw: strings.raw }, ...values);
  const lines = raw.replace(/^\n+|\s+$/g, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => (l.match(/^ */)?.[0].length ?? 0));
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(indent)).join("\n");
}
