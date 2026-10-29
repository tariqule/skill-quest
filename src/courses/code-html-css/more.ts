import type { Question } from "@/engine/types";

/**
 * Extra question types for the HTML & CSS track: fill-in-the-property and "type the result" questions.
 * The numeric and colour answers were checked in a real browser (computed widths, resolved colours, :has() count).
 */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "web-fx-01",
    type: "fill",
    domain: "d1",
    level: "junior",
    lesson: "d1-elements",
    prompt: "Fill the gaps to show an image with alt text, then a link to the `/about` page.",
    code: "<{{1}} src=\"cat.jpg\" alt=\"A sleeping cat\">\n<a {{2}}=\"/about\">About us</a>",
    codeLang: "html",
    blanks: [
      { options: ["img", "image", "picture", "figure"], answer: 0 },
      { options: ["href", "src", "link", "url"], answer: 0 },
    ],
    explanation:
      "`<img>` is the void element for images and takes `src` and `alt`. A link's destination goes in the `href` attribute of `<a>`; `src` is for resources that are loaded into the page, such as images and scripts.",
  },
  {
    id: "web-fx-02",
    type: "fill",
    domain: "d2",
    level: "junior",
    lesson: "d2-box",
    prompt: "Fill the gap so a `width: 200px` box stays 200px wide in total, even after you add padding and a border.",
    code: "*,\n*::before,\n*::after {\n  box-sizing: {{1}};\n}",
    codeLang: "css",
    blanks: [{ options: ["border-box", "content-box", "padding-box", "margin-box"], answer: 0 }],
    explanation:
      "With `border-box`, `width` covers the content, padding and border together, so layout math is predictable. The default `content-box` applies the width to the content only, and `padding-box` and `margin-box` are not valid `box-sizing` values.",
  },
  {
    id: "web-fx-03",
    type: "fill",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-grid",
    prompt:
      "Fill the gaps for a responsive card grid: as many columns as fit, each at least 200px wide, and the leftover space shared equally.",
    code: ".cards {\n  display: grid;\n  gap: 16px;\n  grid-template-columns: {{1}}(auto-fit, minmax(200px, {{2}}));\n}",
    codeLang: "css",
    blanks: [
      { options: ["repeat", "grid", "columns", "fit"], answer: 0 },
      { options: ["1fr", "1", "min-content", "fr"], answer: 0 },
    ],
    explanation:
      "`repeat(auto-fit, minmax(200px, 1fr))` creates as many 200px-minimum columns as the width allows, and `1fr` lets each column stretch to share what is left. A bare `1` or `fr` is not a valid track size.",
  },
  {
    id: "web-fx-04",
    type: "fill",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-cascade",
    prompt: "Fill the gap so links take the same text colour as the element they sit in, instead of the browser's default link blue.",
    code: "a {\n  color: {{1}};\n}",
    codeLang: "css",
    blanks: [{ options: ["inherit", "initial", "revert", "transparent"], answer: 0 }],
    explanation:
      "`inherit` takes the parent's computed value. `initial` resets to the property's spec default (black text, not the parent's colour), `revert` rolls back to the browser's own stylesheet (blue again), and `transparent` would make the text invisible.",
  },
  {
    id: "web-fx-05",
    type: "fill",
    domain: "d4",
    level: "senior",
    lesson: "d4-containers",
    prompt:
      "The `.card` should switch to a two-column layout when its wrapper (not the viewport) is at least 400px wide. Fill the gaps.",
    code:
      ".card-wrap {\n  container-type: {{1}};\n}\n\n@{{2}} (min-width: 400px) {\n  .card {\n    display: grid;\n    grid-template-columns: 1fr 2fr;\n  }\n}",
    codeLang: "css",
    blanks: [
      { options: ["inline-size", "normal", "width", "container"], answer: 0 },
      { options: ["container", "media", "supports", "layer"], answer: 0 },
    ],
    explanation:
      "`container-type: inline-size` turns the wrapper into a query container for its width, and `@container` queries the nearest such ancestor. `@media` would test the viewport instead, and `container-type: normal` creates no query container at all, so the rule would never match.",
  },
  {
    id: "web-fx-06",
    type: "fill",
    domain: "d4",
    level: "staff",
    lesson: "d4-systems",
    prompt:
      "A design-system library ships default button padding. Fill the gap so that default has zero specificity and any consumer class can override it, without `!important`.",
    code: "/* library default */\n{{1}}(.btn) {\n  padding: 8px 12px;\n}",
    codeLang: "css",
    blanks: [{ options: [":where", ":is", ":not", ":has"], answer: 0 }],
    explanation:
      "`:where()` always contributes zero specificity, so `:where(.btn)` loses to a single `.btn-lg` or `.my-button` rule. `:is()` takes the specificity of its most specific argument (here the same as `.btn`), so consumers would have to match or beat it, and `:not()` and `:has()` count their arguments too.",
  },

  // ───────────── output ─────────────
  {
    id: "web-ox-01",
    type: "output",
    domain: "d1",
    level: "junior",
    lesson: "d1-elements",
    prompt: "Type the text the browser shows on screen for this paragraph (spaces and line breaks in the source are not preserved).",
    code: "<p>Hello    <b>big</b>\n   world</p>",
    codeLang: "html",
    answers: ["Hello big world"],
    explanation:
      "HTML collapses any run of spaces, tabs, and newlines into a single space. The result is `Hello big world`, with `big` in bold. If you need to keep the source spacing, use `<pre>` or `white-space: pre`.",
  },
  {
    id: "web-ox-02",
    type: "output",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-cascade",
    prompt: "Type the colour name the paragraph's text ends up with.",
    code:
      "<p id=\"note\" class=\"tip warn\">Hi</p>\n\n.tip.warn { color: green; }\np         { color: blue; }\n#note     { color: red; }\n.warn     { color: purple; }",
    codeLang: "css",
    answers: ["red"],
    explanation:
      "All four rules match, so specificity decides. The id selector scores (1,0,0), which beats `.tip.warn` at (0,2,0), `.warn` at (0,1,0), and `p` at (0,0,1). Source order only matters between rules with equal specificity.",
  },
  {
    id: "web-ox-03",
    type: "output",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-flex",
    prompt: "Type the final width of `.c` in pixels (number only). There is no padding, border or gap.",
    code:
      ".row { display: flex; width: 500px; }\n.a, .b { flex: 1 1 100px; }\n.c { flex: 2 1 100px; }",
    codeLang: "css",
    answers: ["200", "200px"],
    explanation:
      "The three flex bases add up to 300px, leaving 200px of free space. It is shared by flex-grow: 1 + 1 + 2 = 4 shares of 50px each. `.c` gets two shares: 100 + 100 = 200px, while `.a` and `.b` end at 150px each.",
  },
  {
    id: "web-ox-04",
    type: "output",
    domain: "d3",
    level: "senior",
    lesson: "d3-grid",
    prompt: "Type the width of the third column in pixels (number only).",
    code:
      ".grid {\n  display: grid;\n  width: 560px;\n  gap: 20px;\n  grid-template-columns: 100px 1fr 3fr;\n}",
    codeLang: "css",
    answers: ["315", "315px"],
    explanation:
      "Fixed space first: 100px for column one plus two 20px gaps leaves 560 - 100 - 40 = 420px. The `fr` units split that remainder in a 1:3 ratio, so 1fr is 105px and 3fr is 315px. Gaps are subtracted before the fractions are divided, not shared out.",
  },
  {
    id: "web-ox-05",
    type: "output",
    domain: "d4",
    level: "staff",
    lesson: "d4-systems",
    prompt: "The `<a>` sits inside `<nav id=\"nav\">`. Type the colour its text gets.",
    code:
      "@layer base {\n  #nav a { color: red; }\n}\n\na { color: blue; }",
    codeLang: "css",
    answers: ["blue"],
    explanation:
      "For normal (non-`!important`) declarations, styles outside any cascade layer beat styles inside a layer, whatever their specificity. Layers are compared before specificity, so the plain `a` rule wins even though `#nav a` is much more specific. This is how a layered design system stays easy to override.",
  },
  {
    id: "web-ox-06",
    type: "output",
    domain: "d4",
    level: "senior",
    lesson: "d4-selectors",
    prompt: "Type how many list items are bold.",
    code:
      "<ul>\n  <li><input type=\"checkbox\" checked> A</li>\n  <li><input type=\"checkbox\"> B</li>\n  <li><input type=\"checkbox\" checked> C</li>\n  <li>D</li>\n</ul>\n\nli:has(input:checked) { font-weight: bold; }",
    codeLang: "css",
    answers: ["2"],
    explanation:
      "`li:has(input:checked)` selects each `li` that contains a checked input. A and C match; B has an unchecked box, and D has no input at all. `:has()` is the long-awaited parent selector, and it updates as the user toggles the checkboxes.",
  },
];
