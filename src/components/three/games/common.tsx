"use client";

import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

export interface Pair {
  term: string;
  definition: string;
}

export interface QuickQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

/** Strip inline-code backticks and squash whitespace so text reads well on a 3D label. */
export function plain(text: string) {
  return text.replace(/`/g, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

export function shorten(text: string, max: number) {
  const t = plain(text);
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Fisher-Yates shuffle (only call from event handlers or memo initialisers, never during render). */
export function shuffled<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Wrap text onto a canvas and use it as a sprite texture. Width is in world units; height follows the text. */
export function TextSprite({
  text,
  position = [0, 0, 0],
  width = 1.6,
  color = "#ffffff",
  background = "rgba(2,6,23,0.85)",
  fontSize = 44,
  flat = false,
  maxHeight,
}: {
  /** Flat labels only: shrink to keep the label at most this tall (world units). */
  maxHeight?: number;
  /** A flat plane that turns with its parent (card faces) instead of a sprite that always faces the camera. */
  flat?: boolean;
  text: string;
  position?: [number, number, number];
  width?: number;
  color?: string;
  background?: string;
  fontSize?: number;
}) {
  const { texture, aspect } = useMemo(() => {
    const W = 512;
    const pad = 28;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    const fontFor = (px: number) => `600 ${px}px system-ui, -apple-system, Segoe UI, sans-serif`;
    const words = text.split(" ");
    // Shrink the font until the longest single word fits (long words can't wrap).
    let size = fontSize;
    ctx.font = fontFor(size);
    while (size > 18 && Math.max(...words.map((w) => ctx.measureText(w).width)) > W - pad * 2) {
      size -= 4;
      ctx.font = fontFor(size);
    }
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (ctx.measureText(next).width > W - pad * 2 && line) {
        lines.push(line);
        line = w;
      } else line = next;
    }
    if (line) lines.push(line);
    const lh = size * 1.25;
    c.width = W;
    c.height = Math.ceil(lines.length * lh + pad * 2);
    ctx.font = fontFor(size);
    ctx.fillStyle = background;
    const r = 36;
    ctx.beginPath();
    ctx.roundRect(0, 0, c.width, c.height, r);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    lines.forEach((l, i) => ctx.fillText(l, W / 2, pad + lh * i + lh / 2));
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return { texture: t, aspect: c.height / c.width };
  }, [text, color, background, fontSize]);
  useEffect(() => () => texture.dispose(), [texture]);
  if (flat) {
    const w = maxHeight && width * aspect > maxHeight ? maxHeight / aspect : width;
    return (
      <mesh position={position}>
        <planeGeometry args={[w, w * aspect]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
    );
  }
  return (
    <sprite position={position} scale={[width, width * aspect, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

/** Pointer cursor while hovering a clickable mesh. */
export const hoverHandlers = {
  onPointerOver: () => void (document.body.style.cursor = "pointer"),
  onPointerOut: () => void (document.body.style.cursor = ""),
};

export interface GameProps<D> {
  data: D;
  color: string;
  onFinish: (score: number, max: number) => void;
}

// ───────────── Deck builders (call from event handlers: they shuffle) ─────────────

export interface CatchRound {
  definition: string;
  choices: string[];
  answer: number;
}

export function buildCatchRounds(pairs: Pair[], count = 8): CatchRound[] {
  return shuffled(pairs)
    .slice(0, count)
    .map((p) => {
      const others = shuffled(pairs.filter((x) => x.term !== p.term)).slice(0, 2).map((x) => shorten(x.term, 26));
      const choices = shuffled([shorten(p.term, 26), ...others]);
      return { definition: shorten(p.definition, 140), choices, answer: choices.indexOf(shorten(p.term, 26)) };
    });
}

export interface MemoryTile {
  pair: number;
  /** Short text drawn on the tile. */
  text: string;
  /** The full text, shown in the readout under the board. */
  full?: string;
  side: "term" | "definition";
}

export function buildMemoryTiles(pairs: Pair[], count = 6): MemoryTile[] {
  const picked = shuffled(pairs).slice(0, count);
  return shuffled(
    picked.flatMap((p, i) => [
      { pair: i, text: shorten(p.term, 26), full: plain(p.term), side: "term" as const },
      { pair: i, text: shorten(p.definition, 30), full: shorten(p.definition, 200), side: "definition" as const },
    ]),
  );
}

export function buildTowerQuestions(questions: QuickQuestion[], count = 10): QuickQuestion[] {
  return shuffled(questions)
    .slice(0, count)
    .map((q) => {
      const order = shuffled(q.options.map((_, i) => i));
      return { prompt: plain(q.prompt), options: order.map((i) => plain(q.options[i])), answer: order.indexOf(q.answer) };
    });
}

export interface SortStatement {
  term: string;
  meaning: string;
  truth: boolean;
}

/** "X means Y" statements, half true and half with another term's meaning swapped in. */
export function buildSortStatements(pairs: Pair[], count = 8): SortStatement[] {
  return shuffled(pairs)
    .slice(0, count)
    .map((p, i) => {
      const lie = i % 2 === 1 && pairs.length > 1;
      const other = lie ? shuffled(pairs.filter((x) => x.term !== p.term))[0] : p;
      return { term: shorten(p.term, 30), meaning: shorten(other.definition, 160), truth: !lie };
    });
}
