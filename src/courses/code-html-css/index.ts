import { defineCourse, withQuestions } from "@/engine/define";
import { moreQuestions } from "./more";
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

  domains: withQuestions([d1, d2, d3, d4], moreQuestions),

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
      { icon: "🌐", value: "2", label: "languages, one page", detail: "HTML describes what the content is, and CSS decides how it looks. Every website you've ever used is built on both." },
      { icon: "🧱", value: "Zero", label: "experience needed", detail: "The Beginner level starts from zero: what HTML and CSS are and how to write your first tags. There's no setup, because the labs run right here." },
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
      { icon: "🔍", tip: "Open your browser's DevTools on any site by right-clicking and choosing Inspect. The Elements and Styles panels show the DOM, every rule that matches, and which ones the cascade crossed out." },
      { icon: "🏷️", tip: "Choose the element by meaning first (`<button>`, `<nav>`, `<h2>`), then style it. A native element gives you keyboard support and accessibility for free." },
      { icon: "📦", tip: "Put `*, *::before, *::after { box-sizing: border-box; }` at the top of every stylesheet. Widths then mean what you think they mean." },
      { icon: "🧭", tip: "For layout, ask one question. Is it one direction, a row or a column? Use flexbox. Rows and columns together? Use grid." },
      { icon: "📱", tip: "Write mobile-first. Start with styles for small screens, then use `@media (min-width: …)` to add columns as space grows." },
      { icon: "⚖️", tip: "When a style doesn't apply, check in this order: is the rule loaded, does the selector match, is it overridden (crossed out), and is the property valid here?" },
    ],
    officialPractice: { label: "MDN: Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
  },

  cheatsheet: [
    {
      title: "HTML essentials",
      items: [
        ["Skeleton", "<!DOCTYPE html>, then <html lang>, a <head> with charset, viewport and title, then <body>"],
        ["Landmarks", "<header> <nav> <main> <aside> <footer>"],
        ["Content", "<article> stands on its own. <section> is a group of related content with a heading."],
        ["Headings", "One <h1>, then h2 and h3 in order. Don't skip levels to get a smaller size."],
        ["Images", "alt describes the image. Use alt=\"\" for decoration."],
        ["Forms", "<label for> must match the input's id. name is what gets submitted."],
        ["Buttons", "<button> does things, <a href> goes places. Use type=\"button\" for non-submit buttons in forms."],
      ],
    },
    {
      title: "Selectors and the cascade",
      items: [
        ["a b / a > b", "Anywhere inside, or a direct child"],
        ["a + b / a ~ b", "The very next sibling, or any later sibling"],
        ["[href^=\"https\"]", "Attribute starts with"],
        ["Specificity", "Three columns: IDs, then classes, attributes and pseudo-classes, then types and pseudo-elements"],
        ["Ties", "With equal specificity, the later rule wins"],
        ["Strongest", "!important, then inline style, then layer order, then specificity, then source order"],
        ["Inherits", "color, font and line-height do. margin, padding, border and background don't."],
      ],
    },
    {
      title: "Box model and units",
      items: [
        ["Inside to outside", "content, padding, border, margin"],
        ["content-box", "width is the content only. Padding and border are added on."],
        ["border-box", "width includes padding and border"],
        ["Margin collapse", "Touching vertical margins between blocks become the larger one"],
        ["rem / em", "rem follows the root font size. em follows the element's own, or the parent's inside font-size."],
        ["vw / %", "1vw is 1% of the window width. % is a share of the box it's in."],
      ],
    },
    {
      title: "Flexbox and grid",
      items: [
        ["justify-content", "Spreads items along the main axis, which is horizontal in a row"],
        ["align-items", "Lines items up on the cross axis, which is vertical in a row"],
        ["flex: 1", "Means 1 1 0%, so items share the free space equally"],
        ["gap", "Space between items only"],
        ["fr", "A share of the leftover space in a grid"],
        ["repeat(auto-fit, minmax(200px, 1fr))", "As many columns of at least 200px as fit, stretched to fill"],
        ["grid-column: 1 / -1", "Span every explicit column"],
      ],
    },
    {
      title: "Positioning and responsive",
      items: [
        ["absolute", "Placed against the nearest positioned ancestor"],
        ["sticky", "Needs top or left. An ancestor with overflow: hidden stops it working."],
        ["z-index", "Works on positioned elements and flex or grid items. Can't escape its stacking context."],
        ["Viewport", "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"],
        ["Mobile-first", "Base styles first, then @media (min-width: …) blocks from smallest to largest"],
        ["clamp(min, ideal, max)", "Fluid sizes with limits"],
      ],
    },
    {
      title: "Modern CSS",
      items: [
        ["var(--x, fallback)", "Custom properties pass down. Set them on :root or on one part of the page."],
        [":has()", "Style a parent by what it contains"],
        [":is() / :where()", "Group selectors; :where() has zero specificity"],
        ["&", "In nesting, &.x is the same element and & .x is something inside it"],
        ["@container", "Query the nearest ancestor with container-type"],
        ["@layer a, b;", "The later layer wins, and unlayered styles beat all layers"],
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
