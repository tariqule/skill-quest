import { CodeBlock, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { FlexGridLab } from "../labs";
import { FlexAxisVisual, GridAreasVisual, PositionVisual, ResponsiveVisual } from "../visuals";

/** World 3: flexbox, grid, positioning and stacking, responsive design. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Layout and Responsive Design",
    world: "The Flexgrid Fortress",
    weight: 30,
    emoji: "📐",
    color: "#a78bfa",
    summary: "Flexbox for rows and columns, grid for two-dimensional layouts, positioning and stacking, and pages that adapt from phone to desktop.",
  },

  tasks: [
    { id: "3.1", title: "Lay out with flexbox", covers: ["main and cross axes", "justify-content and align-items", "flex-grow, flex-shrink, flex-basis", "wrap and gap"] },
    { id: "3.2", title: "Lay out with grid", covers: ["grid-template-columns and fr", "repeat(), minmax(), auto-fit", "line-based placement", "grid-template-areas"] },
    { id: "3.3", title: "Position and stack elements", covers: ["static, relative, absolute, fixed, sticky", "containing blocks", "z-index and stacking contexts"] },
    { id: "3.4", title: "Make layouts responsive", covers: ["viewport meta", "mobile-first media queries", "fluid sizing with clamp()", "responsive images and layout shift"] },
  ],

  lessons: [
    {
      id: "d3-flex",
      level: "junior",
      task: "3.1",
      title: "Flexbox: one direction at a time",
      check: ["d3-01", "d3-03"],
      visual: (
        <div className="grid gap-3">
          <FlexAxisVisual />
          <CodeBlock
            lang="css"
            caption="The flex shorthand on items: grow, shrink, basis."
            code={`.item       { flex: 1; }      /* 1 1 0%: share space equally */
.sidebar    { flex: 0 0 240px; } /* fixed 240px, never grow or shrink */
.main       { flex: 1 1 auto; }  /* start at content size, then flex */`}
          />
        </div>
      ),
      points: [
        "`display: flex` on a container lays its children out along one axis: a row by default, or a column with `flex-direction: column`.",
        "`justify-content` distributes items along the main axis; `align-items` aligns them on the cross axis. Swap the direction and the axes swap too.",
        "`gap` puts space between items only, never at the edges.",
        "Items share leftover space by `flex-grow` and give up space by `flex-shrink`, starting from `flex-basis`.",
      ],
      tip: "Centering anything, finally: `display: flex; justify-content: center; align-items: center;` on the parent. (Or `display: grid; place-items: center;`.)",
    },
    {
      id: "d3-grid",
      level: "intermediate",
      task: "3.2",
      title: "Grid: rows and columns together",
      check: ["d3-09", "d3-10"],
      visual: (
        <div className="grid gap-3">
          <GridAreasVisual />
          <CodeBlock
            lang="css"
            caption="A responsive card grid with no media queries."
            code={`.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.cards .hero { grid-column: 1 / -1; } /* span every column */`}
          />
        </div>
      ),
      points: [
        "Grid defines columns and rows on the parent; children drop into cells automatically, row by row.",
        "`fr` is a share of the leftover space after fixed tracks and gaps: `200px 1fr 2fr` gives the last column twice the middle one.",
        "`repeat(auto-fit, minmax(200px, 1fr))` fits as many columns of at least 200px as possible and stretches them to fill the row.",
        "Place items by line numbers (`grid-column: 1 / 3`, `span 2`, `1 / -1`) or by named areas with `grid-template-areas`.",
      ],
      tip: "Flex or grid? If you're thinking in one direction (a toolbar, a row of tags), use flex. If you need things to line up in both rows and columns, use grid.",
    },
    {
      id: "d3-position",
      level: "intermediate",
      task: "3.3",
      title: "Positioning and stacking",
      check: ["d3-16", "d3-17"],
      visual: (
        <div className="grid gap-3">
          <PositionVisual />
          <Tiles
            tiles={[
              { icon: "🥞", title: "z-index needs a context", text: "It works on positioned elements and flex/grid items, and only competes with siblings inside the same stacking context.", color: "#a78bfa" },
              { icon: "🧱", title: "New stacking contexts", text: "Created by `position` + `z-index`, `opacity` below 1, `transform`, `filter`, and `isolation: isolate`, among others.", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "`relative` nudges an element but keeps its space; `absolute` removes it from flow and places it against the nearest positioned ancestor.",
        "`fixed` pins to the viewport; `sticky` scrolls normally until it reaches its `top` (or other) offset, then sticks within its scroll container.",
        "Give the parent `position: relative` to make it the anchor for an absolutely positioned badge or close button.",
        "A child's `z-index: 9999` can't escape its parent's stacking context; raise or restructure the parent instead.",
      ],
      tip: "When sticky doesn't stick, look up the ancestors for `overflow: hidden`, `auto` or `scroll`. Any of them becomes the scroll container that sticky sticks to.",
    },
    {
      id: "d3-responsive",
      level: "intermediate",
      task: "3.4",
      title: "Responsive, mobile-first design",
      check: ["d3-21", "d3-22"],
      visual: (
        <div className="grid gap-3">
          <ResponsiveVisual />
          <CodeBlock
            lang="html"
            caption="Let the browser pick a right-sized image, and reserve its space with width and height."
            code={`<meta name="viewport" content="width=device-width, initial-scale=1">

<img src="hero-800.jpg"
     srcset="hero-800.jpg 800w, hero-1600.jpg 1600w"
     sizes="(min-width: 1024px) 50vw, 100vw"
     width="1600" height="900" alt="Our team at work">`}
          />
        </div>
      ),
      points: [
        "Add the viewport meta tag, or phones render a desktop-width page and zoom out.",
        "Mobile-first: write base styles for small screens, then add `@media (min-width: …)` blocks in ascending order as space grows.",
        "Fluid values like `clamp(1.5rem, 5vw, 3rem)` scale smoothly between a minimum and a maximum.",
        "`srcset` and `sizes` let the browser download a right-sized image; `width` and `height` reserve space so content doesn't jump (layout shift).",
      ],
      tip: "Don't pick breakpoints from device lists. Drag your browser narrower until the layout looks wrong, and put a breakpoint there.",
    },
  ],

  questions: [
    // ── d3-flex ──
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-flex",
      level: "junior",
      prompt: "Where do the container's children end up?",
      code: `.row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}`,
      codeLang: "css",
      options: ["Centred horizontally and vertically", "Centred horizontally, stuck to the top", "Stacked in a centred column", "Spread across the full width"],
      answer: [0],
      explanation: "In a row, `justify-content` works horizontally (the main axis) and `align-items` vertically (the cross axis). Both set to center puts the group in the middle of the 200px-tall box.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-flex",
      level: "intermediate",
      prompt: "A 400px-tall flex container has `flex-direction: column`. Which property spreads its items out vertically?",
      options: ["`justify-content`", "`align-items`", "`align-content`", "`vertical-align`"],
      answer: [0],
      explanation: "With `column`, the main axis runs top to bottom, so `justify-content` (main axis) handles vertical distribution and `align-items` (cross axis) handles horizontal alignment.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-flex",
      level: "junior",
      type: "match",
      prompt: "Match each flexbox property to its job.",
      pairs: [
        ["`justify-content`", "Distribute items along the main axis"],
        ["`align-items`", "Align items on the cross axis"],
        ["`flex-wrap: wrap`", "Let items flow onto new lines"],
        ["`gap`", "Fixed space between items"],
        ["`flex-direction`", "Choose which way the main axis runs"],
      ],
      explanation: "These go on the flex container. Properties like `flex`, `align-self` and `order` go on the items.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-flex",
      level: "intermediate",
      prompt: "The container holds two empty divs, `.a` then `.b`. How wide is each?",
      code: `.row { display: flex; width: 600px; }
.a { flex: 1; }
.b { flex: 2; }`,
      codeLang: "css",
      options: [".a 200px, .b 400px", ".a 300px, .b 300px", ".a 400px, .b 200px", ".a 0px, .b 600px"],
      answer: [0],
      explanation: "`flex: 1` means grow 1, shrink 1, basis 0%. Both start at 0, so all 600px is free space, shared 1 : 2.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-flex",
      level: "senior",
      prompt: "Two empty items, no gap. How wide is each?",
      code: `.row { display: flex; width: 500px; }
.a { flex: 1 1 100px; }
.b { flex: 3 1 100px; }`,
      codeLang: "css",
      options: [".a 175px, .b 325px", ".a 125px, .b 375px", ".a 250px, .b 250px", ".a 100px, .b 400px"],
      answer: [0],
      explanation: "Start from the bases: 100 + 100 = 200, leaving 300px free. It's shared by grow factors 1 : 3, so .a gets 75 (175px) and .b gets 225 (325px). The ratio applies to the free space, not the final widths.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-flex",
      level: "senior",
      prompt: "Now the items are too big for the container. How wide is each?",
      code: `.row { display: flex; width: 300px; }
.a { flex: 0 1 200px; }
.b { flex: 0 3 200px; }`,
      codeLang: "css",
      options: [".a 175px, .b 125px", ".a 150px, .b 150px", ".a 225px, .b 75px", ".a 200px, .b 100px"],
      answer: [0],
      explanation: "They overflow by 100px. Shrinking is weighted by shrink × basis: 1 × 200 = 200 and 3 × 200 = 600, so .a gives up a quarter (25px → 175px) and .b three quarters (75px → 125px).",
    },
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-flex",
      level: "intermediate",
      type: "lines",
      prompt: "The buttons should spread across the toolbar, but they stay bunched on the left. Tap the line that's in the wrong place.",
      code: `.toolbar {
  display: flex;
  gap: 8px;
}
.toolbar button {
  justify-content: space-between;
}`,
      codeLang: "css",
      answer: [6],
      explanation: "`justify-content` is a container property. On the buttons it does nothing; move it into `.toolbar`, the flex container.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-flex",
      level: "junior",
      prompt: "Why use `gap` instead of margins to space flex items?",
      options: [
        "It adds space only between items, so there's no extra space at the edges to undo",
        "Margins don't work on flex items",
        "`gap` also adds padding inside each item",
        "`gap` makes the items equal widths",
      ],
      answer: [0],
      explanation: "With margins you end up writing `:last-child { margin-right: 0 }` and fighting wrapping. `gap` spaces items, and wrapped lines, without touching the outer edges.",
    },

    // ── d3-grid ──
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-grid",
      level: "junior",
      prompt: "The grid has 7 children. How many rows does it make?",
      code: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}`,
      codeLang: "css",
      options: ["3", "2", "7", "1"],
      answer: [0],
      explanation: "Three columns are defined; items fill them row by row (3 + 3 + 1), and the grid creates as many rows as needed automatically.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-grid",
      level: "intermediate",
      prompt: "How wide is each column?",
      code: `.grid {
  display: grid;
  width: 800px;
  grid-template-columns: 200px 1fr 2fr;
}`,
      codeLang: "css",
      options: ["200px, 200px, 400px", "200px, 300px, 300px", "266px, 266px, 266px", "200px, 1px, 2px"],
      answer: [0],
      explanation: "Fixed tracks come first: 800 − 200 = 600px left. That's split into 3 fractions (1 + 2), so 1fr = 200px and 2fr = 400px.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-grid",
      level: "junior",
      prompt: "How wide is each column?",
      code: `.grid {
  display: grid;
  width: 640px;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}`,
      codeLang: "css",
      options: ["200px", "213px", "220px", "180px"],
      answer: [0],
      explanation: "Three columns have two gaps between them: 640 − 2 × 20 = 600px, divided by 3 = 200px each.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-grid",
      level: "senior",
      prompt: "A 1000px grid holds only two cards. With `repeat(auto-fill, minmax(150px, 1fr))` they stay narrow; with `auto-fit` they stretch to 500px each. Why?",
      options: [
        "auto-fill keeps the empty column tracks; auto-fit collapses empty tracks so the 1fr columns take their space",
        "auto-fit ignores minmax()",
        "auto-fill only works with fixed pixel widths",
        "auto-fit adds a gap equal to the free space",
      ],
      answer: [0],
      explanation: "Both create 6 tracks (1000 / 150, rounded down). auto-fill keeps all 6, so each card is about 167px with four empty columns. auto-fit collapses the empty ones to zero, so the two cards share the whole row.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-grid",
      level: "senior",
      prompt: "The grid is 700px wide with no gap and 6 cards. What does it look like?",
      code: `.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}`,
      codeLang: "css",
      options: ["3 columns, each about 233px wide (2 rows)", "4 columns of 175px", "3 columns of 200px with 100px empty", "6 columns of about 117px"],
      answer: [0],
      explanation: "The browser fits as many 200px minimums as possible: 700 / 200 = 3 (rounded down). Then each column's max of `1fr` stretches the three to share 700px: about 233.33px each. Six cards make two rows.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-grid",
      level: "intermediate",
      type: "lines",
      prompt: "The named areas are ignored and the items just auto-flow. Tap the line that makes `grid-template-areas` invalid.",
      code: `.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer sidebar";
}`,
      codeLang: "css",
      answer: [7],
      explanation: "Every named area must form a single rectangle. \"sidebar\" now sits in row 2 column 1 and row 3 column 2, which isn't a rectangle, so the whole declaration is invalid and dropped.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-grid",
      level: "junior",
      prompt: "In a 4-column grid, what does this do to `.banner`?",
      code: `.banner { grid-column: 1 / -1; }`,
      codeLang: "css",
      options: ["It spans all four columns", "It sits in the first column only", "It moves to the last column", "Nothing: negative numbers are invalid"],
      answer: [0],
      explanation: "Grid lines are numbered from 1, and negative numbers count from the end. `1 / -1` runs from the first line to the last, spanning every explicit column.",
    },

    // ── d3-position ──
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-position",
      level: "intermediate",
      type: "match",
      prompt: "Match each `position` value to how it behaves.",
      pairs: [
        ["`static`", "Normal flow; top and left are ignored"],
        ["`relative`", "Offset from its normal spot, which stays reserved"],
        ["`absolute`", "Out of flow, placed against the nearest positioned ancestor"],
        ["`fixed`", "Placed against the viewport; stays put on scroll"],
        ["`sticky`", "Normal until a scroll threshold, then sticks"],
      ],
      explanation: "Positioned means anything but static. That's why `position: relative` on a parent is the classic way to anchor absolutely positioned children.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-position",
      level: "intermediate",
      prompt: "The badge ends up in the top-right corner of the page, not the card. What's the fix?",
      code: `/* <div class="card"><span class="badge">New</span></div> */
.card  { padding: 16px; }
.badge { position: absolute; top: 0; right: 0; }`,
      codeLang: "css",
      options: ["Add `position: relative` to `.card`", "Change the badge to `position: fixed`", "Add `z-index: 1` to the badge", "Add `display: block` to the badge"],
      answer: [0],
      explanation: "An absolutely positioned element is placed against its nearest positioned ancestor. With none, it uses the initial containing block (the page). `position: relative` on the card makes the card the anchor without moving it.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-position",
      level: "senior",
      type: "lines",
      prompt: "`.sidebar` sits inside `.layout`. When the page scrolls, the sidebar scrolls away instead of sticking. Tap the line that breaks it.",
      code: `.layout {
  overflow: hidden;
}
.sidebar {
  position: sticky;
  top: 0;
}`,
      codeLang: "css",
      answer: [2],
      explanation: "Sticky sticks to its nearest scroll container. `overflow: hidden` makes `.layout` one, even though it never scrolls, so the sidebar sticks relative to a box that doesn't move. Remove it, or use `overflow: clip`, which clips without creating a scroll container.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-position",
      level: "intermediate",
      type: "lines",
      prompt: "The modal still renders under the header. Tap the line that stops the modal's `z-index` from working.",
      code: `.modal {
  position: static;
  z-index: 1000;
  background: white;
}
.header {
  position: relative;
  z-index: 10;
}`,
      codeLang: "css",
      answer: [2],
      explanation: "`z-index` has no effect on a statically positioned block. Use `position: fixed` (typical for a modal) or `relative`, and the 1000 starts to count.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-position",
      level: "senior",
      prompt: "The menu drops down over `.hero` but is drawn underneath it, despite `z-index: 9999`. Why?",
      code: `.toolbar { position: relative; z-index: 1; }
.menu    { position: absolute; z-index: 9999; } /* inside .toolbar */
.hero    { position: relative; z-index: 2; }    /* after .toolbar */`,
      codeLang: "css",
      options: [
        "`.toolbar` forms a stacking context at level 1; everything inside it, 9999 included, is painted at that level, below `.hero`'s 2",
        "z-index values above 999 are ignored",
        "Absolutely positioned elements can't have a z-index",
        "`.hero` comes later in the HTML, and later elements always paint on top",
      ],
      answer: [0],
      explanation: "z-index only competes among siblings in the same stacking context. The menu's 9999 ranks it inside the toolbar; the toolbar itself (1) loses to the hero (2). Raise the toolbar above the hero, or render the menu outside it.",
    },
    {
      id: "d3-26",
      domain: "d3",
      lesson: "d3-position",
      level: "staff",
      prompt: "Across your app, teams keep escalating z-index values (999, 9999, 99999) to get dropdowns, toasts and modals on top, and new overlays regularly break old ones. What's the scalable fix?",
      options: [
        "Define a small shared z-index scale as tokens (for example dropdown, sticky, modal, toast), render overlays near the root or in the top layer (`<dialog>`), and contain components with `isolation: isolate`",
        "Allow each team its own range of z-index numbers",
        "Set every overlay to the maximum 32-bit z-index",
        "Remove all positioning so z-index is never needed",
      ],
      answer: [0],
      explanation: "The problem is architectural: unbounded numbers and overlays trapped inside other stacking contexts. A named scale makes intent explicit, rendering overlays at the root (or with `<dialog>`'s top layer) avoids being trapped, and `isolation: isolate` stops a component's internal z-indexes from leaking out.",
    },

    // ── d3-responsive ──
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-responsive",
      level: "junior",
      prompt: "Without `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`, what do mobile browsers typically do?",
      options: [
        "Lay the page out at a desktop-like width (often 980px) and zoom out, so small-screen media queries don't apply",
        "Refuse to load the CSS",
        "Show the page at its real width with no difference",
        "Switch the page to dark mode",
      ],
      answer: [0],
      explanation: "Phones assume a page wasn't built for them and fake a wide viewport. The meta tag says \"use the device's width\", which is what makes your responsive CSS kick in.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-responsive",
      level: "junior",
      prompt: "How many columns does `.grid` have on a viewport 800px wide?",
      code: `.grid { display: grid; grid-template-columns: 1fr; }
@media (min-width: 640px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}`,
      codeLang: "css",
      options: ["2", "1", "3", "It depends on the device"],
      answer: [0],
      explanation: "At 800px the first query matches (800 ≥ 640) and the second doesn't (800 < 1024), so the 2-column rule overrides the 1-column base.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-responsive",
      level: "intermediate",
      prompt: "On a 1440px screen this grid shows 2 columns, not 3. Why?",
      code: `.grid { grid-template-columns: 1fr; }
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 640px) {
  .grid { grid-template-columns: 1fr 1fr; }
}`,
      codeLang: "css",
      options: [
        "Both queries match at 1440px; the selectors tie, so the later 640px block wins",
        "Media queries are evaluated from the smallest to the largest automatically",
        "`repeat()` isn't allowed inside a media query",
        "Only the first matching media query is ever applied",
      ],
      answer: [0],
      explanation: "Media queries don't add specificity; they just switch rules on or off. Every matching block applies, and normal cascade order decides. With `min-width` queries, write them in ascending order.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-responsive",
      level: "intermediate",
      prompt: "The root font size is 16px. What is the heading's font size on a 400px-wide viewport, and on a 1200px one?",
      code: `h1 { font-size: clamp(1.5rem, 5vw, 3rem); }`,
      codeLang: "css",
      options: ["24px and 48px", "20px and 60px", "24px and 60px", "20px and 48px"],
      answer: [0],
      explanation: "5vw is 20px at 400px, below the 1.5rem (24px) minimum, so it's 24px. At 1200px, 5vw is 60px, above the 3rem (48px) maximum, so it's 48px.",
    },
    {
      id: "d3-25",
      domain: "d3",
      lesson: "d3-responsive",
      level: "staff",
      prompt: "Your marketing site has poor layout-shift scores: content jumps as images, embeds and ads load. Which two platform-level changes fix it? (Choose two.)",
      options: [
        "Make the shared image component always output `width` and `height` (or an `aspect-ratio`), so space is reserved before the file arrives",
        "Reserve fixed space for late-loading embeds and ad slots with `min-height` or `aspect-ratio` boxes",
        "Add `loading=\"lazy\"` to the hero image",
        "Give every image `position: absolute`",
      ],
      answer: [0, 1],
      explanation: "Layout shift happens when space isn't reserved. Intrinsic dimensions let the browser compute an aspect ratio up front, and placeholder boxes do the same for embeds. Lazy-loading the hero delays your main image (hurting load speed) without reserving space; absolute positioning breaks the layout.",
    },
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-responsive",
      level: "staff",
      prompt: "Your design system has breakpoints at 375, 414, 768, 820 and 1180px, copied from specific devices, and teams keep adding more. What's the better standard?",
      options: [
        "A few content-driven, mobile-first breakpoints defined once as shared values, with container queries for component-level changes",
        "Add a breakpoint for every new popular device",
        "Use only max-width queries so desktop is the default",
        "Detect the device on the server and send a different stylesheet to each",
      ],
      answer: [0],
      explanation: "Devices change every year; content doesn't. Break where the layout actually breaks, keep the set small and shared, and let components adapt to their own space with container queries rather than the viewport.",
    },
  ],

  cards: [
    { id: "c-d3-flex", domain: "d3", kind: "service", term: "display: flex", definition: "Lays children out along one axis. Container controls direction, wrap, justify-content, align-items and gap." },
    { id: "c-d3-justify", domain: "d3", kind: "service", term: "justify-content", definition: "Distributes items along the main axis: flex-start, center, space-between, space-around, space-evenly." },
    { id: "c-d3-align", domain: "d3", kind: "service", term: "align-items", definition: "Aligns items on the cross axis: stretch (default), flex-start, center, flex-end, baseline." },
    { id: "c-d3-flexshort", domain: "d3", kind: "service", term: "flex", definition: "Item shorthand for grow, shrink, basis. `flex: 1` = `1 1 0%`; the initial value is `0 1 auto`." },
    { id: "c-d3-gap", domain: "d3", kind: "service", term: "gap", definition: "Space between flex items or grid tracks, never at the outer edges." },
    { id: "c-d3-grid", domain: "d3", kind: "service", term: "grid-template-columns", definition: "Defines a grid's columns: `200px 1fr`, `repeat(3, 1fr)`, `repeat(auto-fit, minmax(200px, 1fr))`." },
    { id: "c-d3-fr", domain: "d3", kind: "service", term: "fr", definition: "A fraction of the free space left in a grid after fixed tracks and gaps." },
    { id: "c-d3-minmax", domain: "d3", kind: "service", term: "minmax()", definition: "A grid track size with a floor and a ceiling, e.g. `minmax(200px, 1fr)`." },
    { id: "c-d3-areas", domain: "d3", kind: "service", term: "grid-template-areas", definition: "Draws the layout as strings of names. Each name must form a rectangle." },
    { id: "c-d3-sticky", domain: "d3", kind: "service", term: "position: sticky", definition: "Scrolls normally, then sticks at its offset (e.g. `top: 0`) within its nearest scroll container." },
    { id: "c-d3-stacking", domain: "d3", kind: "concept", term: "Stacking context", definition: "A group painted as one layer. z-index only competes inside it. Created by positioned + z-index, opacity < 1, transform, isolation." },
    { id: "c-d3-mobilefirst", domain: "d3", kind: "concept", term: "Mobile-first", definition: "Base CSS for small screens, then `@media (min-width: …)` blocks that add complexity as space grows." },
    { id: "c-d3-clamp", domain: "d3", kind: "service", term: "clamp()", definition: "`clamp(min, preferred, max)`: a fluid value that never goes below min or above max." },
    { id: "c-d3-srcset", domain: "d3", kind: "service", term: "srcset / sizes", definition: "Offer several image files with their widths and how wide the image displays; the browser picks the best one." },
    { id: "c-d3-cls", domain: "d3", kind: "concept", term: "Layout shift", definition: "Content jumping as late resources load. Prevent it by reserving space: width/height attributes, aspect-ratio, min-height." },
  ],

  challenges: [
    {
      id: "ch-layout-center",
      domain: "d3",
      lesson: "d3-flex",
      title: "Dead centre",
      goal: "With display: flex, put the group of boxes in the exact middle of the container, horizontally and vertically.",
      hint: "One property per axis.",
      takeaway: "`justify-content: center` handles the main axis and `align-items: center` the cross axis. Together they centre anything.",
      render: (onSolved) => <FlexGridLab goal="center" onSolved={onSolved} />,
    },
    {
      id: "ch-layout-between",
      domain: "d3",
      lesson: "d3-flex",
      title: "Edges and baseline",
      goal: "In a flex row, push the first and last boxes to the edges with equal space between all boxes, and line every box up along the bottom.",
      hint: "Look for a justify-content value with \"between\" in it, and an align-items value for the end of the cross axis.",
      takeaway: "`space-between` puts the free space only between items; `align-items: flex-end` aligns them to the bottom of a row.",
      render: (onSolved) => <FlexGridLab goal="between" onSolved={onSolved} />,
    },
    {
      id: "ch-layout-grid3",
      domain: "d3",
      lesson: "d3-grid",
      title: "A neat 3 × 2 grid",
      goal: "Switch to grid and lay out exactly 6 boxes in three equal columns with a gap of at least 12px (no spanning).",
      hint: "You need display: grid, a three-equal-columns template, 6 boxes and a bigger gap.",
      takeaway: "`grid-template-columns: repeat(3, 1fr)` plus `gap` gives equal columns; the rows appear on their own.",
      render: (onSolved) => <FlexGridLab goal="grid3" onSolved={onSolved} />,
    },
  ],
});
