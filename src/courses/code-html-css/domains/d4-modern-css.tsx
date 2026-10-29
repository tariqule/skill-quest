import { CodeBlock, CodeCompare, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { SpecificityDuelLab } from "../labs";
import { ContainerVisual, HasVisual, ThemeVisual } from "../visuals";

/** World 4: custom properties, modern selectors and nesting, container queries, cascade layers, and design-system CSS at scale. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Modern CSS and Design Systems",
    world: "The Modern CSS Observatory",
    weight: 20,
    emoji: "🔭",
    color: "#14b8a6",
    summary: "Custom properties and theming, :has() and friends, nesting, container queries, cascade layers, and how teams keep CSS healthy at scale.",
  },

  tasks: [
    { id: "4.1", title: "Theme with custom properties", covers: ["declaring and using custom properties", "inheritance and scoping", "fallbacks and invalid values", "@property"] },
    { id: "4.2", title: "Use modern selectors and nesting", covers: [":has()", ":is() and :where() specificity", "native CSS nesting and &"] },
    { id: "4.3", title: "Build with container queries and cascade layers", covers: ["container-type and @container", "container units", "@layer order", "unlayered and !important styles"] },
    { id: "4.4", title: "Run CSS at team scale", covers: ["design tokens", "naming and scoping conventions", "linting and visual regression tests", "token migrations", "accessible defaults"] },
  ],

  lessons: [
    {
      id: "d4-vars",
      level: "intermediate",
      task: "4.1",
      title: "Custom properties and theming",
      check: ["d4-01", "d4-03"],
      visual: <ThemeVisual />,
      points: [
        "Declare a custom property with two dashes (`--brand: #7c3aed;`) and read it with `var(--brand)`. Names are case-sensitive.",
        "Custom properties inherit, so a value set on `:root` is available everywhere and a value set on `.card` overrides it inside that card.",
        "`var(--x, fallback)` uses the fallback when `--x` isn't defined. If the substituted value is invalid for the property, the property falls back to inherited or initial, not to an earlier declaration.",
        "Themes are just different values: swap them under `[data-theme=\"dark\"]` or `@media (prefers-color-scheme: dark)` and every component follows.",
        "`@property` registers a type (`<color>`, `<length>`, `<angle>`), so the browser can animate the property and check its values.",
      ],
      tip: "Custom properties are live at runtime, unlike preprocessor variables. JavaScript can set one with `el.style.setProperty(\"--x\", \"10px\")` and everything that uses it updates.",
    },
    {
      id: "d4-selectors",
      level: "senior",
      task: "4.2",
      title: ":has(), :is(), :where(), and nesting",
      check: ["d4-08", "d4-11"],
      visual: (
        <div className="grid gap-3">
          <HasVisual />
          <CodeCompare
            lang="css"
            tone="neutral"
            left={{
              title: "Native nesting",
              code: `.card {
  padding: 16px;
  &:hover { outline: 2px solid; }
  &.featured { border-color: gold; }
  .title { font-weight: 700; }
  @media (min-width: 640px) {
    padding: 24px;
  }
}`,
            }}
            right={{
              title: "What it means",
              code: `.card { padding: 16px; }
.card:hover { outline: 2px solid; }
.card.featured { border-color: gold; }
.card .title { font-weight: 700; }
@media (min-width: 640px) {
  .card { padding: 24px; }
}`,
            }}
          />
        </div>
      ),
      points: [
        "`:has()` selects an element by what it contains or what follows it: `.card:has(img)`, `form:has(:invalid)`, `h2:has(+ p)`.",
        "`:is(a, b)` groups selectors and takes the specificity of its most specific argument; `:where(a, b)` does the same matching with zero specificity.",
        "Native nesting: `&` is the parent selector. `&.x` is the same element with class x; `& .x` or plain `.x` is a descendant.",
        "Use `:where()` for library and reset styles so anyone can override them with a single class.",
      ],
      tip: "Keep nesting shallow (one or two levels). Deep nesting quietly builds long, high-specificity selectors that are hard to override, the same trap Sass users learned to avoid.",
    },
    {
      id: "d4-containers",
      level: "senior",
      task: "4.3",
      title: "Container queries and cascade layers",
      check: ["d4-14", "d4-16"],
      visual: (
        <div className="grid gap-3">
          <ContainerVisual />
          <CodeBlock
            lang="css"
            caption="Layer order is set once, up front. Later layers win, whatever their specificity; unlayered styles beat them all."
            code={`@layer reset, base, components, utilities;

@layer base       { a { color: var(--link); } }
@layer components { .nav a { color: inherit; } }
@layer utilities  { .text-red { color: red; } } /* wins */

@import url("vendor.css") layer(vendor);`}
          />
        </div>
      ),
      points: [
        "Media queries ask about the viewport; container queries ask about the component's own space, so one card can adapt to a sidebar and a main column.",
        "Mark the wrapper with `container-type: inline-size`, then write `@container (min-width: 420px) { … }`. An element can't query its own size, only an ancestor's.",
        "Container units such as `cqi` (1% of the container's inline size) size things relative to the container.",
        "`@layer` groups styles into named layers. The cascade compares layer order before specificity, so `utilities` can beat `components` with a single class.",
        "Normal unlayered styles beat all layers, and for `!important` declarations the order flips: earlier layers win.",
      ],
      tip: "Adopting layers in an old codebase? Put the legacy stylesheet into its own early layer first. Otherwise, as unlayered CSS, it beats everything you put in layers.",
    },
    {
      id: "d4-systems",
      level: "staff",
      task: "4.4",
      title: "Design-system CSS at scale",
      check: ["d4-20", "d4-21"],
      visual: (
        <div className="grid gap-3">
          <Layers
            layers={[
              { name: "Primitive tokens: raw values", color: "#f97316", items: ["--blue-600: #2563eb", "--space-4: 1rem", "--radius-2: 8px"] },
              { name: "Semantic tokens: meaning, theme-able", color: "#38bdf8", items: ["--color-action: var(--blue-600)", "--color-text", "--space-inset"] },
              { name: "Component tokens: styling hooks", color: "#a78bfa", items: ["--button-bg: var(--color-action)", "--card-padding"] },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "🧱", title: "Scope by convention or tooling", text: "BEM names (`.card__title--large`), CSS Modules, or utilities keep selectors flat and stop styles leaking between teams.", color: "#14b8a6" },
              { icon: "🥞", title: "Layer the cascade", text: "`reset, base, components, utilities`: priorities are explicit, not a specificity contest.", color: "#38bdf8" },
              { icon: "🤖", title: "Automate the rules", text: "Stylelint (no IDs, no `!important`, tokens only) and visual regression tests in CI catch problems before review.", color: "#f472b6" },
              { icon: "♿", title: "Accessible by default", text: "Focus rings via `:focus-visible`, contrast-checked colour tokens, `prefers-reduced-motion`, rem-based type.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Design tokens are named design decisions (colour, space, type, radius) stored as custom properties: primitives, then semantic names, then component hooks.",
        "Components should read semantic tokens, never raw hex values, so a theme or rebrand is a change of values, not of code.",
        "Expose custom properties (`--button-bg`) as a component's styling API instead of letting consumers override internal selectors.",
        "Migrate in steps: add new tokens, alias old names to them, move components over with a codemod or lint warnings, then delete the aliases.",
      ],
      tip: "Write down your CSS conventions (naming, layers, tokens, allowed units) in one short doc and enforce what you can with lint rules. Conventions that live only in reviewers' heads don't scale past one team.",
    },
  ],

  questions: [
    // ── d4-vars ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-vars",
      level: "junior",
      prompt: "What colour is the button's background?",
      code: `:root { --brand: #7c3aed; }
.button { background: var(--brand); }`,
      codeLang: "css",
      options: ["#7c3aed (purple)", "Transparent: --brand is only defined on :root", "The text \"var(--brand)\"", "Black"],
      answer: [0],
      explanation: "`:root` is the `<html>` element, and custom properties inherit, so every element can read `--brand`. `var(--brand)` is replaced with `#7c3aed`.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-vars",
      level: "junior",
      prompt: "`--accent` is never defined anywhere. What colour is the text?",
      code: `.note { color: var(--accent, tomato); }`,
      codeLang: "css",
      options: ["Tomato", "Black", "Transparent", "The rule is ignored, so the browser default"],
      answer: [0],
      explanation: "The second argument of `var()` is a fallback, used when the custom property isn't defined. It can even be another `var()`.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-vars",
      level: "intermediate",
      prompt: "What vertical margin does the paragraph get?",
      code: `/* <div class="card"><p>Hi</p></div> */
:root { --gap: 8px; }
.card { --gap: 16px; }
.card p { margin-block: var(--gap); }`,
      codeLang: "css",
      options: ["16px", "8px", "24px", "0"],
      answer: [0],
      explanation: "Custom properties inherit like `color`. The paragraph inherits `--gap` from its nearest ancestor that sets it, `.card`, so it gets 16px. Outside cards it would be 8px.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-vars",
      level: "intermediate",
      type: "lines",
      prompt: "The button's background is transparent, but its corners are rounded. Tap the buggy line.",
      code: `:root {
  --color-primary: #0ea5e9;
  --radius: 8px;
}
.btn {
  background: var(--colour-primary);
  border-radius: var(--radius);
}`,
      codeLang: "css",
      answer: [6],
      explanation: "`--colour-primary` (British spelling) isn't defined, and there's no fallback, so the declaration becomes invalid at computed-value time and the background falls back to its initial value, transparent. Custom property names must match exactly.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-vars",
      level: "senior",
      prompt: "What colour is the text of `.child`, which sits inside `.parent`?",
      code: `.parent { color: green; }
.child {
  --size: 20px;
  color: blue;
  color: var(--size);
}`,
      codeLang: "css",
      options: ["Green (inherited from the parent)", "Blue (the earlier declaration)", "Black (the browser default)", "20px is converted to a colour"],
      answer: [0],
      explanation: "The browser can't know `var(--size)` is invalid until it substitutes it, after the cascade has already picked that declaration over `blue`. The result is \"invalid at computed-value time\", which behaves like `unset`: `color` is inherited, so it becomes the parent's green.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-vars",
      level: "senior",
      prompt: "What does registering a custom property with `@property` let you do that a plain one can't?",
      code: `@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}`,
      codeLang: "css",
      options: [
        "The browser knows it's an angle, so it can transition and animate it smoothly (e.g. a rotating gradient)",
        "It makes the property global to every page on the site",
        "It's required before `var(--angle)` can be used at all",
        "It makes the property readable from JavaScript",
      ],
      answer: [0],
      explanation: "Unregistered custom properties are untyped strings, so they can only flip between values. A registered type can be interpolated, gets an initial value, and can opt out of inheritance.",
    },
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-vars",
      level: "intermediate",
      prompt: "What happens when JavaScript sets `data-theme=\"dark\"` on the `<html>` element?",
      code: `:root { --bg: white; --text: #111; }
[data-theme="dark"] { --bg: #111; --text: #eee; }
body { background: var(--bg); color: var(--text); }`,
      codeLang: "css",
      options: [
        "The page switches to dark colours immediately; body reads the new values with no other CSS changes",
        "Nothing until the page reloads",
        "Only elements that also have `data-theme` change",
        "The two `--bg` values are averaged",
      ],
      answer: [0],
      explanation: "`[data-theme=\"dark\"]` now matches `<html>`. It has the same specificity as `:root`, (0,1,0), but comes later, so its values win. `body` reads the new `--bg` and `--text` and the browser restyles instantly.",
    },

    // ── d4-selectors ──
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d4-selectors",
      level: "intermediate",
      prompt: "Which cards become a two-column grid?",
      code: `.card:has(img) {
  display: grid;
  grid-template-columns: 120px 1fr;
}`,
      codeLang: "css",
      options: ["Cards that contain an `<img>` anywhere inside them", "Images that are inside a card", "Cards immediately followed by an image", "Every card, as long as the page has an image"],
      answer: [0],
      explanation: "`:has()` is the long-awaited parent selector: the subject is still `.card`, filtered to those that have a matching descendant. Text-only cards keep their normal layout.",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-selectors",
      level: "senior",
      prompt: "What colour is the heading?",
      code: `/* <div class="banner"><h2>Sale</h2></div> */
:is(#hero, .banner) h2 { color: red; }
.banner h2 { color: blue; }`,
      codeLang: "css",
      options: ["Red", "Blue", "Purple", "Black"],
      answer: [0],
      explanation: ":is() takes the specificity of its most specific argument, `#hero`, even though the element matched via `.banner`. That gives (1,0,1), which beats (0,1,1) despite coming first.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-selectors",
      level: "senior",
      prompt: "What colour is the heading?",
      code: `/* <div class="card"><h2>Title</h2></div> */
:where(.card) h2 { color: red; }
h2 { color: blue; }`,
      codeLang: "css",
      options: ["Blue", "Red", "Purple", "Black"],
      answer: [0],
      explanation: "`:where()` contributes zero specificity, so both selectors are (0,0,1) and the later one wins. That's exactly why libraries wrap their defaults in `:where()`: they're trivially easy to override.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-selectors",
      level: "intermediate",
      prompt: "Which flat selectors does this nested CSS produce?",
      code: `.card {
  color: black;
  &:hover { color: red; }
  .title { font-weight: bold; }
}`,
      codeLang: "css",
      options: ["`.card:hover` and `.card .title`", "`.card :hover` and `.card.title`", "`.card:hover` and `.card.title`", "`:hover` and `.title`"],
      answer: [0],
      explanation: "`&` stands for the parent selector, so `&:hover` is `.card:hover`. A nested selector without `&` is treated as a descendant: `.title` becomes `.card .title`.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-selectors",
      level: "senior",
      type: "lines",
      prompt: "The primary button stays navy. Tap the buggy line.",
      code: `.btn {
  background: navy;
  & .primary {
    background: crimson;
  }
}
/* <button class="btn primary">Buy</button> */`,
      codeLang: "css",
      answer: [3],
      explanation: "The space makes it `.btn .primary`, a descendant. The button has both classes on one element, which needs `&.primary` (no space) → `.btn.primary`.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-selectors",
      level: "senior",
      prompt: "Which statements about `:has()` are true? (Choose two.)",
      options: [
        "`h2:has(+ p)` selects an h2 that is immediately followed by a paragraph",
        "`form:has(:invalid)` matches a form that contains an invalid field",
        "Its specificity is always zero, like `:where()`",
        "It can only look at direct children",
      ],
      answer: [0, 1],
      explanation: "`:has()` takes relative selectors, so it can look at descendants, children (`:has(> img)`) or following siblings (`:has(+ p)`). Like `:is()`, it takes the specificity of its most specific argument.",
    },

    // ── d4-containers ──
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-containers",
      level: "intermediate",
      prompt: "On a 1440px screen, one `.card` sits in a 320px `.sidebar` and another in a 900px `.main`. Which card(s) switch to flex?",
      code: `.sidebar, .main { container-type: inline-size; }
@container (min-width: 500px) {
  .card { display: flex; }
}`,
      codeLang: "css",
      options: ["Only the card in `.main`", "Both: the screen is wider than 500px", "Only the card in `.sidebar`", "Neither: cards aren't containers"],
      answer: [0],
      explanation: "Each card queries its nearest container ancestor. The sidebar is 320px (no match); main is 900px (match). The viewport width doesn't matter.",
    },
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-containers",
      level: "senior",
      type: "lines",
      prompt: "The card never switches to flex, even when it's 800px wide. Tap the line that needs to move to a wrapper element.",
      code: `.card {
  container-type: inline-size;
  padding: 16px;
}
@container (min-width: 500px) {
  .card { display: flex; gap: 16px; }
}`,
      codeLang: "css",
      answer: [2],
      explanation: "A container query is answered by the nearest ancestor container, never the element itself (otherwise styles could change the size they depend on). Put `container-type` on the card's parent.",
    },
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-containers",
      level: "senior",
      prompt: "What colour is a link inside `#nav`?",
      code: `@layer base, theme;
@layer theme { a { color: red; } }
@layer base  { #nav a { color: blue; } }`,
      codeLang: "css",
      options: ["Red", "Blue", "Purple", "The default link colour"],
      answer: [0],
      explanation: "The first line fixes the order: base, then theme. Layer order is compared before specificity, so the later layer, theme, wins even with a weaker selector and even though its block appears first.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-containers",
      level: "staff",
      prompt: "You moved the design system into `@layer components`, and now old global CSS like the rule below overrides every component. What's the right fix?",
      code: `@layer components {
  .btn { background: blue; }
}
/* legacy.css, not in any layer */
.btn { background: gray; }`,
      codeLang: "css",
      options: [
        "Put the legacy CSS in its own layer ordered before components, e.g. `@layer legacy, components;` and `@import url(\"legacy.css\") layer(legacy);`",
        "Raise every component selector's specificity with IDs",
        "Move the `@layer components` block to the end of the stylesheet",
        "Delete all the legacy CSS in one release",
      ],
      answer: [0],
      explanation: "Normal unlayered styles beat every layer, so moving blocks around or adding IDs doesn't help. Wrapping the legacy file in an earlier layer turns the fight into a declared order, and you can then delete it gradually.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-containers",
      level: "staff",
      type: "order",
      prompt: "Order the layers in a design system's `@layer` statement so each later group can override the earlier ones without specificity tricks.",
      items: ["`reset`", "`base` (element defaults)", "`components`", "`utilities`"],
      explanation: "`@layer reset, base, components, utilities;` Later layers win, so resets lose to element defaults, those lose to components, and one-purpose utility classes beat everything. Specificity only matters within a layer.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-containers",
      level: "staff",
      prompt: "What colour is the paragraph?",
      code: `@layer base, theme;
@layer base  { p { color: red !important; } }
@layer theme { p { color: blue !important; } }`,
      codeLang: "css",
      options: ["Red", "Blue", "Purple", "Black"],
      answer: [0],
      explanation: "For `!important` declarations, layer order is reversed: earlier layers win. This lets a low-level layer (a reset or accessibility baseline) protect a few critical declarations from later layers.",
    },

    // ── d4-systems ──
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-systems",
      level: "staff",
      type: "match",
      prompt: "Match each design token to its tier.",
      pairs: [
        ["`--blue-600: #2563eb`", "Primitive: a raw palette value"],
        ["`--color-action: var(--blue-600)`", "Semantic: a meaning that themes can remap"],
        ["`--button-bg: var(--color-action)`", "Component: one component's styling hook"],
      ],
      explanation: "Primitives name values, semantic tokens name intent, component tokens expose hooks. A dark theme or rebrand remaps the semantic tier, and components never reference primitives directly.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-systems",
      level: "staff",
      prompt: "Why should a design system's button expose custom properties like `--button-bg` as its styling API?",
      code: `.ds-button {
  background: var(--button-bg, var(--color-action));
  border-radius: var(--button-radius, var(--radius-2));
}`,
      codeLang: "css",
      options: [
        "Consumers can theme it safely without depending on internal selectors or specificity, and the team can change the markup freely",
        "Custom properties make the button render faster",
        "It stops consumers from changing the button at all",
        "Browsers require it for buttons",
      ],
      answer: [0],
      explanation: "Overriding internals (`.ds-button > span`) couples every consumer to your markup and specificity. A documented set of custom properties is a stable contract, like props on a component.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-systems",
      level: "staff",
      prompt: "Six product teams ship CSS into one app, and style collisions and visual regressions are frequent. Which two practices address this at the platform level? (Choose two.)",
      options: [
        "Scope component styles (CSS Modules or a naming convention such as BEM) so selectors can't leak between teams",
        "Run stylelint (no IDs, no `!important`, tokens only) and visual regression tests in CI",
        "Ask teams to add `!important` to anything that breaks",
        "Ban stylesheets and use only inline `style` attributes",
      ],
      answer: [0, 1],
      explanation: "Scoping prevents collisions by construction; automated checks catch the rest before merge. `!important` and inline styles make overrides harder and kill reuse, media queries and pseudo-classes.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-systems",
      level: "staff",
      prompt: "You need to rename the token `--primary` to `--color-action` across 200 components without a big-bang release. What's the best approach?",
      options: [
        "Add `--color-action`, alias the old name to it (`--primary: var(--color-action)`), migrate components gradually with a codemod or lint warning, then remove the alias when usage reaches zero",
        "Rename everything in one pull request and ship it on a Friday",
        "Keep both tokens forever with separate values",
        "Ask each team to find and replace in their own time, with no tracking",
      ],
      answer: [0],
      explanation: "Aliasing keeps old and new names rendering identically, so nothing breaks mid-migration. Automation and a usage count make progress visible, and removing the alias at the end prevents permanent drift.",
    },
    {
      id: "d4-24",
      domain: "d4",
      lesson: "d4-systems",
      level: "staff",
      prompt: "Designers want focus outlines removed because they appear when buttons are clicked with a mouse. As the design-system owner, what do you ship?",
      options: [
        "A high-contrast focus ring on `:focus-visible` in the base layer, so keyboard users always see focus and mouse clicks generally don't show it",
        "`*:focus { outline: none; }` for a cleaner look",
        "Focus styles only on `:hover`",
        "Let each product team decide whether to show focus",
      ],
      answer: [0],
      explanation: "`:focus-visible` matches when the browser judges the user needs to see focus (keyboard navigation, usually not mouse clicks on buttons). Removing outlines entirely makes the product unusable for keyboard users and fails WCAG.",
    },
    {
      id: "d4-25",
      domain: "d4",
      lesson: "d4-systems",
      level: "junior",
      type: "match",
      prompt: "Match each modern CSS feature to the problem it solves.",
      pairs: [
        ["Custom properties", "Reusable values and themes"],
        ["Container queries", "Components that adapt to their own space"],
        ["`:has()`", "Styling a parent by what it contains"],
        ["`@layer`", "Controlling priority between groups of styles"],
        ["Nesting", "Writing related rules inside their parent rule"],
      ],
      explanation: "All five are supported in current Chrome, Edge, Firefox and Safari, and together they replace many things that once needed preprocessors or JavaScript.",
    },
    {
      id: "d4-26",
      domain: "d4",
      lesson: "d4-systems",
      level: "junior",
      prompt: "What does `@media (prefers-reduced-motion: reduce)` detect?",
      code: `@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms; transition-duration: 0.01ms; }
}`,
      codeLang: "css",
      options: ["That the user asked their operating system to minimise motion", "That the device has a slow processor", "That the battery is low", "That the page is in a background tab"],
      answer: [0],
      explanation: "It reflects an accessibility setting: for people with vestibular disorders, large animations can cause dizziness or nausea. Respect it by toning down or removing motion.",
    },
  ],

  cards: [
    { id: "c-d4-custom", domain: "d4", kind: "concept", term: "Custom property", definition: "A `--name: value` declaration that inherits and is read with `var()`. Live at runtime; the basis of theming." },
    { id: "c-d4-var", domain: "d4", kind: "service", term: "var()", definition: "Substitutes a custom property's value: `var(--x)` or `var(--x, fallback)`." },
    { id: "c-d4-property", domain: "d4", kind: "service", term: "@property", definition: "Registers a custom property with a type, initial value and inheritance, so it can be animated." },
    { id: "c-d4-has", domain: "d4", kind: "service", term: ":has()", definition: "Matches an element that has something matching its argument: `.card:has(img)`, `h2:has(+ p)`." },
    { id: "c-d4-is", domain: "d4", kind: "service", term: ":is()", definition: "Matches any selector in its list; specificity of its most specific argument." },
    { id: "c-d4-where", domain: "d4", kind: "service", term: ":where()", definition: "Like :is() but always zero specificity. Ideal for easily overridden defaults." },
    { id: "c-d4-nesting", domain: "d4", kind: "service", term: "& (nesting selector)", definition: "Refers to the parent rule's selector: `&:hover`, `&.active`; `& .x` is a descendant." },
    { id: "c-d4-container", domain: "d4", kind: "service", term: "@container", definition: "Applies rules based on the size of the nearest ancestor with `container-type`." },
    { id: "c-d4-containertype", domain: "d4", kind: "service", term: "container-type", definition: "`inline-size` makes an element a query container for its width (and enables `cqi` units inside it)." },
    { id: "c-d4-layer", domain: "d4", kind: "service", term: "@layer", definition: "Named cascade layers. Later layers win over earlier ones before specificity; unlayered styles beat all layers." },
    { id: "c-d4-tokens", domain: "d4", kind: "concept", term: "Design tokens", definition: "Named design decisions (colour, space, type, radius) in tiers: primitive → semantic → component." },
    { id: "c-d4-bem", domain: "d4", kind: "concept", term: "BEM", definition: "Block__Element--Modifier naming (`.card__title--large`): flat, single-class selectors with clear ownership." },
    { id: "c-d4-focusvisible", domain: "d4", kind: "service", term: ":focus-visible", definition: "Matches focused elements when a focus indicator should be shown, typically keyboard focus." },
    { id: "c-d4-reducedmotion", domain: "d4", kind: "service", term: "prefers-reduced-motion", definition: "Media feature for the user's OS setting to minimise animation." },
  ],

  challenges: [
    {
      id: "ch-modern-duel",
      domain: "d4",
      lesson: "d4-selectors",
      title: "Modern cascade duel",
      goal: "Pick the winning rule in at least 5 of 7 duels involving :is(), :where(), :not(), :has() and @layer.",
      hint: ":where() is always zero; :is(), :not() and :has() take their strongest argument; layer order comes before specificity, and unlayered beats layered.",
      takeaway: "Modern selectors and layers follow the same mechanical cascade. Once you know how each one counts, the winner is predictable.",
      render: (onSolved) => <SpecificityDuelLab goal="modern" onSolved={onSolved} />,
    },
  ],
});
