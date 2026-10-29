"use client";

import { useRef, useState, type CSSProperties } from "react";
import { CodeBlock, LabHeader, type GoalProps } from "@/components/learn/blocks";

// ───────────── Shared bits ─────────────

const BOX_COLORS = ["#f97316", "#38bdf8", "#a78bfa", "#34d399", "#f472b6", "#facc15", "#fb7185", "#22d3ee"];

function Pills<T extends string>({ label, options, value, onPick }: { label: string; options: readonly T[]; value: T; onPick: (v: T) => void }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[11px] text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onPick(o)}
            className={`rounded-md px-2 py-1 font-mono text-xs font-semibold transition ${value === o ? "bg-sky-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = "px", onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between font-mono text-xs text-slate-300">
        <span>{label}</span>
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-sky-200">
          {value}
          {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-sky-400" aria-label={label} />
    </label>
  );
}

function Solved({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <div className="mt-3 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200">✅ {text}</div>;
}

// ───────────── Flexbox & grid playground ─────────────

const DIRECTIONS = ["row", "row-reverse", "column"] as const;
const JUSTIFY = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] as const;
const ALIGN = ["stretch", "flex-start", "center", "flex-end"] as const;
const WRAP = ["nowrap", "wrap"] as const;
const TEMPLATES = ["repeat(3, 1fr)", "1fr 2fr", "120px 1fr", "repeat(4, 1fr)", "repeat(auto-fit, minmax(90px, 1fr))"] as const;
const GRID_ALIGN = ["stretch", "start", "center", "end"] as const;

interface FlexGridState {
  mode: "flex" | "grid";
  count: number;
  direction: (typeof DIRECTIONS)[number];
  justify: (typeof JUSTIFY)[number];
  align: (typeof ALIGN)[number];
  wrap: (typeof WRAP)[number];
  gap: number;
  template: (typeof TEMPLATES)[number];
  justifyItems: (typeof GRID_ALIGN)[number];
  alignItems: (typeof GRID_ALIGN)[number];
  span: boolean;
}

type FlexGoal = "center" | "between" | "grid3";

function flexGoalMet(goal: FlexGoal | undefined, s: FlexGridState) {
  if (goal === "center") return s.mode === "flex" && s.justify === "center" && s.align === "center";
  if (goal === "between") return s.mode === "flex" && s.direction === "row" && s.justify === "space-between" && s.align === "flex-end";
  if (goal === "grid3") return s.mode === "grid" && s.template === "repeat(3, 1fr)" && s.count === 6 && s.gap >= 12 && !s.span;
  return false;
}

/**
 * A real flexbox / grid container full of coloured boxes. Every control writes
 * the actual CSS, so what you see is what the browser does. Goals: "center",
 * "between" (spread along a row, aligned to the bottom), "grid3" (a 3 × 2 grid).
 */
export function FlexGridLab({ goal, onSolved }: GoalProps<FlexGoal>) {
  const [s, setS] = useState<FlexGridState>({
    mode: goal === "grid3" ? "grid" : "flex",
    count: 4,
    direction: "row",
    justify: "flex-start",
    align: "stretch",
    wrap: "nowrap",
    gap: 8,
    template: "1fr 2fr",
    justifyItems: "stretch",
    alignItems: "stretch",
    span: false,
  });
  const [done, setDone] = useState(false);

  function update(patch: Partial<FlexGridState>) {
    const next = { ...s, ...patch };
    setS(next);
    if (!done && flexGoalMet(goal, next)) {
      setDone(true);
      onSolved?.();
    }
  }

  const container: CSSProperties =
    s.mode === "flex"
      ? { display: "flex", flexDirection: s.direction, justifyContent: s.justify, alignItems: s.align, flexWrap: s.wrap, gap: s.gap, minHeight: 220 }
      : { display: "grid", gridTemplateColumns: s.template, justifyItems: s.justifyItems, alignItems: s.alignItems, gap: s.gap, minHeight: 220 };

  const css =
    s.mode === "flex"
      ? `.container {
  display: flex;
  flex-direction: ${s.direction};
  justify-content: ${s.justify};
  align-items: ${s.align};
  flex-wrap: ${s.wrap};
  gap: ${s.gap}px;
}`
      : `.container {
  display: grid;
  grid-template-columns: ${s.template};
  justify-items: ${s.justifyItems};
  align-items: ${s.alignItems};
  gap: ${s.gap}px;
}${s.span ? `\n.box:first-child {\n  grid-column: span 2;\n}` : ""}`;

  return (
    <div>
      <LabHeader title="Flexbox & grid playground" hint="Flip any setting and watch the real CSS rearrange the boxes. Box 2 has extra text, so you can see alignment at work." />
      <div className="mb-3 flex flex-wrap gap-2">
        {(["flex", "grid"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => update({ mode: m })}
            className={`rounded-lg px-3 py-1.5 font-mono text-sm font-bold transition ${s.mode === m ? "bg-fuchsia-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
          >
            display: {m}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_1.25fr]">
        <div className="grid content-start gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <Slider label="boxes" value={s.count} min={2} max={8} unit="" onChange={(v) => update({ count: v })} />
          <Slider label="gap" value={s.gap} min={0} max={32} step={4} onChange={(v) => update({ gap: v })} />
          {s.mode === "flex" ? (
            <>
              <Pills label="flex-direction" options={DIRECTIONS} value={s.direction} onPick={(v) => update({ direction: v })} />
              <Pills label="justify-content (main axis)" options={JUSTIFY} value={s.justify} onPick={(v) => update({ justify: v })} />
              <Pills label="align-items (cross axis)" options={ALIGN} value={s.align} onPick={(v) => update({ align: v })} />
              <Pills label="flex-wrap" options={WRAP} value={s.wrap} onPick={(v) => update({ wrap: v })} />
            </>
          ) : (
            <>
              <Pills label="grid-template-columns" options={TEMPLATES} value={s.template} onPick={(v) => update({ template: v })} />
              <Pills label="justify-items (inside each cell, horizontal)" options={GRID_ALIGN} value={s.justifyItems} onPick={(v) => update({ justifyItems: v })} />
              <Pills label="align-items (inside each cell, vertical)" options={GRID_ALIGN} value={s.alignItems} onPick={(v) => update({ alignItems: v })} />
              <label className="flex cursor-pointer items-center justify-between gap-2 font-mono text-xs text-slate-300">
                <span>box 1: grid-column: span 2</span>
                <input type="checkbox" checked={s.span} onChange={(e) => update({ span: e.target.checked })} className="h-4 w-4 accent-sky-400" />
              </label>
            </>
          )}
        </div>
        <div className="grid content-start gap-3">
          <div className="overflow-hidden rounded-xl border border-dashed border-sky-400/50 bg-slate-950/80 p-2" style={container} aria-label="Layout preview">
            {Array.from({ length: s.count }, (_, i) => (
              <div
                key={i}
                className="rounded-lg px-3 py-2 text-center font-mono text-sm font-black text-slate-950"
                style={{ background: BOX_COLORS[i % BOX_COLORS.length], minWidth: 44, gridColumn: s.mode === "grid" && s.span && i === 0 ? "span 2" : undefined }}
              >
                {i + 1}
                {i === 1 && (
                  <div className="text-[10px] font-semibold leading-tight">
                    taller
                    <br />
                    box
                  </div>
                )}
              </div>
            ))}
          </div>
          <CodeBlock lang="css" code={css} />
        </div>
      </div>
      <Solved show={done} text="Goal met: that's exactly the CSS that does it." />
    </div>
  );
}

// ───────────── Box model lab ─────────────

interface BoxState {
  width: number;
  padding: number;
  border: number;
  margin: number;
  sizing: "content-box" | "border-box";
}

type BoxGoal = "fit" | "borderbox";

function boxNumbers(b: BoxState) {
  const extras = 2 * b.padding + 2 * b.border;
  const borderBox = b.sizing === "border-box" ? Math.max(b.width, extras) : b.width + extras;
  const content = borderBox - extras;
  return { borderBox, content, footprint: borderBox + 2 * b.margin };
}

function boxGoalMet(goal: BoxGoal | undefined, b: BoxState) {
  const n = boxNumbers(b);
  if (goal === "fit") return b.sizing === "content-box" && n.borderBox === 240 && b.padding >= 20 && b.border >= 4;
  if (goal === "borderbox") return b.sizing === "border-box" && b.padding >= 24 && b.border >= 2 && n.borderBox === b.width;
  return false;
}

/**
 * A real element with width, padding, border and margin sliders and a
 * box-sizing switch, next to a DevTools-style box diagram. Goals: "fit"
 * (content-box arithmetic) and "borderbox".
 */
export function BoxModelLab({ goal, onSolved }: GoalProps<BoxGoal>) {
  const [b, setB] = useState<BoxState>({ width: 200, padding: 16, border: 4, margin: 16, sizing: "content-box" });
  const [done, setDone] = useState(false);
  const n = boxNumbers(b);

  function update(patch: Partial<BoxState>) {
    const next = { ...b, ...patch };
    setB(next);
    if (!done && boxGoalMet(goal, next)) {
      setDone(true);
      onSolved?.();
    }
  }

  return (
    <div>
      <LabHeader title="Box model lab" hint="Drag the sliders. The orange band is margin, the dark ring is border, green is padding, blue is content." />
      <div className="grid gap-4 md:grid-cols-[1fr_1.3fr]">
        <div className="grid content-start gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <Slider label="width" value={b.width} min={100} max={300} step={5} onChange={(v) => update({ width: v })} />
          <Slider label="padding" value={b.padding} min={0} max={40} step={2} onChange={(v) => update({ padding: v })} />
          <Slider label="border-width" value={b.border} min={0} max={20} onChange={(v) => update({ border: v })} />
          <Slider label="margin" value={b.margin} min={0} max={40} step={4} onChange={(v) => update({ margin: v })} />
          <Pills label="box-sizing" options={["content-box", "border-box"] as const} value={b.sizing} onPick={(v) => update({ sizing: v })} />
        </div>
        <div className="grid content-start gap-3">
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80 p-3">
            <div style={{ display: "inline-block", background: "repeating-linear-gradient(45deg, #f9731655 0 6px, #f9731622 6px 12px)" }}>
              <div
                style={{
                  boxSizing: b.sizing,
                  width: b.width,
                  padding: b.padding,
                  border: `${b.border}px solid #e2e8f0`,
                  margin: b.margin,
                  background: "#34d39966",
                  backgroundClip: "border-box",
                }}
              >
                <div className="rounded-sm bg-sky-400/90 px-1 py-3 text-center font-mono text-xs font-bold text-slate-950">content {n.content}px</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <Readout label="content width" value={`${n.content}px`} />
            <Readout label="border box (visible)" value={`${n.borderBox}px`} strong />
            <Readout label="space taken (+ margin)" value={`${n.footprint}px`} />
          </div>
          <CodeBlock
            lang="css"
            caption={b.sizing === "content-box" ? `border box = ${b.width} + 2×${b.padding} + 2×${b.border} = ${n.borderBox}px` : `border-box: padding and border fit inside the ${b.width}px`}
            code={`.box {
  box-sizing: ${b.sizing};
  width: ${b.width}px;
  padding: ${b.padding}px;
  border: ${b.border}px solid;
  margin: ${b.margin}px;
}`}
          />
        </div>
      </div>
      <Solved show={done} text="Goal met: you can predict a box's size from its CSS." />
    </div>
  );
}

function Readout({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`rounded-lg border px-2 py-1.5 ${strong ? "border-sky-400/50 bg-sky-400/10" : "border-white/10 bg-slate-950/60"}`}>
      <div className="text-[10px] text-slate-400">{label}</div>
      <div className={`text-sm font-bold ${strong ? "text-sky-200" : "text-white"}`}>{value}</div>
    </div>
  );
}

// ───────────── Selector playground ─────────────

const SELECTOR_MARKUP = `<article class="post">
  <h2 id="title">CSS tips</h2>
  <p class="lead">Start at <a href="https://developer.mozilla.org">MDN</a>.</p>
  <ul class="tips">
    <li>Use classes</li>
    <li class="hot">Prefer gap</li>
    <li>Learn grid</li>
  </ul>
  <p>Read <a href="/guide">the guide</a> or <a href="https://web.dev" target="_blank">web.dev</a>.</p>
</article>`;

/** Tag labels are drawn with ::before so the demo DOM has no extra elements. */
const SELECTOR_LAB_CSS = `.sel-lab [data-tag]::before { content: attr(data-tag); display: block; font: 10px ui-monospace, monospace; color: #94a3b8; margin-bottom: 2px; }`;

const PRESETS = ["li", ".tips li", "p a", ".post > p", "h2 + p", "li:nth-child(odd)", "a[href^=\"https\"]", "#title"];

type SelectorGoal = "external" | "second";

/** Real elements, real `querySelectorAll`: type any selector and see what it matches. */
export function SelectorLab({ goal, onSolved }: GoalProps<SelectorGoal>) {
  const root = useRef<HTMLDivElement>(null);
  const [selector, setSelector] = useState("");
  const [hits, setHits] = useState<Set<string>>(new Set());
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  function run(sel: string) {
    setSelector(sel);
    if (!sel.trim() || !root.current) {
      setHits(new Set());
      setError(false);
      return;
    }
    try {
      const found = new Set(Array.from(root.current.querySelectorAll<HTMLElement>(sel)).map((el) => el.dataset.k ?? "").filter(Boolean));
      setHits(found);
      setError(false);
      const key = [...found].sort().join(",");
      const met = (goal === "external" && key === "a1,a3") || (goal === "second" && key === "li2" && !/\.hot|\[class/.test(sel));
      if (!done && met) {
        setDone(true);
        onSolved?.();
      }
    } catch {
      setHits(new Set());
      setError(true);
    }
  }

  const look = (k: string, block = true): CSSProperties => {
    const hit = hits.has(k);
    return {
      display: block ? "block" : "inline-block",
      border: `2px solid ${hit ? "#f472b6" : "rgb(255 255 255 / 0.12)"}`,
      background: hit ? "rgb(244 114 182 / 0.22)" : "rgb(2 6 23 / 0.5)",
      borderRadius: 8,
      padding: block ? "6px 8px" : "0 6px",
      margin: block ? "4px 0" : "0 2px",
      transition: "all 150ms",
    };
  };
  const noNav = (e: { preventDefault: () => void }) => e.preventDefault();

  return (
    <div>
      <LabHeader title="Selector playground" hint="Type a CSS selector (or tap a preset). Matching elements light up pink, using the browser's real selector engine." />
      <style>{SELECTOR_LAB_CSS}</style>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid content-start gap-3">
          <input
            value={selector}
            onChange={(e) => run(e.target.value)}
            placeholder='Try: .tips li, a[href^="https"], h2 + p'
            spellCheck={false}
            aria-label="CSS selector"
            className={`w-full rounded-xl border bg-slate-950 px-3 py-2 font-mono text-sm text-white outline-none ${error ? "border-rose-400" : "border-white/15 focus:border-sky-400"}`}
          />
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p} type="button" onClick={() => run(p)} className="rounded-md bg-white/10 px-2 py-1 font-mono text-xs text-slate-200 hover:bg-white/20">
                {p}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400" aria-live="polite">
            {error ? "That isn't a valid selector yet." : selector.trim() ? `${hits.size} element${hits.size === 1 ? "" : "s"} matched.` : "Nothing selected yet."}
          </div>
          <CodeBlock lang="html" code={SELECTOR_MARKUP} />
        </div>
        {/* The demo DOM mirrors SELECTOR_MARKUP exactly (no extra elements), so :nth-child and + behave as the code shows. */}
        <div ref={root} className="sel-lab rounded-xl border border-white/10 bg-slate-950/80 p-3 text-sm text-slate-200">
          <article className="post" data-k="article" data-tag="<article class=post>" style={look("article")}>
            <h2 id="title" data-k="h2" data-tag="<h2 id=title>" style={{ ...look("h2"), fontWeight: 800, color: "white" }}>
              CSS tips
            </h2>
            <p className="lead" data-k="p1" data-tag="<p class=lead>" style={look("p1")}>
              Start at{" "}
              <a href="https://developer.mozilla.org" data-k="a1" style={look("a1", false)} onClick={noNav}>
                MDN
              </a>
              .
            </p>
            <ul className="tips" data-k="ul" data-tag="<ul class=tips>" style={{ ...look("ul"), listStyle: "none" }}>
              <li data-k="li1" data-tag="<li>" style={look("li1")}>
                Use classes
              </li>
              <li className="hot" data-k="li2" data-tag="<li class=hot>" style={look("li2")}>
                Prefer gap
              </li>
              <li data-k="li3" data-tag="<li>" style={look("li3")}>
                Learn grid
              </li>
            </ul>
            <p data-k="p2" data-tag="<p>" style={look("p2")}>
              Read{" "}
              <a href="/guide" data-k="a2" style={look("a2", false)} onClick={noNav}>
                the guide
              </a>{" "}
              or{" "}
              <a href="https://web.dev" target="_blank" rel="noreferrer" data-k="a3" style={look("a3", false)} onClick={noNav}>
                web.dev
              </a>
              .
            </p>
          </article>
        </div>
      </div>
      <Solved show={done} text="Goal met: your selector matches exactly the right elements." />
    </div>
  );
}

// ───────────── Specificity duel ─────────────

interface Rule {
  css: string;
  spec: string;
  color: string;
}

interface Round {
  html: string;
  a: Rule;
  b: Rule;
  winner: "a" | "b";
  why: string;
}

const BASIC_ROUNDS: Round[] = [
  {
    html: `<nav><a id="home" class="nav-link">Home</a></nav>`,
    a: { css: "#home { color: crimson; }", spec: "1,0,0", color: "#f43f5e" },
    b: { css: "nav .nav-link { color: teal; }", spec: "0,1,1", color: "#14b8a6" },
    winner: "a",
    why: "One ID beats any number of classes and types: (1,0,0) > (0,1,1).",
  },
  {
    html: `<article><p class="intro lead">Hi</p></article>`,
    a: { css: ".intro.lead { color: orange; }", spec: "0,2,0", color: "#f97316" },
    b: { css: "article p.intro { color: violet; }", spec: "0,1,2", color: "#a78bfa" },
    winner: "a",
    why: "Compare column by column: IDs tie at 0, then classes 2 > 1. Type selectors never get a say.",
  },
  {
    html: `<button class="btn">Buy</button>`,
    a: { css: ".btn { color: teal; }  /* first */", spec: "0,1,0", color: "#14b8a6" },
    b: { css: ".btn { color: orange; } /* later */", spec: "0,1,0", color: "#f97316" },
    winner: "b",
    why: "Equal specificity, so order of appearance decides: the later rule wins.",
  },
  {
    html: `<ul class="menu"><li class="active">Shop</li></ul>`,
    a: { css: "ul li.active { color: gold; }", spec: "0,1,2", color: "#facc15" },
    b: { css: ".menu .active { color: skyblue; }", spec: "0,2,0", color: "#38bdf8" },
    winner: "b",
    why: "(0,2,0) beats (0,1,2): two classes outrank one class plus two types.",
  },
  {
    html: `<a id="cta" style="color: blue">Go</a>`,
    a: { css: "#cta { color: red; }", spec: "1,0,0", color: "#ef4444" },
    b: { css: `style="color: blue"`, spec: "inline", color: "#3b82f6" },
    winner: "b",
    why: "An inline style attribute beats every selector in a stylesheet (unless the stylesheet uses !important).",
  },
  {
    html: `<p id="intro">Hello</p>`,
    a: { css: "p { color: green !important; }", spec: "0,0,1 !", color: "#22c55e" },
    b: { css: "#intro { color: purple; }", spec: "1,0,0", color: "#a855f7" },
    winner: "a",
    why: "!important is checked before specificity: an important declaration beats any normal one.",
  },
  {
    html: `<ul><li class="item">First</li>…</ul>`,
    a: { css: "li:first-child { color: lime; }", spec: "0,1,1", color: "#84cc16" },
    b: { css: ".item { color: pink; }", spec: "0,1,0", color: "#f472b6" },
    winner: "a",
    why: "A pseudo-class counts like a class, so li:first-child is (0,1,1) and beats (0,1,0).",
  },
  {
    html: `<body><main><p class="text">Hi</p></main></body>`,
    a: { css: "body > main > p { color: coral; }", spec: "0,0,3", color: "#fb7185" },
    b: { css: ".text { color: cyan; }", spec: "0,1,0", color: "#22d3ee" },
    winner: "b",
    why: "Combinators (>, space, +, ~) add nothing. Three types (0,0,3) lose to one class (0,1,0).",
  },
];

const MODERN_ROUNDS: Round[] = [
  {
    html: `<div class="banner"><h2>Sale</h2></div>`,
    a: { css: ":is(#hero, .banner) h2 { color: red; }", spec: "1,0,1", color: "#ef4444" },
    b: { css: ".banner h2 { color: blue; }", spec: "0,1,1", color: "#3b82f6" },
    winner: "a",
    why: ":is() takes the specificity of its most specific argument (#hero), even though the element matched through .banner.",
  },
  {
    html: `<div class="card"><h2>Title</h2></div>`,
    a: { css: ":where(.card) h2 { color: red; } /* first */", spec: "0,0,1", color: "#ef4444" },
    b: { css: "h2 { color: blue; } /* later */", spec: "0,0,1", color: "#3b82f6" },
    winner: "b",
    why: ":where() always adds zero, so both are (0,0,1) and the later rule wins.",
  },
  {
    html: `@layer base, theme;\n<nav id="nav"><a>Docs</a></nav>`,
    a: { css: "@layer base { #nav a { color: red; } }", spec: "base · 1,0,1", color: "#ef4444" },
    b: { css: "@layer theme { a { color: green; } }", spec: "theme · 0,0,1", color: "#22c55e" },
    winner: "b",
    why: "Layer order is checked before specificity. theme is declared after base, so it wins despite the weaker selector.",
  },
  {
    html: `<nav id="nav"><a>Docs</a></nav>`,
    a: { css: "a { color: gray; } /* not in a layer */", spec: "unlayered · 0,0,1", color: "#94a3b8" },
    b: { css: "@layer components { #nav a { color: violet; } }", spec: "components · 1,0,1", color: "#a78bfa" },
    winner: "a",
    why: "Normal unlayered styles beat every layer. That's why legacy CSS should be put in a layer when you adopt @layer.",
  },
  {
    html: `<p class="note">Read me</p>`,
    a: { css: "p:not(.muted) { color: orange; }", spec: "0,1,1", color: "#f97316" },
    b: { css: ".note { color: teal; }", spec: "0,1,0", color: "#14b8a6" },
    winner: "a",
    why: ":not() counts its argument's specificity, so p:not(.muted) is (0,1,1).",
  },
  {
    html: `<div class="card"><img><h3 class="title big">Hi</h3></div>`,
    a: { css: ".card:has(img) .title { color: pink; }", spec: "0,2,1", color: "#f472b6" },
    b: { css: ".card .title.big { color: lime; }", spec: "0,3,0", color: "#84cc16" },
    winner: "b",
    why: ":has(img) adds its argument's specificity (0,0,1), giving (0,2,1). Three classes (0,3,0) win.",
  },
  {
    html: `@layer base, theme;\n<p>Text</p>`,
    a: { css: "@layer base { p { color: red !important; } }", spec: "base · !important", color: "#ef4444" },
    b: { css: "@layer theme { p { color: blue !important; } }", spec: "theme · !important", color: "#3b82f6" },
    winner: "a",
    why: "For !important declarations the layer order flips: earlier layers win. Resets can protect themselves this way.",
  },
];

type DuelGoal = "basics" | "modern";

/** Two rules target one element: tap the one that wins. Goals: "basics" (6 of 8 right) and "modern" (5 of 7 right). */
export function SpecificityDuelLab({ goal, onSolved }: GoalProps<DuelGoal>) {
  const [set, setSet] = useState<DuelGoal>(goal ?? "basics");
  const rounds = set === "basics" ? BASIC_ROUNDS : MODERN_ROUNDS;
  const need = set === "basics" ? 6 : 5;
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<"a" | "b" | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const r = rounds[i];
  const finished = i === rounds.length - 1 && pick !== null;

  function choose(side: "a" | "b") {
    if (pick) return;
    setPick(side);
    const nextScore = score + (side === r.winner ? 1 : 0);
    setScore(nextScore);
    if (!done && nextScore >= need && (!goal || goal === set)) {
      setDone(true);
      onSolved?.();
    }
  }

  function restart(next: DuelGoal = set) {
    setSet(next);
    setI(0);
    setPick(null);
    setScore(0);
  }

  const shown = pick ? r[r.winner].color : "#e2e8f0";

  return (
    <div>
      <LabHeader title="Specificity duel" hint={`Two rules set the colour of the same element. Tap the winner. Get ${need} of ${rounds.length} right.`} />
      {!goal && (
        <div className="mb-3 flex gap-2">
          {(["basics", "modern"] as const).map((g) => (
            <button key={g} type="button" onClick={() => restart(g)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${set === g ? "bg-sky-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}>
              {g === "basics" ? "Classic specificity" : ":is, :where, @layer"}
            </button>
          ))}
        </div>
      )}
      <div className="mb-2 flex items-center justify-between font-mono text-xs text-slate-400">
        <span>
          Round {i + 1} / {rounds.length}
        </span>
        <span>
          Score {score} · need {need}
        </span>
      </div>
      <CodeBlock lang="html" code={r.html} />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {(["a", "b"] as const).map((side) => {
          const rule = r[side];
          const isWinner = pick && side === r.winner;
          const isWrongPick = pick === side && side !== r.winner;
          return (
            <button
              key={side}
              type="button"
              onClick={() => choose(side)}
              disabled={pick !== null}
              className={`rounded-xl border p-3 text-left transition ${isWinner ? "border-emerald-400 bg-emerald-500/10" : isWrongPick ? "border-rose-400 bg-rose-500/10" : "border-white/10 bg-slate-950/60 hover:-translate-y-0.5 hover:border-sky-400/60"}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rule {side.toUpperCase()}</div>
              <code className="mt-1 block font-mono text-sm text-white">{rule.css}</code>
              {pick && <div className="mt-2 font-mono text-xs text-sky-200">specificity: {rule.spec}</div>}
            </button>
          );
        })}
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/80 p-3 text-center">
        <span className="text-lg font-black transition" style={{ color: shown }}>
          The element&apos;s text
        </span>
      </div>
      {pick && (
        <div className="mt-3 grid gap-2">
          <p className={`text-sm ${pick === r.winner ? "text-emerald-200" : "text-rose-200"}`}>
            {pick === r.winner ? "✔ Right. " : "✘ Not this time. "}
            {r.why}
          </p>
          <div className="flex gap-2">
            {!finished ? (
              <button type="button" onClick={() => { setI(i + 1); setPick(null); }} className="rounded-lg bg-sky-400 px-3 py-1.5 text-sm font-bold text-slate-950">
                Next round →
              </button>
            ) : (
              <button type="button" onClick={() => restart()} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-white/20">
                ↺ Play again ({score}/{rounds.length})
              </button>
            )}
          </div>
        </div>
      )}
      <Solved show={done} text={`Goal met: ${need} duels won. You can read the cascade.`} />
    </div>
  );
}

// ───────────── Accessible form fixer ─────────────

const FIXES = [
  { id: "alt", label: "Give the logo image alt text" },
  { id: "label", label: "Connect a <label> to the email input" },
  { id: "icon", label: "Name the icon-only search button" },
  { id: "button", label: "Turn the clickable <div> into a <button>" },
] as const;
type FixId = (typeof FIXES)[number]["id"];

/** Toggle fixes and watch what a screen reader announces and what Tab can reach. Goal: "all". */
export function A11yFixLab({ goal, onSolved }: GoalProps<"all">) {
  const [on, setOn] = useState<Record<FixId, boolean>>({ alt: false, label: false, icon: false, button: false });
  const [done, setDone] = useState(false);

  function toggle(id: FixId) {
    const next = { ...on, [id]: !on[id] };
    setOn(next);
    if (goal === "all" && !done && FIXES.every((f) => next[f.id])) {
      setDone(true);
      onSolved?.();
    }
  }

  const rows: { what: string; says: string; tab: boolean; ok: boolean }[] = [
    { what: "Logo image (a link home)", says: on.alt ? "“Acme, home, link”" : "“link, logo-final-v2.png”", tab: true, ok: on.alt },
    { what: "Email field", says: on.label ? "“Email, edit text”" : "“edit text” (no name)", tab: true, ok: on.label },
    { what: "Search button 🔍", says: on.icon ? "“Search, button”" : "“button” (no name)", tab: true, ok: on.icon },
    { what: "Subscribe control", says: on.button ? "“Subscribe, button”" : "“Subscribe” (plain text)", tab: on.button, ok: on.button },
  ];

  const code = `<a href="/"><img src="logo-final-v2.png"${on.alt ? ' alt="Acme, home"' : ""}></a>
${on.label ? '<label for="email">Email</label>\n' : ""}<input ${on.label ? 'id="email" ' : ""}type="email" name="email">
<button${on.icon ? ' aria-label="Search"' : ""}>🔍</button>
${on.button ? '<button type="submit">Subscribe</button>' : '<div class="btn" onclick="subscribe()">Subscribe</div>'}`;

  return (
    <div>
      <LabHeader title="Accessible form fixer" hint="Flip each fix and listen (well, read) what a screen reader announces. ⌨️ shows whether the Tab key can reach the control." />
      <div className="grid gap-4 md:grid-cols-[1fr_1.3fr]">
        <div className="grid content-start gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200">
          {FIXES.map((f) => (
            <label key={f.id} className="flex cursor-pointer items-center justify-between gap-3">
              <span>{f.label}</span>
              <input type="checkbox" checked={on[f.id]} onChange={() => toggle(f.id)} className="h-4 w-4 accent-emerald-400" />
            </label>
          ))}
        </div>
        <div className="grid content-start gap-2">
          {rows.map((r) => (
            <div key={r.what} className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${r.ok ? "border-emerald-400/40 bg-emerald-500/10" : "border-rose-400/40 bg-rose-500/10"}`}>
              <div className="min-w-0">
                <div className="text-xs text-slate-400">{r.what}</div>
                <div className="font-mono text-sm text-white">🔊 {r.says}</div>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${r.tab ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950"}`}>⌨️ {r.tab ? "Tab ✓" : "skipped"}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <CodeBlock lang="html" code={code} />
      </div>
      <Solved show={done} text="Goal met: every control has a name, a role, and keyboard access." />
    </div>
  );
}
