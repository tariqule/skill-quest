import { CodeBlock, Flow, Layers, Tiles } from "@/components/learn/blocks";
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
    summary: "How CSS connects to HTML, how to pick the elements you want to style, how the browser decides which rule wins, and how big every box really is.",
  },

  tasks: [
    { id: "2.1", title: "Write CSS rules and selectors", covers: ["rules, declarations and error recovery", "linking stylesheets", "type, class, id and attribute selectors", "combinators", "pseudo-classes and pseudo-elements"] },
    { id: "2.2", title: "Predict the cascade", covers: ["order of appearance", "specificity", "inheritance", "!important and inline styles"] },
    { id: "2.3", title: "Size boxes with the box model and units", covers: ["content, padding, border, margin", "box-sizing", "margin collapsing", "display: block, inline, inline-block", "px, rem, em, %, vw"] },
  ],

  lessons: [
    {
      id: "d2-b-what",
      level: "beginner",
      task: "2.1",
      title: "What CSS is",
      check: ["web-b2-01", "web-b2-02"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="css"
            caption="One rule that turns every main heading purple and makes it bigger."
            code={`h1 {
  color: purple;
  font-size: 40px;
}`}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🎯", title: "Selector: h1", text: "Which elements to style.", color: "#38bdf8" },
              { icon: "🔧", title: "Property: color", text: "What you want to change.", color: "#a78bfa" },
              { icon: "🟣", title: "Value: purple", text: "What to change it to.", color: "#c084fc" },
            ]}
          />
        </div>
      ),
      points: [
        "**CSS** controls how a page looks: colours, fonts, sizes and where things sit.",
        "If HTML is the walls of a house, CSS is the paint, the furniture and how the rooms are arranged.",
        "A CSS **rule** says which elements to style and how. `h1 { color: purple; }` turns every main heading purple.",
        "Inside the curly braces, each line is a **declaration**: a property, a colon, a value, then a semicolon.",
      ],
      tip: "One rule can restyle every page that uses it. That's why sites keep their CSS in a separate file that each page links to.",
    },
    {
      id: "d2-b-boxes",
      level: "beginner",
      task: "2.3",
      title: "Every element is a box",
      check: ["web-b2-03", "web-b2-04"],
      visual: (
        <Layers
          layers={[
            { name: "Margin: the gap on the wall", color: "#f97316", items: ["Space outside the border, between this box and the next"] },
            { name: "Border: the frame", color: "#facc15", items: ["A line around the padding"] },
            { name: "Padding: the card mount", color: "#34d399", items: ["Space inside the border, around the content"] },
            { name: "Content: the photo", color: "#38bdf8", items: ["Your text or image"] },
          ]}
        />
      ),
      points: [
        "The browser draws every element as a rectangle, a **box**, even round-looking buttons and single lines of text.",
        "Think of a framed photo on a wall. The photo is the **content**, the card mount is the **padding**, the frame is the **border**, and the gap to the next frame is the **margin**.",
        "`padding: 16px` adds space inside the border. `margin: 16px` adds space outside it.",
        "`px` stands for pixels, the tiny dots on a screen. Sizes in CSS need a unit like `px`, except for zero.",
      ],
      tip: "Give a box a bright border while you work, like `border: 2px solid red;`. You'll see exactly how big it is and where its edges are.",
    },
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
        "A rule has a **selector**, which picks the elements, and **declarations**, which say what to change. Many rules can apply to the same element.",
        "CSS is forgiving. If a property is misspelt or a value is invalid, the browser skips just that one line and carries on.",
        "Sizes other than 0 need a unit. Write `padding: 20px`, not `padding: 20`.",
        "Link one shared stylesheet from every page. The whole site then uses one set of styles, and the browser only downloads it once.",
      ],
      tip: "In the browser's DevTools Styles panel, a crossed-out line was beaten by another rule, and one with a warning icon was invalid and ignored. Those two cases explain most \"my CSS doesn't work\" moments.",
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
        "Type, class, id and attribute selectors pick elements by what they are. **Combinators**, a space, `>`, `+` or `~`, pick them by where they sit relative to other elements.",
        "`.a.b`, with no space, means one element with both classes. `.a .b`, with a space, means a `.b` somewhere inside an `.a`.",
        "**Pseudo-classes**, like `:hover`, `:focus-visible`, `:nth-child()` and `:checked`, select an element in a certain state or position. **Pseudo-elements**, like `::before` and `::first-line`, select a part of an element.",
        "Use classes for styling. IDs are unique and very strong in the cascade, which makes them hard to override later.",
      ],
      tip: "Read selectors right to left. `nav ul > li a` means \"any link, inside a list item that's a direct child of a list, inside a nav\". That's also how browsers match them.",
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
        "When rules disagree, the **cascade** decides. It checks importance first, then inline styles, then layers, then specificity, then which rule comes last.",
        "**Specificity** is a selector's strength, counted in three columns: IDs, then classes, attributes and pseudo-classes, then element types and pseudo-elements. One ID beats any number of classes.",
        "Some properties pass down from parent to child, like color, font, line-height and text-align. Box properties don't, like margin, padding, border, background and width.",
        "`!important` jumps the queue. Save it for small utility classes and user overrides. Using it to win style fights only starts an arms race.",
      ],
      tip: "When a style loses, find the crossed-out line in DevTools and compare the two selectors' specificity before you reach for !important.",
    },
    {
      id: "d2-box",
      level: "junior",
      task: "2.3",
      title: "The box model, units, and display",
      check: ["d2-19", "d2-20"],
      visual: <BoxModelLab />,
      points: [
        "Every element is a box. From the inside out it has content, then padding, then a border, then margin.",
        "With the default `box-sizing: content-box`, `width` sets only the content, and padding and border are added on top. With `border-box`, they fit inside the width instead.",
        "Vertical margins between blocks **collapse**, which means they overlap. A 30px margin above and a 20px margin below give a 30px gap, not 50px.",
        "`display: block` takes the full width and starts on a new line. `inline` sits inside a line of text and ignores width and height. `inline-block` sits in the text but accepts a size.",
        "Relative units scale with something else. `rem` follows the page's root font size, `em` the element's own font size, `%` the box it's inside, and `vw` the width of the browser window.",
      ],
      tip: "Turn on border-box everywhere with `*, *::before, *::after { box-sizing: border-box; }`. Almost every modern starter stylesheet includes it, for good reason.",
    },
  ],

  questions: [
    {
      id: "web-b2-01",
      domain: "d2",
      lesson: "d2-b-what",
      level: "beginner",
      prompt: "In `h1 { color: purple; }`, what does `h1` do?",
      options: ["Picks which elements the rule styles", "Sets the colour", "Makes the text bigger on the page", "Ends the rule"],
      answer: [0],
      explanation: "The part before the curly braces is the **selector**. Here it picks every `<h1>` on the page, and the declaration inside the braces says what to change.",
    },
    {
      id: "web-b2-02",
      type: "fill",
      domain: "d2",
      lesson: "d2-b-what",
      level: "beginner",
      prompt: "Fill the gap to make paragraph text blue.",
      code: `p {
  {{1}}: blue;
}`,
      codeLang: "css",
      blanks: [{ options: ["color", "background", "font", "text"], answer: 0 }],
      explanation: "`color` sets the colour of the text. `background` would colour the area behind the text instead, and `font` and `text` don't set text colour.",
    },
    {
      id: "web-b2-03",
      domain: "d2",
      lesson: "d2-b-boxes",
      level: "beginner",
      prompt: "Which property adds space inside an element's border?",
      options: ["`padding`", "`margin`", "`border`"],
      answer: [0],
      explanation: "Padding sits between the content and the border, like the card mount inside a frame. Margin is the space outside the border, between boxes.",
    },
    {
      id: "web-b2-04",
      domain: "d2",
      lesson: "d2-b-boxes",
      level: "beginner",
      prompt: "In the framed-photo comparison, what is the margin?",
      options: ["The gap between this frame and the next one", "The photo itself", "The frame", "The card mount inside of each photo frame"],
      answer: [0],
      explanation: "Margin is the space outside a box's border. It keeps neighbouring boxes apart, the way you'd leave a gap between frames on a wall.",
    },
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
      options: ["A declaration (a property and its value)", "A selector", "An at-rule, like `@media` or `@import`, that sets a condition", "A comment"],
      answer: [0],
      explanation: "`p` is the selector. Inside the braces are declarations, and each one is a property (`color`) and a value (`navy`) ending with a semicolon.",
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
        "Copy the same `<style>` block by hand into the `<head>` of every single page",
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
      explanation: "Sizes need a unit, like `20px` or `1.25rem`. Only `0` can go without one. An invalid value means the browser ignores that declaration.",
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
        "Ignores every rule after this one in the stylesheet, so nothing else applies",
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
      explanation: "A space means descendant, `>` means direct child, `+` means the very next sibling, and `~` means any later sibling. In an attribute selector, `^=` means \"starts with\", `$=` means \"ends with\" and `*=` means \"contains\".",
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
      explanation: "Try n as 0, 1, then 2, and you get 1, 3 and 5. `2n+1` is the same as the keyword `odd`, while `2n`, or `even`, gives 2 and 4.",
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
      explanation: "Both rules have the same selector and so the same specificity. When that happens, the rule that comes later in the CSS wins.",
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
      explanation: "From weakest to strongest: (0,0,1), then (0,1,1), then (0,2,0), then (1,0,1). An inline style attribute beats all normal stylesheet rules. Compare IDs first, then classes, then types.",
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
        "Freeze all CSS changes until a full rewrite ships in one release, and in the meantime add `!important` to any new rule that loses to the legacy selectors, so product work can keep going",
      ],
      answer: [0],
      explanation: "Keeping specificity low and even makes the cascade predictable again. A layer lets new code beat old code by layer order instead of heavier selectors, and linting stops the problem coming back. Stronger selectors or inline styles only make the fight worse, and rewriting everything at once is risky.",
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
      explanation: "Content sits in the middle. Padding goes around it and shows the background colour. Then comes the border, then the margin, which is see-through space that pushes other boxes away.",
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
      explanation: "Add the 200px of content, 20px of padding on each side and 5px of border on each side, and you get 250px. The margin adds space outside the border, 270px in total, but it isn't part of the visible box.",
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
      explanation: "With border-box, `width` covers everything up to the border, so the box is 200px. Padding and border are taken out of that: 200 minus 40 minus 10 leaves 150px for the content.",
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
      explanation: "Vertical margins that touch in normal flow collapse into the larger of the two, so 30 and 20 give 30px. Margins don't collapse between flex or grid items, or side to side.",
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
      explanation: "`rem` stays the same across the page. `em` scales with the local font size, and inside `font-size` itself it means the parent's size. What `%` refers to depends on the property. For width, it's the box the element sits in.",
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
      options: ["31.25px", "20px", "25px", "62.5px"],
      answer: [0],
      explanation: "`em` in font-size multiplies the parent's size, so it builds up at each level: 16 times 1.25 is 20, then 25, then 31.25px. With `1.25rem`, every level would be 20px.",
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
        "A 200 × 50px gold box shown in the middle of the line of text",
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
        "Keep `px` everywhere and tell users to use browser zoom instead of font size",
      ],
      answer: [0],
      explanation: "`rem` scales from the root font size, which respects the user's preference, and stays predictable because it doesn't compound like `em`. Pure `vw` text ignores the user's setting. Zoom works, but honouring the font-size preference is part of accessible design.",
    },
  ],

  cards: [
    { id: "c-d2-rule", domain: "d2", kind: "concept", term: "Rule", definition: "A selector plus a block of declarations: `.card { padding: 16px; }`." },
    { id: "c-d2-cascade", domain: "d2", kind: "concept", term: "Cascade", definition: "The process that picks one winning value when rules disagree. It checks importance, inline styles, layers, specificity, then order." },
    { id: "c-d2-specificity", domain: "d2", kind: "concept", term: "Specificity", definition: "A selector's strength, counted in three columns: IDs, then classes, attributes and pseudo-classes, then types and pseudo-elements. Compared one column at a time." },
    { id: "c-d2-inheritance", domain: "d2", kind: "concept", term: "Inheritance", definition: "Some properties, like color, font and line-height, pass from parent to child. Box properties, like margin, border and background, don't." },
    { id: "c-d2-important", domain: "d2", kind: "service", term: "!important", definition: "Marks a declaration as important, beating all normal declarations, inline styles included. Use sparingly." },
    { id: "c-d2-combinators", domain: "d2", kind: "concept", term: "Combinators", definition: "A space for descendants, `>` for direct children, `+` for the next sibling and `~` for any later sibling. They add no specificity." },
    { id: "c-d2-nth", domain: "d2", kind: "service", term: ":nth-child()", definition: "Matches elements by their position among siblings, like `:nth-child(2)`, `odd`, `even` or `3n+1`." },
    { id: "c-d2-pseudo-el", domain: "d2", kind: "service", term: "::before / ::after", definition: "Pseudo-elements that insert generated content (`content: \"…\"`) as the first or last child of an element." },
    { id: "c-d2-boxsizing", domain: "d2", kind: "service", term: "box-sizing", definition: "With `content-box`, the default, width covers the content only. With `border-box`, width includes padding and border." },
    { id: "c-d2-collapse", domain: "d2", kind: "concept", term: "Margin collapsing", definition: "Vertical margins that touch in normal flow merge into the larger one. This doesn't happen in flex or grid layouts." },
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
      hint: "With content-box, the visible width is the width plus the padding on both sides plus the border on both sides.",
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
      hint: "Compare IDs, then classes, then types, from left to right. Inline styles and !important are checked before specificity.",
      takeaway: "The cascade follows fixed steps: importance, inline styles, specificity one column at a time, then order. So you can always predict the winner.",
      render: (onSolved) => <SpecificityDuelLab goal="basics" onSolved={onSolved} />,
    },
  ],
});
