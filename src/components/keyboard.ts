/** True while the player is typing into a field, so global answer shortcuts stay out of the way. */
export function isTyping(e: KeyboardEvent): boolean {
  const t = e.target;
  return t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA");
}
