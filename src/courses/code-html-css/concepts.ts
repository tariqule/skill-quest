/**
 * Key HTML/CSS concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["semantic element", /semantic/i],
  ["heading levels", /<h[1-6]|heading/i],
  ["landmark", /<(nav|main|header|footer|aside)>|landmark/i],
  ["alt text", /\balt\b/],
  ["label", /<label|label/i],
  ["button vs link", /<button|<a /i],
  ["ARIA", /aria/i],
  ["DOCTYPE", /doctype/i],
  ["meta viewport", /meta name="viewport"|meta viewport|viewport meta/i],
  ["selector", /\bselector/i],
  ["specificity", /specificity/i],
  ["cascade", /cascade|cascad/i],
  ["inheritance", /inherit/i],
  ["!important", /!important/],
  ["box model", /box model|padding|margin|border/i],
  ["box-sizing", /box-sizing|border-box/i],
  ["flexbox", /flex/i],
  ["justify / align", /justify-|align-/i],
  ["grid", /\bgrid/i],
  ["fr unit", /\dfr\b|\bfr unit/i],
  ["position", /\bposition:|position: ?(absolute|fixed|sticky)|\bsticky\b/i],
  ["z-index", /z-index|stacking/i],
  ["media query", /@media|media quer/i],
  ["mobile-first", /mobile-first|min-width/i],
  ["rem / em", /\brem\b|\bem\b/],
  ["custom property", /--[\w-]+|custom propert|var\(/i],
  [":has()", /:has\(/],
  ["container query", /@container|container quer/i],
  ["cascade layers", /@layer|cascade layer/i],
  ["pseudo-class", /:hover|:focus|pseudo-class/i],
  ["pseudo-element", /::before|::after|pseudo-element/i],
  ["nesting", /nesting|&:/i],
];
