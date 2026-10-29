import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-html";
import d2 from "./domains/d2-css-basics";
import d3 from "./domains/d3-layout";
import d4 from "./domains/d4-modern-css";

/**
 * Learn HTML & CSS: a from-zero learning track. Starts with "what is a web page"
 * and builds to semantic, accessible markup, the cascade, flexbox and grid,
 * responsive design, modern CSS (custom properties, :has(), container queries,
 * nesting, cascade layers) and design-system conventions. Follows MDN and the
 * CSS specifications; only features supported in all major browsers are taught.
 */
export default defineCourse({
  id: "code-html-css",
  kind: "learning",
  category: "frontend",
  tags: ["html", "css", "flexbox", "grid", "selectors", "accessibility", "responsive", "box model", "container queries", "cascade layers"],
  provider: { id: "web", name: "HTML & CSS", color: "#e34f26", icon: "🎨" },
  code: "HTML·CSS",
  title: "Learn HTML & CSS",
  shortTitle: "HTML & CSS",
  tagline: "From your first tag to flexbox, grid, container queries and design systems: build real layouts by playing with them.",
  level: "Beginner",
  storageKey: "course:code-html-css:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One best answer. Predict what the browser renders, how big a box is, or which rule wins." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. All of them must be right." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put the lines, layers, or steps in the right order." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair every element, property, or selector with its job. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line(s) of HTML or CSS that cause the problem. The prompt says how many." },
    ],
  },

  guide: {
    source: {
      label: "HTML & CSS syllabus, based on MDN Web Docs and the W3C/WHATWG specifications",
      version: "2026",
      date: "October 2026",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
    },
    facts: [
      { icon: "🌐", value: "2", label: "languages, one page", detail: "HTML describes what the content is; CSS decides how it looks. Every website you have ever used is built on both." },
      { icon: "🧱", value: "Zero", label: "experience needed", detail: "World 1 starts with what a web page is and how a browser turns a text file into pixels. No setup: the labs run right here." },
      { icon: "🧪", value: "Play", label: "learn by changing things", detail: "Toggle flexbox and grid settings, drag box-model sliders, type selectors and duel specificity, and see the result instantly." },
      { icon: "♿", value: "A11y", label: "built in from day one", detail: "Semantic elements, labels, alt text, keyboard focus and contrast are taught alongside the syntax, not as an afterthought." },
      { icon: "✨", value: "Modern", label: "CSS that ships today", detail: "Custom properties, :has(), container queries, nesting and cascade layers all work in current Chrome, Edge, Firefox and Safari." },
      { icon: "🏁", value: "70", label: "to pass the final check", detail: "The final skill check is 30 questions in 45 minutes, scored 0 to 100. Score 70 or more to pass." },
    ],
    candidate: {
      is: [
        "Brand new to web development and wanting a solid, visual foundation",
        "A back-end or mobile developer who \"fights CSS\" and wants to finally understand the cascade and layout",
        "A designer who wants to read and write the HTML and CSS behind their designs",
        "A front-end developer catching up on modern CSS and design-system conventions",
      ],
      isNot: [
        "JavaScript programming (see the JavaScript track) beyond tiny examples",
        "A specific framework (React, Tailwind, Bootstrap) or a build tool",
        "Sass, Less, or other preprocessors",
        "Server setup, hosting, or SEO strategy",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "HTML foundations", icon: "📄", services: ["How browsers render pages", "Elements and attributes", "Document skeleton", "Links, images, lists", "defer and async scripts"] },
        { category: "Semantics and accessibility", icon: "♿", services: ["Landmarks", "Heading outline", "article vs section", "Labels and forms", "button vs div", "alt text", "ARIA basics"] },
        { category: "CSS foundations", icon: "🎨", services: ["Rules and declarations", "Selectors and combinators", "Pseudo-classes and pseudo-elements", "Cascade", "Specificity", "Inheritance", "!important"] },
        { category: "Boxes and units", icon: "📦", services: ["Box model", "box-sizing", "Margin collapsing", "display", "px, rem, em, %, vw"] },
        { category: "Layout", icon: "📐", services: ["Flexbox", "Grid", "fr, repeat(), minmax()", "grid-template-areas", "position", "z-index and stacking contexts"] },
        { category: "Responsive design", icon: "📱", services: ["Viewport meta", "Mobile-first media queries", "clamp()", "srcset and sizes", "Layout shift"] },
        { category: "Modern CSS", icon: "✨", services: ["Custom properties", "@property", ":has()", ":is() and :where()", "Nesting", "Container queries", "@layer"] },
        { category: "CSS at scale", icon: "🏛️", services: ["Design tokens", "Theming", "BEM and scoping", "Specificity strategy", "Linting and visual tests", "Token migrations"] },
      ],
    },
    tips: [
      { icon: "🔍", tip: "Open your browser's DevTools (right-click → Inspect) on any site. The Elements and Styles panels show the DOM, every matching rule, and which ones were crossed out by the cascade." },
      { icon: "🏷️", tip: "Choose the element by meaning first (`<button>`, `<nav>`, `<h2>`), then style it. A native element gives you keyboard support and accessibility for free." },
      { icon: "📦", tip: "Put `*, *::before, *::after { box-sizing: border-box; }` at the top of every stylesheet. Widths then mean what you think they mean." },
      { icon: "🧭", tip: "For layout, ask: one direction (a row or a column)? Use flexbox. Rows and columns together? Use grid." },
      { icon: "📱", tip: "Write mobile-first: base styles for small screens, then `@media (min-width: …)` to add columns as space grows." },
      { icon: "⚖️", tip: "When a style doesn't apply, check in this order: is the rule loaded, does the selector match, is it overridden (crossed out), and is the property valid here?" },
    ],
    officialPractice: { label: "MDN: Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
  },

  cheatsheet: [
    {
      title: "HTML essentials",
      items: [
        ["Skeleton", "<!DOCTYPE html> · <html lang> · <head> (charset, viewport, title) · <body>"],
        ["Landmarks", "<header> <nav> <main> <aside> <footer>"],
        ["Content", "<article> stands alone · <section> is a themed group with a heading"],
        ["Headings", "One <h1>, then h2 → h3 in order; don't skip levels for size"],
        ["Images", "alt describes the image; alt=\"\" for decoration"],
        ["Forms", "<label for> = input id · name is what's submitted"],
        ["Buttons", "<button> acts, <a href> navigates; type=\"button\" inside forms"],
      ],
    },
    {
      title: "Selectors and the cascade",
      items: [
        ["a b / a > b", "Descendant / direct child"],
        ["a + b / a ~ b", "Next sibling / any later sibling"],
        ["[href^=\"https\"]", "Attribute starts with"],
        ["Specificity", "(IDs, classes·attributes·pseudo-classes, types·pseudo-elements)"],
        ["Ties", "Same specificity → the later rule wins"],
        ["Strongest", "!important > inline style > layers order > specificity > order"],
        ["Inherits", "color, font, line-height · not margin, padding, border, background"],
      ],
    },
    {
      title: "Box model and units",
      items: [
        ["Inside → out", "content · padding · border · margin"],
        ["content-box", "width = content only (padding and border add on)"],
        ["border-box", "width includes padding and border"],
        ["Margin collapse", "Vertical margins between blocks → the larger one"],
        ["rem / em", "Root font size / element's (parent's for font-size)"],
        ["vw / %", "1% of viewport width / % of the containing block"],
      ],
    },
    {
      title: "Flexbox and grid",
      items: [
        ["justify-content", "Main axis (row → horizontal)"],
        ["align-items", "Cross axis (row → vertical)"],
        ["flex: 1", "1 1 0% → share free space equally"],
        ["gap", "Space between items only"],
        ["fr", "A share of the leftover space in a grid"],
        ["repeat(auto-fit, minmax(200px, 1fr))", "As many ≥200px columns as fit, stretched"],
        ["grid-column: 1 / -1", "Span every explicit column"],
      ],
    },
    {
      title: "Positioning and responsive",
      items: [
        ["absolute", "Placed against the nearest positioned ancestor"],
        ["sticky", "Needs top/left; breaks under overflow: hidden ancestors"],
        ["z-index", "Positioned or flex/grid items; trapped by stacking contexts"],
        ["Viewport", "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"],
        ["Mobile-first", "Base styles, then @media (min-width: …) in ascending order"],
        ["clamp(min, ideal, max)", "Fluid sizes with limits"],
      ],
    },
    {
      title: "Modern CSS",
      items: [
        ["var(--x, fallback)", "Custom properties inherit; set on :root or a scope"],
        [":has()", "Style a parent by what it contains"],
        [":is() / :where()", "Group selectors; :where() has zero specificity"],
        ["&", "Nesting: &.x same element, & .x descendant"],
        ["@container", "Query the nearest ancestor with container-type"],
        ["@layer a, b;", "Later layer wins; unlayered beats all layers"],
      ],
    },
  ],

  config: {
    quest: { length: 8 },
    boss: { questions: 25, minutes: 30 },
    examModes: [
      { id: "full", name: "Final skill check", icon: "🏁", questions: 30, unscored: 0, minutes: 45, full: true },
      { id: "quick", name: "Quick check", icon: "⚡", questions: 15, unscored: 0, minutes: 20, full: false },
    ],
  },

  boss: { name: "The Specificity Kraken", emoji: "🦑" },
  matchLabel: "HTML elements and CSS features",
  levelTitles: [
    "Tag Toddler",
    "Markup Apprentice",
    "Selector Scout",
    "Box Wrangler",
    "Cascade Tamer",
    "Flexbox Bender",
    "Grid Cartographer",
    "Breakpoint Ranger",
    "Token Alchemist",
    "Cascade Architect",
  ],
});
