import { CodeBlock, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { BoxModelLab, SelectorLab, SpecificityDuelLab } from "../labs";

/** World 2: CSS rules, selectors, the cascade, specificity and inheritance, the box model, units and display. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "CSS Foundations",
    world: "The Cascade Caverns",
    weight: 25,
    emoji: "🎨",
    color: "#2965f1",
    summary: "How CSS attaches to HTML, selectors and combinators, the cascade, specificity and inheritance, and how big every box really is.",
  },

  tasks: [
    { id: "2.1", title: "Write CSS rules and selectors", covers: ["rules, declarations and error recovery", "linking stylesheets", "type, class, id and attribute selectors", "combinators", "pseudo-classes and pseudo-elements"] },
    { id: "2.2", title: "Predict the cascade", covers: ["order of appearance", "specificity", "inheritance", "!important and inline styles"] },
    { id: "2.3", title: "Size boxes with the box model and units", covers: ["content, padding, border, margin", "box-sizing", "margin collapsing", "display: block, inline, inline-block", "px, rem, em, %, vw"] },
  ],

  lessons: [
    {
      id: "d2-rules",
      level: "junior",
      task: "2.1",
      title: "How CSS attaches: rules and declarations",
      check: ["d2-01", "d2-03"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="css"
            caption="A rule = a selector + a block of declarations. Each declaration is property: value; and ends with a semicolon."
            code={`/* selector: which elements */
.card {
  /* declaration = property: value; */
  background: white;
  padding: 16px;
  border-radius: 8px;
}`}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔗", title: "External file", text: "`<link rel=\"stylesheet\" href=\"styles.css\">` in the head. One file styles every page and is cached.", color: "#34d399" },
              { icon: "📄", title: "<style> block", text: "CSS inside the page's `<head>`. Handy for demos or critical styles.", color: "#38bdf8" },
              { icon: "✋", title: "style attribute", text: "`style=\"color: red\"` on one element. Hard to reuse and beats normal stylesheet rules.", color: "#f97316" },
            ]}
          />
        </div>
      ),
      points: [
        "A rule has a selector (which elements) and declarations (what to change). Many rules can apply to the same element.",
        "CSS is forgiving: an unknown property or invalid value drops just that declaration, and the browser carries on.",
        "Lengths other than 0 need a unit: `padding: 20px`, not `padding: 20`.",
        "Link one external stylesheet from every page so the whole site shares, and caches, one set of styles.",
      ],
      tip: "In DevTools' Styles panel, a declaration with a strike-through was overridden; one with a warning icon was invalid and ignored. Those two cases explain most \"my CSS doesn't work\" moments.",
    },
    {
      id: "d2-selectors",
      level: "junior",
      task: "2.1",
      title: "Selectors and combinators",
      check: ["d2-07", "d2-08"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="css"
            code={`p            { }  /* type: every <p> */
.lead        { }  /* class: class="lead" */
#title       { }  /* id: id="title" (unique) */
[href^="https"] { } /* attribute starts with */
nav a        { }  /* descendant: any <a> inside <nav> */
ul > li      { }  /* child: direct children only */
h2 + p       { }  /* the <p> right after an <h2> */
li:hover     { }  /* pseudo-class: a state */
p::first-line { } /* pseudo-element: a part */`}
          />
          <SelectorLab />
        </div>
      ),
      points: [
        "Type, class, id and attribute selectors pick elements by what they are; combinators (space, `>`, `+`, `~`) pick them by where they are.",
        "`.a.b` (no space) is one element with both classes; `.a .b` (space) is a `.b` somewhere inside an `.a`.",
        "Pseudo-classes (`:hover`, `:focus-visible`, `:nth-child()`, `:checked`) select states and positions; pseudo-elements (`::before`, `::first-line`) select parts.",
        "Prefer classes for styling. IDs are unique and very specific, which makes them hard to override.",
      ],
      tip: "Read selectors right to left: `nav ul > li a` is \"any link, inside a list item that is a direct child of a list, inside a nav\". That's also how browsers match them.",
    },
    {
      id: "d2-cascade",
      level: "intermediate",
      task: "2.2",
      title: "The cascade, specificity, and inheritance",
      check: ["d2-06", "d2-13"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#2965f1"
            steps={[
              { icon: "❗", label: "Importance", sub: "!important declarations beat normal ones" },
              { icon: "✋", label: "Inline style", sub: "style=\"…\" beats selector-based rules" },
              { icon: "🥞", label: "Layers", sub: "Later @layer wins (World 4)" },
              { icon: "⚖️", label: "Specificity", sub: "(IDs, classes, types): compare left to right" },
              { icon: "⏬", label: "Order", sub: "Still tied? The later rule wins" },
            ]}
          />
          <CodeBlock
            lang="css"
            caption="Specificity is three counters, compared column by column. Combinators and * count for nothing."
            code={`p                 /* (0,0,1) */
p.intro           /* (0,1,1) */
.card .title      /* (0,2,0) */
nav li:hover a    /* (0,1,3) */
#main p           /* (1,0,1) */
* > p             /* (0,0,1) */`}
          />
        </div>
      ),
      points: [
        "When rules conflict, the cascade decides: importance, then inline styles, then layers, then specificity, then order of appearance.",
        "Specificity counts (IDs, classes + attributes + pseudo-classes, types + pseudo-elements). One ID beats any number of classes.",
        "Some properties inherit from the parent (color, font, line-height, text-align); box properties don't (margin, padding, border, background, width).",
        "`!important` jumps the queue. Save it for utilities and user overrides; using it to win fights starts an arms race.",
      ],
      tip: "When a style loses, look at the crossed-out declaration in DevTools and compare the two selectors' specificity before reaching for !important.",
    },
    {
      id: "d2-box",
      level: "junior",
      task: "2.3",
      title: "The box model, units, and display",
      check: ["d2-19", "d2-20"],
      visual: <BoxModelLab />,
      points: [
        "Every element is a box: content, then padding, then border, then margin on the outside.",
        "With the default `box-sizing: content-box`, `width` sets only the content; padding and border are added on. `border-box` puts them inside the width.",
        "Vertical margins between blocks collapse: 30px above and 20px below gives a 30px gap, not 50px.",
        "`display: block` takes the full width and starts a new line; `inline` flows in text and ignores width and height; `inline-block` flows in text but accepts sizes.",
        "`rem` is relative to the root font size, `em` to the element's font size, `%` to the containing block, `vw` to the viewport width.",
      ],
      tip: "Turn on border-box globally with `*, *::before, *::after { box-sizing: border-box; }`. It's in almost every modern reset for a reason.",
    },
  ],

  questions: [
    // ── d2-rules ──
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-rules",
      level: "junior",
      prompt: "In this rule, what is `color: navy;`?",
      code: `p {
  color: navy;
  font-size: 18px;
}`,
      codeLang: "css",
      options: ["A declaration (a property and its value)", "A selector", "An at-rule", "A comment"],
      answer: [0],
      explanation: "`p` is the selector. Inside the braces are declarations, each a property (`color`) and a value (`navy`) ending with a semicolon.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-rules",
      level: "junior",
      prompt: "What's the usual way to apply one stylesheet to every page of a site?",
      options: [
        "`<link rel=\"stylesheet\" href=\"/styles.css\">` in each page's `<head>`",
        "A `style` attribute on every element",
        "Copy a `<style>` block into each page",
        "An `<import>` element in the body",
      ],
      answer: [0],
      explanation: "A linked external stylesheet is shared and cached across pages, so changing one file restyles the whole site. There's no `<import>` element.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-rules",
      level: "junior",
      type: "lines",
      prompt: "The alert's text isn't white and its background isn't crimson; only the padding works. Tap the buggy line.",
      code: `.alert {
  color: white
  background: crimson;
  padding: 12px;
}`,
      codeLang: "css",
      answer: [2],
      explanation: "Without the semicolon, the browser reads one declaration: `color: white background: crimson`. That isn't a valid colour, so the whole thing is dropped, taking the background with it.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-rules",
      level: "junior",
      type: "lines",
      prompt: "The card has no padding at all. Tap the buggy line.",
      code: `.card {
  padding: 20;
  margin: 0;
  border: 1px solid #ddd;
}`,
      codeLang: "css",
      answer: [2],
      explanation: "Lengths need a unit (`20px`, `1.25rem`). Only `0` may be unitless. An invalid value means the declaration is ignored.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-rules",
      level: "intermediate",
      prompt: "What does the browser do with this rule?",
      code: `.box {
  colr: red;
  width: 50%;
}`,
      codeLang: "css",
      options: [
        "Ignores the unknown `colr` declaration and still applies `width: 50%`",
        "Ignores the whole rule",
        "Ignores every rule after this one",
        "Guesses that you meant `color`",
      ],
      answer: [0],
      explanation: "CSS error handling is per declaration: unknown properties and invalid values are skipped, everything else applies. That's also what lets new CSS features degrade gracefully in older browsers.",
    },

    // ── d2-selectors ──
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-selectors",
      level: "junior",
      type: "match",
      prompt: "Match each selector to what it selects.",
      pairs: [
        ["`nav a`", "Any link inside a nav, at any depth"],
        ["`nav > a`", "Links that are direct children of a nav"],
        ["`h2 + p`", "The paragraph immediately after an h2"],
        ["`h2 ~ p`", "Every later paragraph sibling of an h2"],
        ["`a[href^=\"https\"]`", "Links whose href starts with https"],
      ],
      explanation: "Space = descendant, `>` = child, `+` = next sibling, `~` = any following sibling. `^=` in an attribute selector means \"starts with\" (`$=` ends with, `*=` contains).",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-selectors",
      level: "junior",
      prompt: "Which selector matches only \"Shop\"?",
      code: `<ul class="menu">
  <li>Home</li>
  <li class="active">Shop</li>
  <li>About</li>
</ul>`,
      codeLang: "html",
      options: ["`.menu .active`", "`.menu li`", "`li:first-child`", "`ul > li`"],
      answer: [0],
      explanation: "`.menu .active` means \"an element with class active inside .menu\". `.menu li` and `ul > li` match all three items, and `li:first-child` matches Home.",
    },
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-selectors",
      level: "intermediate",
      prompt: "A list has five `<li>` items. Which ones does `li:nth-child(2n+1)` match?",
      code: `li:nth-child(2n+1) { background: #eef; }`,
      codeLang: "css",
      options: ["The 1st, 3rd and 5th", "The 2nd and 4th", "Only the 1st", "Every item after the 2nd"],
      answer: [0],
      explanation: "Plug in n = 0, 1, 2…: 1, 3, 5. `2n+1` is the same as the keyword `odd`; `2n` (or `even`) gives 2 and 4.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-selectors",
      level: "junior",
      prompt: "Which of these is a pseudo-element rather than a pseudo-class?",
      options: ["`::first-line`", "`:hover`", "`:focus-visible`", "`:nth-child(2)`"],
      answer: [0],
      explanation: "Pseudo-elements (double colon) target a part of an element, like `::before`, `::after`, `::first-line` or `::placeholder`. Pseudo-classes (single colon) target a state or position.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-selectors",
      level: "intermediate",
      prompt: "What's the difference between `.card.featured` and `.card .featured`?",
      options: [
        "The first matches one element with both classes; the second matches a `.featured` element inside a `.card`",
        "They are identical; spaces don't matter in selectors",
        "The first matches a `.featured` inside a `.card`; the second matches one element with both classes",
        "The first is invalid CSS",
      ],
      answer: [0],
      explanation: "In selectors, a space is the descendant combinator. Chaining without a space (`.card.featured`, `a.button`) narrows down a single element.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-selectors",
      level: "senior",
      type: "lines",
      prompt: "No link ever turns teal, though many hrefs start with https://. Tap the buggy line.",
      code: `/* Highlight external links in articles */
article a[href="https"] {
  color: teal;
}
article a[target="_blank"]::after {
  content: " ↗";
}`,
      codeLang: "css",
      answer: [2],
      explanation: "`[href=\"https\"]` only matches an href that is exactly \"https\". \"Starts with\" is `[href^=\"https\"]`.",
    },

    // ── d2-cascade ──
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-cascade",
      level: "junior",
      prompt: "What colour is the button's background?",
      code: `.btn { background: blue; }
.btn { background: green; }`,
      codeLang: "css",
      options: ["Green", "Blue", "A mix of both", "Neither: conflicting rules cancel out"],
      answer: [0],
      explanation: "Same selector, same specificity, so order of appearance decides: the later rule wins.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-cascade",
      level: "intermediate",
      prompt: "What colour is the link?",
      code: `/* <a id="home" class="link" href="/">Home</a> */
#home { color: red; }
.link { color: blue; }
a     { color: green; }`,
      codeLang: "css",
      options: ["Red", "Blue", "Green", "The browser's default link blue"],
      answer: [0],
      explanation: "All three match. `#home` has specificity (1,0,0), beating `.link` (0,1,0) and `a` (0,0,1). Specificity is checked before order, so being earlier doesn't matter.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-cascade",
      level: "intermediate",
      type: "order",
      prompt: "Order these from weakest to strongest when they all set the same property on the same element.",
      items: ["`p`", "`p.intro`", "`.intro.lead`", "`#main p`", "`style=\"…\"` attribute"],
      explanation: "(0,0,1) < (0,1,1) < (0,2,0) < (1,0,1), and an inline style attribute beats all normal stylesheet rules. Compare IDs first, then classes, then types.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-cascade",
      level: "intermediate",
      prompt: "What does the `<p>` inherit from `.panel`?",
      code: `/* <div class="panel"><p>Hi</p></div> */
.panel {
  color: purple;
  border: 2px solid purple;
}`,
      codeLang: "css",
      options: ["Purple text, but no border", "A purple border and purple text", "Nothing: only matched elements are styled", "A border, but not the colour"],
      answer: [0],
      explanation: "`color` is an inherited property, so the paragraph's text is purple. `border` is not inherited, so only the panel itself gets a border.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-cascade",
      level: "senior",
      prompt: "What colour is the text?",
      code: `/* <p class="note" style="color: blue">Hi</p> */
.note { color: red !important; }`,
      codeLang: "css",
      options: ["Red", "Blue", "Purple", "Black"],
      answer: [0],
      explanation: "Importance is checked before everything else. An `!important` author declaration beats a normal inline style. Only an inline `!important` (or a user's important style) would beat it.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-cascade",
      level: "senior",
      prompt: "Which statement about specificity is true?",
      options: [
        "One ID selector beats a selector with any number of classes",
        "Eleven class selectors beat one ID selector",
        "The universal selector `*` adds 1 to the type column",
        "Combinators like `>` and `+` add to specificity",
      ],
      answer: [0],
      explanation: "The columns are compared left to right and never overflow into each other: (1,0,0) beats (0,11,0). `*` and combinators contribute nothing.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-cascade",
      level: "staff",
      prompt: "A legacy app's CSS is a specificity war: selectors like `#app .page .content .btn` and `!important` everywhere. What's the most sustainable direction for the team?",
      options: [
        "Agree on flat, single-class selectors (a naming convention such as BEM), put the legacy CSS in a low-priority cascade layer, and lint against IDs and !important in new code",
        "Add an extra ID to every new selector so new styles always win",
        "Move all styles into inline `style` attributes",
        "Freeze all CSS changes until a full rewrite ships in one release",
      ],
      answer: [0],
      explanation: "Low, uniform specificity makes the cascade predictable again; a layer lets new code beat old code by layer order instead of heavier selectors; linting stops the problem returning. Escalating specificity or inline styles deepen the war, and a big-bang rewrite is risky.",
    },

    // ── d2-box ──
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-box",
      level: "junior",
      type: "order",
      prompt: "Order the parts of the CSS box model from the inside out.",
      items: ["Content", "Padding", "Border", "Margin"],
      explanation: "Content in the middle, padding around it (it shows the background), then the border, then margin: transparent space that pushes other boxes away.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-box",
      level: "junior",
      prompt: "With the default `box-sizing: content-box`, how wide is this box from border edge to border edge?",
      code: `.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
}`,
      codeLang: "css",
      options: ["250px", "200px", "240px", "270px"],
      answer: [0],
      explanation: "200 (content) + 2 × 20 (padding) + 2 × 5 (border) = 250px. The margin adds space outside the border (270px in total footprint) but isn't part of the visible box.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-box",
      level: "intermediate",
      prompt: "Now with `box-sizing: border-box`, how wide is the content area?",
      code: `.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}`,
      codeLang: "css",
      options: ["150px", "200px", "160px", "250px"],
      answer: [0],
      explanation: "With border-box, `width` is the border box: 200px. Padding and border are carved out of it, leaving 200 − 40 − 10 = 150px of content.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-box",
      level: "intermediate",
      prompt: "How much space is there between the two blocks?",
      code: `/* <div class="a">One</div>
   <div class="b">Two</div>   (normal block flow) */
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }`,
      codeLang: "css",
      options: ["30px", "50px", "20px", "25px"],
      answer: [0],
      explanation: "Adjacent vertical margins in normal block flow collapse into the larger one: max(30, 20) = 30px. Margins don't collapse between flex or grid items, or horizontally.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-box",
      level: "intermediate",
      type: "match",
      prompt: "Match each unit to what it's relative to.",
      pairs: [
        ["`rem`", "The root (html) element's font size"],
        ["`em` (in padding)", "The element's own font size"],
        ["`%` (in width)", "The containing block's width"],
        ["`vw`", "1% of the viewport's width"],
        ["`px`", "A fixed CSS pixel"],
      ],
      explanation: "`rem` stays consistent across the page; `em` scales with the local font size (for `font-size` itself, it's the parent's size). `%` depends on the property; for width it's the containing block.",
    },
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-box",
      level: "senior",
      prompt: "What is the font size of the text \"Deep\"?",
      code: `html  { font-size: 16px; }
.list { font-size: 1.25em; }
/* <div class="list">
     <div class="list">
       <div class="list">Deep</div>
     </div>
   </div> */`,
      codeLang: "css",
      options: ["31.25px", "20px", "25px", "16px"],
      answer: [0],
      explanation: "`em` in font-size multiplies the parent's size, so it compounds: 16 × 1.25 = 20, × 1.25 = 25, × 1.25 = 31.25px. With `1.25rem` every level would be 20px.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-box",
      level: "junior",
      prompt: "This `<span class=\"tag\">` sits inside a paragraph. How does it look?",
      code: `span.tag {
  width: 200px;
  height: 50px;
  padding: 4px 8px;
  background: gold;
}`,
      codeLang: "css",
      options: [
        "Only as wide as its text: an inline element ignores width and height",
        "A 200 × 50px gold box in the middle of the text",
        "It moves onto its own line",
        "It disappears",
      ],
      answer: [0],
      explanation: "A span is `display: inline`, so `width` and `height` don't apply. Padding paints, but vertical padding doesn't push the surrounding lines apart. Use `display: inline-block` to size it while keeping it in the text.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-box",
      level: "staff",
      prompt: "Your design system sets every font size and spacing value in `px`. Users who raise the default font size in their browser settings see no change. What should the system standardise on?",
      options: [
        "`rem` for font sizes and most spacing, keeping `px` for hairlines such as 1px borders",
        "`em` everywhere, so sizes follow the parent",
        "`vw` for all font sizes",
        "Keep `px` and tell users to use browser zoom instead",
      ],
      answer: [0],
      explanation: "`rem` scales from the root font size, which respects the user's preference, and stays predictable because it doesn't compound like `em`. Pure `vw` text ignores the user's setting. Zoom works, but honouring the font-size preference is part of accessible design.",
    },
  ],

  cards: [
    { id: "c-d2-rule", domain: "d2", kind: "concept", term: "Rule", definition: "A selector plus a block of declarations: `.card { padding: 16px; }`." },
    { id: "c-d2-cascade", domain: "d2", kind: "concept", term: "Cascade", definition: "The algorithm that picks one winning value when rules conflict: importance, inline, layers, specificity, then order." },
    { id: "c-d2-specificity", domain: "d2", kind: "concept", term: "Specificity", definition: "A selector's weight as (IDs, classes/attributes/pseudo-classes, types/pseudo-elements), compared column by column." },
    { id: "c-d2-inheritance", domain: "d2", kind: "concept", term: "Inheritance", definition: "Some properties (color, font, line-height) pass from parent to child; box properties (margin, border, background) don't." },
    { id: "c-d2-important", domain: "d2", kind: "service", term: "!important", definition: "Marks a declaration as important, beating all normal declarations, inline styles included. Use sparingly." },
    { id: "c-d2-combinators", domain: "d2", kind: "concept", term: "Combinators", definition: "Space (descendant), `>` (child), `+` (next sibling), `~` (later sibling). They add no specificity." },
    { id: "c-d2-nth", domain: "d2", kind: "service", term: ":nth-child()", definition: "Matches by position among siblings: `:nth-child(2)`, `odd`, `even`, `3n+1`." },
    { id: "c-d2-pseudo-el", domain: "d2", kind: "service", term: "::before / ::after", definition: "Pseudo-elements that insert generated content (`content: \"…\"`) as the first or last child of an element." },
    { id: "c-d2-boxsizing", domain: "d2", kind: "service", term: "box-sizing", definition: "`content-box` (default): width is the content only. `border-box`: width includes padding and border." },
    { id: "c-d2-collapse", domain: "d2", kind: "concept", term: "Margin collapsing", definition: "Adjacent vertical margins in block flow merge into the larger one. Not in flex or grid layouts." },
    { id: "c-d2-display", domain: "d2", kind: "service", term: "display", definition: "Sets the box type: `block`, `inline`, `inline-block`, `flex`, `grid`, `none`." },
    { id: "c-d2-rem", domain: "d2", kind: "service", term: "rem", definition: "Relative to the root element's font size (often 16px). Respects the user's font-size preference without compounding." },
    { id: "c-d2-em", domain: "d2", kind: "service", term: "em", definition: "Relative to the element's own font size (the parent's when used in font-size). Compounds when nested." },
  ],

  challenges: [
    {
      id: "ch-css-external",
      domain: "d2",
      lesson: "d2-selectors",
      title: "Select only the external links",
      goal: "Type a selector that matches exactly the two links that go to https:// sites, and nothing else.",
      hint: "Attribute selectors can test how a value starts: `[attr^=\"…\"]`.",
      takeaway: "`a[href^=\"https\"]` selects by attribute prefix. Attribute selectors let you style by data you already have, without adding classes.",
      render: (onSolved) => <SelectorLab goal="external" onSolved={onSolved} />,
    },
    {
      id: "ch-css-fit",
      domain: "d2",
      lesson: "d2-box",
      title: "Make it exactly 240px",
      goal: "Keep box-sizing: content-box and give the box at least 20px padding and at least 4px border, with a visible width (border edge to border edge) of exactly 240px.",
      hint: "With content-box, visible width = width + 2 × padding + 2 × border.",
      takeaway: "Under content-box you have to subtract padding and border yourself. That arithmetic is why most projects switch to border-box.",
      render: (onSolved) => <BoxModelLab goal="fit" onSolved={onSolved} />,
    },
    {
      id: "ch-css-borderbox",
      domain: "d2",
      lesson: "d2-box",
      title: "Padding without growing",
      goal: "Switch to border-box, set padding to at least 24px and a border of at least 2px, and keep the visible width equal to the width property.",
      hint: "One setting changes what `width` measures.",
      takeaway: "With border-box, padding and border are carved out of the width, so `width: 200px` means 200px on screen.",
      render: (onSolved) => <BoxModelLab goal="borderbox" onSolved={onSolved} />,
    },
    {
      id: "ch-css-duel",
      domain: "d2",
      lesson: "d2-cascade",
      title: "Specificity duel",
      goal: "Pick the winning rule in at least 6 of 8 duels.",
      hint: "Compare (IDs, classes, types) left to right. Inline styles and !important come before specificity.",
      takeaway: "The cascade is mechanical: importance, inline, specificity column by column, then order. You can always predict the winner.",
      render: (onSolved) => <SpecificityDuelLab goal="basics" onSolved={onSolved} />,
    },
  ],
});
