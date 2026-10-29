"use client";

import { useState, type CSSProperties } from "react";
import { CodeBlock } from "@/components/learn/blocks";

const chip = (on: boolean) => `rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition ${on ? "bg-sky-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`;

// ───────────── DOM tree ─────────────

const DOM_CODE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>Read the <a href="/docs">docs</a>.</p>
  </body>
</html>`;

const NODES: { depth: number; label: string; kind: "element" | "text" | "attr"; note: string }[] = [
  { depth: 0, label: "html", kind: "element", note: "The root element. lang=\"en\" tells screen readers and translators the page language." },
  { depth: 1, label: "head", kind: "element", note: "Information about the page: title, character set, stylesheets. Not shown in the page itself." },
  { depth: 2, label: "title", kind: "element", note: "The text in the browser tab and in search results." },
  { depth: 3, label: "\"My page\"", kind: "text", note: "A text node: the actual characters inside <title>." },
  { depth: 1, label: "body", kind: "element", note: "Everything the visitor sees." },
  { depth: 2, label: "h1", kind: "element", note: "The main heading of the page." },
  { depth: 3, label: "\"Hello\"", kind: "text", note: "Text node inside the heading." },
  { depth: 2, label: "p", kind: "element", note: "A paragraph. It has three children: text, a link, and more text." },
  { depth: 3, label: "\"Read the \"", kind: "text", note: "Text node. Note the trailing space belongs to it." },
  { depth: 3, label: "a  href=\"/docs\"", kind: "attr", note: "An element with an attribute. href is extra information about the link: where it goes." },
  { depth: 4, label: "\"docs\"", kind: "text", note: "The link's visible text." },
  { depth: 3, label: "\".\"", kind: "text", note: "Text after the link is a separate text node." },
];

/** HTML source next to the DOM tree the browser builds from it. Tap a node. */
export function DomTreeVisual() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <CodeBlock lang="html" code={DOM_CODE} caption="The text file you write…" />
      <div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2">
          {NODES.map((n, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSel(sel === i ? null : i)}
              className={`block w-full rounded-md px-2 py-0.5 text-left font-mono text-xs transition ${sel === i ? "bg-sky-400/20" : "hover:bg-white/5"}`}
              style={{ paddingLeft: `${0.5 + n.depth * 1.1}rem` }}
            >
              <span className={n.kind === "text" ? "text-emerald-300" : "text-violet-300"}>{n.kind === "text" ? "" : "▸ "}{n.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 min-h-10 text-xs text-slate-300">{sel === null ? "…and the DOM tree the browser builds from it. Tap a node." : NODES[sel].note}</p>
      </div>
    </div>
  );
}

// ───────────── Landmarks ─────────────

const REGIONS = [
  { el: "header", role: "banner", area: "h", color: "#f97316", text: "Site logo, name, maybe a search box. The top-level <header> becomes the banner landmark." },
  { el: "nav", role: "navigation", area: "n", color: "#38bdf8", text: "The main navigation links. Screen reader users can jump straight to it." },
  { el: "main", role: "main", area: "m", color: "#a78bfa", text: "The page's unique content. Exactly one visible <main> per page; \"skip to content\" links target it." },
  { el: "aside", role: "complementary", area: "a", color: "#34d399", text: "Related but secondary content: a sidebar, related links, a pull quote." },
  { el: "footer", role: "contentinfo", area: "f", color: "#f472b6", text: "Copyright, contact, legal links. The top-level <footer> becomes the contentinfo landmark." },
] as const;

/** A page wireframe made of landmark elements. Tap a region. */
export function LandmarksVisual() {
  const [sel, setSel] = useState<number>(2);
  const r = REGIONS[sel];
  return (
    <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
      <div
        className="grid gap-1.5 rounded-xl border border-white/10 bg-slate-950/60 p-2"
        style={{ gridTemplateAreas: `"h h" "n n" "m a" "f f"`, gridTemplateColumns: "2fr 1fr", gridTemplateRows: "36px 28px 120px 32px" }}
      >
        {REGIONS.map((x, i) => (
          <button
            key={x.el}
            type="button"
            onClick={() => setSel(i)}
            className="rounded-lg border font-mono text-xs font-bold transition"
            style={{ gridArea: x.area, borderColor: sel === i ? x.color : `${x.color}55`, background: `${x.color}${sel === i ? "40" : "18"}`, color: "white" }}
          >
            &lt;{x.el}&gt;
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="font-mono text-sm font-bold" style={{ color: r.color }}>
          &lt;{r.el}&gt;
        </div>
        <div className="mt-1 text-xs text-slate-400">Landmark role: {r.role}</div>
        <p className="mt-2 text-sm text-slate-200">{r.text}</p>
      </div>
    </div>
  );
}

// ───────────── Flex axes ─────────────

/** Row vs column: which way the main axis runs, and which property controls which axis. */
export function FlexAxisVisual() {
  const [dir, setDir] = useState<"row" | "column">("row");
  const row = dir === "row";
  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        {(["row", "column"] as const).map((d) => (
          <button key={d} type="button" onClick={() => setDir(d)} className={chip(dir === d)}>
            flex-direction: {d}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <div className="text-center font-mono text-[10px] leading-tight text-amber-300" style={{ writingMode: "vertical-rl" }}>
          {row ? "cross axis · align-items ↕" : "main axis · justify-content ↕"}
        </div>
        <div className="grid gap-1">
          <div className="rounded-xl border border-dashed border-sky-400/50 bg-slate-950/80 p-2" style={{ display: "flex", flexDirection: dir, gap: 8, justifyContent: "center", alignItems: "center", height: 160 }}>
            {["#f97316", "#38bdf8", "#a78bfa"].map((c, i) => (
              <div key={c} className="rounded-md px-4 py-2 font-mono text-sm font-black text-slate-950" style={{ background: c }}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="text-center font-mono text-[10px] text-sky-300">{row ? "main axis · justify-content ↔" : "cross axis · align-items ↔"}</div>
        </div>
      </div>
      <CodeBlock lang="css" code={`.container {\n  display: flex;\n  flex-direction: ${dir};\n  justify-content: center; /* along the main axis */\n  align-items: center;     /* along the cross axis */\n  gap: 8px;\n}`} />
    </div>
  );
}

// ───────────── Grid areas ─────────────

const AREA_LAYOUTS = {
  wide: { areas: `"header header" "sidebar main" "footer footer"`, cols: "120px 1fr", rows: "32px 110px 28px" },
  narrow: { areas: `"header" "main" "sidebar" "footer"`, cols: "1fr", rows: "32px 70px 40px 28px" },
};

/** The same four elements placed by grid-template-areas, wide and narrow. */
export function GridAreasVisual() {
  const [mode, setMode] = useState<"wide" | "narrow">("wide");
  const l = AREA_LAYOUTS[mode];
  const cells: [string, string][] = [
    ["header", "#f97316"],
    ["sidebar", "#34d399"],
    ["main", "#a78bfa"],
    ["footer", "#f472b6"],
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="grid content-start gap-2">
        <div className="flex gap-2">
          {(["wide", "narrow"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={chip(mode === m)}>
              {m === "wide" ? "Desktop" : "Phone"}
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/80 p-2" style={{ display: "grid", gridTemplateAreas: l.areas, gridTemplateColumns: l.cols, gridTemplateRows: l.rows, gap: 6, maxWidth: mode === "narrow" ? 200 : undefined }}>
          {cells.map(([name, c]) => (
            <div key={name} className="grid place-items-center rounded-md font-mono text-xs font-bold text-slate-950" style={{ gridArea: name, background: c }}>
              {name}
            </div>
          ))}
        </div>
      </div>
      <CodeBlock
        lang="css"
        caption="Same HTML, different map. Each string is a row; repeating a name spans cells."
        code={`.page {
  display: grid;
  grid-template-columns: ${l.cols};
  grid-template-areas:
    ${l.areas.split("\" \"").join("\"\n    \"")};
}
.page > header { grid-area: header; }
.page > aside  { grid-area: sidebar; }`}
      />
    </div>
  );
}

// ───────────── Positioning ─────────────

const POSITIONS = {
  static: { style: {} as CSSProperties, css: "position: static;", note: "Normal flow. top/left are ignored." },
  relative: { style: { position: "relative", top: 10, left: 24 } as CSSProperties, css: "position: relative;\ntop: 10px; left: 24px;", note: "Shifted from where it would be. Its original space stays reserved." },
  absolute: { style: { position: "absolute", top: 8, right: 8 } as CSSProperties, css: "position: absolute;\ntop: 8px; right: 8px;", note: "Taken out of flow and placed against the nearest positioned ancestor (the scroll box here has position: relative)." },
  sticky: { style: { position: "sticky", top: 0 } as CSSProperties, css: "position: sticky;\ntop: 0;", note: "Behaves normally until it would scroll past top: 0, then sticks inside its scroll container. Scroll the box!" },
};

/** A badge inside a little scroll box: switch its position value and scroll. */
export function PositionVisual() {
  const [pos, setPos] = useState<keyof typeof POSITIONS>("sticky");
  const p = POSITIONS[pos];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="grid content-start gap-2">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(POSITIONS) as (keyof typeof POSITIONS)[]).map((k) => (
            <button key={k} type="button" onClick={() => setPos(k)} className={chip(pos === k)}>
              {k}
            </button>
          ))}
        </div>
        <div className="relative h-44 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/80 p-3 text-xs text-slate-400">
          <p>Paragraph one sits above the badge.</p>
          <div className="z-10 inline-block rounded-md bg-fuchsia-400 px-2 py-1 font-mono text-xs font-black text-slate-950" style={p.style}>
            .badge
          </div>
          {Array.from({ length: 9 }, (_, i) => (
            <p key={i} className="mt-2">
              Filler paragraph {i + 2}. Scroll this box to see how the badge behaves.
            </p>
          ))}
        </div>
      </div>
      <div className="grid content-start gap-2">
        <CodeBlock lang="css" code={`.badge {\n  ${p.css.split("\n").join("\n  ")}\n}`} />
        <p className="text-sm text-slate-300">{p.note}</p>
        <p className="text-xs text-slate-500">position: fixed works like absolute but against the viewport, so it stays put while the whole page scrolls.</p>
      </div>
    </div>
  );
}

// ───────────── Responsive ─────────────

/** Drag a pretend viewport width and see which mobile-first media queries match. */
export function ResponsiveVisual() {
  const [w, setW] = useState(390);
  const cols = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
  const font = Math.min(48, Math.max(24, w * 0.05));
  const queries = [
    { q: "(base)", on: true, set: "1 column" },
    { q: "@media (min-width: 640px)", on: w >= 640, set: "2 columns" },
    { q: "@media (min-width: 1024px)", on: w >= 1024, set: "3 columns" },
  ];
  return (
    <div className="grid gap-3">
      <label className="block font-mono text-xs text-slate-300">
        viewport width: <span className="text-sky-200">{w}px</span>
        <input type="range" min={320} max={1440} step={10} value={w} onChange={(e) => setW(Number(e.target.value))} className="mt-1 w-full accent-sky-400" aria-label="Viewport width" />
      </label>
      <div className="overflow-hidden rounded-xl border border-white/15 bg-slate-950/80 p-2" style={{ width: `${(w / 1440) * 100}%`, minWidth: 120 }}>
        <div className="mb-1 truncate font-bold text-white" style={{ fontSize: Math.round(font / 2.2) }}>
          Heading
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-6 rounded" style={{ background: ["#f97316", "#38bdf8", "#a78bfa", "#34d399", "#f472b6", "#facc15"][i] }} />
          ))}
        </div>
      </div>
      <div className="grid gap-1 font-mono text-xs">
        {queries.map((q) => (
          <div key={q.q} className={`flex justify-between rounded-md px-2 py-1 ${q.on ? "bg-emerald-500/15 text-emerald-200" : "bg-white/5 text-slate-500"}`}>
            <span>{q.q}</span>
            <span>{q.on ? `✓ ${q.set}` : "no match"}</span>
          </div>
        ))}
        <div className="rounded-md bg-sky-400/10 px-2 py-1 text-sky-200">
          h1 font-size: clamp(1.5rem, 5vw, 3rem) = {Math.round(font * 10) / 10}px {font === 24 ? "(min)" : font === 48 ? "(max)" : `(5vw = ${Math.round(w * 0.5) / 10}px)`}
        </div>
      </div>
    </div>
  );
}

// ───────────── Theme tokens ─────────────

/** Custom properties on a wrapper drive a whole component. Change the tokens; nothing else changes. */
export function ThemeVisual() {
  const [hue, setHue] = useState(265);
  const [radius, setRadius] = useState(12);
  const [space, setSpace] = useState(12);
  const [dark, setDark] = useState(true);
  const vars = {
    "--brand": `hsl(${hue} 80% 60%)`,
    "--radius": `${radius}px`,
    "--space": `${space}px`,
    "--bg": dark ? "#0f172a" : "#f8fafc",
    "--text": dark ? "#e2e8f0" : "#0f172a",
  } as CSSProperties;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="grid content-start gap-2 font-mono text-xs text-slate-300">
        <label>
          --brand hue: {hue}
          <input type="range" min={0} max={360} value={hue} onChange={(e) => setHue(Number(e.target.value))} className="w-full accent-fuchsia-400" />
        </label>
        <label>
          --radius: {radius}px
          <input type="range" min={0} max={24} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-fuchsia-400" />
        </label>
        <label>
          --space: {space}px
          <input type="range" min={4} max={24} step={2} value={space} onChange={(e) => setSpace(Number(e.target.value))} className="w-full accent-fuchsia-400" />
        </label>
        <button type="button" onClick={() => setDark(!dark)} className={chip(dark)}>
          [data-theme=&quot;{dark ? "dark" : "light"}&quot;]
        </button>
        <div style={vars} className="mt-1">
          <div style={{ background: "var(--bg)", color: "var(--text)", borderRadius: "var(--radius)", padding: "var(--space)", border: "1px solid var(--brand)" }}>
            <div style={{ fontWeight: 800, marginBottom: "var(--space)" }}>Pro plan</div>
            <div style={{ fontSize: 12, marginBottom: "var(--space)" }}>Everything in Starter, plus teams.</div>
            <button type="button" style={{ background: "var(--brand)", color: "#0f172a", borderRadius: "var(--radius)", padding: "calc(var(--space) / 2) var(--space)", fontWeight: 800 }}>
              Upgrade
            </button>
          </div>
        </div>
      </div>
      <CodeBlock
        lang="css"
        code={`:root {
  --brand: hsl(${hue} 80% 60%);
  --radius: ${radius}px;
  --space: ${space}px;
  --bg: #f8fafc;
  --text: #0f172a;
}
[data-theme="dark"] {
  --bg: #0f172a;
  --text: #e2e8f0;
}
.card {
  background: var(--bg);
  color: var(--text);
  border-radius: var(--radius);
  padding: var(--space);
}`}
      />
    </div>
  );
}

// ───────────── :has() ─────────────

const HAS_CSS = `.hasdemo .task { display: flex; gap: 8px; align-items: center; padding: 6px 10px; border: 1px solid rgb(255 255 255 / 0.12); border-radius: 8px; margin-top: 6px; transition: all 150ms; }
.hasdemo .task:has(input:checked) { border-color: #34d399; opacity: 0.6; text-decoration: line-through; }
.hasdemo .done { display: none; margin-top: 8px; color: #34d399; font-weight: 800; }
.hasdemo:not(:has(input:not(:checked))) .done { display: block; }`;

/** Real :has(): tick tasks and the CSS alone restyles their parents, then the whole list. */
export function HasVisual() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <style>{HAS_CSS}</style>
      <div className="hasdemo rounded-xl border border-white/10 bg-slate-950/80 p-3 text-sm text-slate-200">
        {["Write HTML", "Add CSS", "Try :has()"].map((t) => (
          <label key={t} className="task cursor-pointer">
            <input type="checkbox" className="accent-emerald-400" />
            {t}
          </label>
        ))}
        <div className="done">🎉 All done! (shown by CSS only)</div>
      </div>
      <CodeBlock
        lang="css"
        caption="No JavaScript: the parent reacts to what it contains."
        code={`/* a task that contains a ticked box */
.task:has(input:checked) {
  opacity: 0.6;
  text-decoration: line-through;
}
/* the list has no unticked box left */
.list:not(:has(input:not(:checked))) .done {
  display: block;
}`}
      />
    </div>
  );
}

// ───────────── Container queries ─────────────

const CQ_CSS = `.cqdemo-wrap { container-type: inline-size; }
.cqdemo-card { display: grid; gap: 8px; padding: 10px; border: 1px solid rgb(255 255 255 / 0.15); border-radius: 12px; background: rgb(2 6 23 / 0.8); }
.cqdemo-img { height: 64px; border-radius: 8px; background: linear-gradient(135deg, #f97316, #a78bfa); }
.cqdemo-title { font-weight: 800; color: white; font-size: clamp(14px, 5cqi, 22px); }
@container (min-width: 420px) {
  .cqdemo-card { grid-template-columns: 110px 1fr; align-items: center; }
  .cqdemo-img { height: 80px; }
}`;

/** Real container queries: resize the card's container and the layout switches. */
export function ContainerVisual() {
  const [w, setW] = useState(300);
  return (
    <div className="grid gap-3">
      <style>{CQ_CSS}</style>
      <label className="block font-mono text-xs text-slate-300">
        container width: <span className="text-sky-200">{w}px</span> {w >= 420 ? "· @container (min-width: 420px) ✓" : "· query doesn't match"}
        <input type="range" min={200} max={640} step={10} value={w} onChange={(e) => setW(Number(e.target.value))} className="mt-1 w-full accent-sky-400" aria-label="Container width" />
      </label>
      <div className="overflow-x-auto">
        <div className="cqdemo-wrap" style={{ width: w }}>
          <div className="cqdemo-card">
            <div className="cqdemo-img" />
            <div>
              <div className="cqdemo-title">Same card, any slot</div>
              <div className="text-xs text-slate-400">It reads its container&apos;s width, not the screen&apos;s.</div>
            </div>
          </div>
        </div>
      </div>
      <CodeBlock
        lang="css"
        code={`.slot { container-type: inline-size; } /* the wrapper */

.card { display: grid; gap: 8px; }
.card h3 { font-size: clamp(14px, 5cqi, 22px); }

@container (min-width: 420px) {
  .card { grid-template-columns: 110px 1fr; }
}`}
      />
    </div>
  );
}
