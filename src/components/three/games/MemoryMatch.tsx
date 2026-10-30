"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";
import { useWebGL } from "../hooks";
import { Stage } from "../Stage";
import { hoverHandlers, TextSprite, type GameProps, type MemoryTile } from "./common";

/** Memory Match: flip two tiles at a time and pair each term with its meaning. */
export default function MemoryMatch({ data, color, onFinish }: GameProps<MemoryTile[]>) {
  const gl = useWebGL();
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const pairs = data.length / 2;
  const cols = data.length <= 8 ? 2 : 4;
  const rows = Math.ceil(data.length / cols);

  function flip(i: number) {
    if (open.length === 2 || open.includes(i) || matched.includes(data[i].pair)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next.map((k) => data[k]);
    if (a.pair === b.pair && a.side !== b.side) {
      const done = [...matched, a.pair];
      setTimeout(() => {
        setMatched(done);
        setOpen([]);
        if (done.length === pairs) onFinish(Math.max(1, 10 - Math.max(0, moves + 1 - pairs)), 10);
      }, 450);
    } else setTimeout(() => setOpen([]), 950);
  }

  const shown = (i: number) => open.includes(i) || matched.includes(data[i].pair);

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-bold text-slate-300">
        <span>
          Pairs {matched.length}/{pairs}
        </span>
        <span>Moves {moves}</span>
      </div>
      {gl && (
        <Stage className={`mt-3 w-full ${rows > 3 ? "h-96" : "h-72 sm:h-80"}`} camera={{ position: [0, 0, 6.4], fov: 45 }} fit={cols * 1.05}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[2, 4, 5]} intensity={1.2} />
          {data.map((t, i) => {
            const x = (i % cols) - (cols - 1) / 2;
            const y = (rows - 1) / 2 - Math.floor(i / cols);
            return <Tile key={i} tile={t} position={[x * 1.85, y * 1.25 * (rows > 3 ? 1.05 : 1), 0]} faceUp={shown(i)} done={matched.includes(t.pair)} color={color} onClick={() => flip(i)} />;
          })}
        </Stage>
      )}
      {!gl && (
        <div className={`mt-3 grid gap-2 ${cols === 4 ? "grid-cols-4" : "grid-cols-2"}`}>
          {data.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => flip(i)}
              className={`min-h-20 rounded-xl border p-2 text-xs font-semibold ${matched.includes(t.pair) ? "border-emerald-400 bg-emerald-400/15 text-emerald-100" : shown(i) ? "border-sky-400 bg-sky-400/15 text-white" : "border-white/10 bg-white/5 text-transparent"}`}
            >
              {shown(i) ? t.text : "?"}
            </button>
          ))}
        </div>
      )}
      {/* The flipped tiles in full-size text, so they're easy to read on any screen. */}
      <div className="mt-3 grid min-h-16 gap-2 sm:grid-cols-2">
        {open.map((k) => (
          <div
            key={k}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold ${data[k].side === "term" ? "border-sky-400/50 bg-sky-400/10 text-sky-50" : "border-violet-400/50 bg-violet-400/10 text-violet-50"}`}
          >
            <span className="mr-1.5 text-[10px] font-black uppercase tracking-wider opacity-70">{data[k].side === "term" ? "Term" : "Meaning"}</span>
            {data[k].full ?? data[k].text}
          </div>
        ))}
        {open.length === 0 && <p className="text-center text-xs text-slate-500 sm:col-span-2">Tap two tiles. A term and its meaning make a pair.</p>}
      </div>
    </div>
  );
}

function Tile({
  tile,
  position,
  faceUp,
  done,
  color,
  onClick,
}: {
  tile: MemoryTile;
  position: [number, number, number];
  faceUp: boolean;
  done: boolean;
  color: string;
  onClick: () => void;
}) {
  const g = useRef<Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const target = faceUp ? Math.PI : 0;
    g.current.rotation.y += (target - g.current.rotation.y) * 0.18;
    const s = done ? 0.94 : 1;
    g.current.scale.x += (s - g.current.scale.x) * 0.2;
    g.current.scale.y = g.current.scale.x;
  });
  const back = tile.side === "term" ? "#0ea5e9" : "#8b5cf6";
  return (
    <group ref={g} position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        {...hoverHandlers}
      >
        <boxGeometry args={[1.7, 1.1, 0.12]} />
        <meshStandardMaterial color={done ? "#34d399" : color} roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Back face (shown first): a "?" */}
      <TextSprite flat text="?" position={[0, 0, 0.065]} width={1.5} background="rgba(0,0,0,0)" fontSize={200} />
      {/* Front face, drawn on the far side so the flip reveals it. */}
      <group rotation={[0, Math.PI, 0]}>
        <TextSprite flat text={tile.text} position={[0, 0, 0.065]} width={1.62} maxHeight={1.02} background={done ? "rgba(6,78,59,0.95)" : back} fontSize={tile.side === "term" ? 88 : 66} />
      </group>
    </group>
  );
}
