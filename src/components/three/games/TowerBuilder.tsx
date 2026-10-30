"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";
import { RichText } from "@/components/learn/code";
import { useWebGL } from "../hooks";
import { Stage } from "../Stage";
import type { GameProps, QuickQuestion } from "./common";

const GOAL = 6;
const PALETTE = ["#38bdf8", "#a78bfa", "#34d399", "#f59e0b", "#f472b6", "#facc15", "#60a5fa", "#fb7185"];

/** Tower Builder: every right answer stacks a block. A wrong one knocks the top block off. Reach the goal height. */
export default function TowerBuilder({ data, onFinish }: GameProps<QuickQuestion[]>) {
  const gl = useWebGL();
  const [i, setI] = useState(0);
  const [height, setHeight] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wobble, setWobble] = useState(0);
  const q = data[i];

  function answer(k: number) {
    if (picked !== null) return;
    setPicked(k);
    const ok = k === q.answer;
    const h = ok ? height + 1 : Math.max(0, height - 1);
    const s = strikes + (ok ? 0 : 1);
    setHeight(h);
    setStrikes(s);
    if (!ok) setWobble((w) => w + 1);
    setTimeout(() => {
      setPicked(null);
      if (h >= GOAL || s >= 3 || i + 1 >= data.length) onFinish(h, GOAL);
      else setI(i + 1);
    }, 900);
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_minmax(0,1fr)] md:items-start">
      <div className="min-w-0">
        <div className="flex items-center justify-between text-sm font-bold text-slate-300">
          <span>
            🧱 {height}/{GOAL}
          </span>
          <span>{"💥".repeat(strikes)}{"·".repeat(3 - strikes)}</span>
        </div>
        {gl ? (
          <Stage className="mt-2 h-64 w-full" camera={{ position: [0, 2.2, 7], fov: 45 }} fit={2.4}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 6, 4]} intensity={1.3} />
            <Tower height={height} wobble={wobble} />
          </Stage>
        ) : (
          <div className="mt-2 flex h-40 flex-col-reverse items-center gap-1 rounded-xl bg-black/30 p-2">
            {Array.from({ length: height }, (_, k) => (
              <div key={k} className="h-4 w-24 rounded" style={{ background: PALETTE[k % PALETTE.length] }} />
            ))}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Question {i + 1} of {Math.min(data.length, 10)}
        </div>
        <p className="mt-1 font-semibold text-white">
          <RichText text={q.prompt} />
        </p>
        <div className="mt-3 grid gap-2">
          {q.options.map((o, k) => {
            const tone =
              picked === null ? "border-white/15 bg-white/5 hover:bg-white/10" : k === q.answer ? "border-emerald-400 bg-emerald-400/15" : k === picked ? "border-rose-400 bg-rose-400/15" : "border-white/5 opacity-60";
            return (
              <button key={k} type="button" onClick={() => answer(k)} className={`rounded-xl border px-3 py-2 text-left text-sm text-white transition ${tone}`}>
                <RichText text={o} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Tower({ height, wobble }: { height: number; wobble: number }) {
  const g = useRef<Group>(null);
  const t = useRef(0);
  const lastWobble = useRef(wobble);
  useFrame((_, dt) => {
    if (!g.current) return;
    if (lastWobble.current !== wobble) {
      lastWobble.current = wobble;
      t.current = 1.2;
    }
    t.current = Math.max(0, t.current - dt);
    g.current.rotation.z = Math.sin(t.current * 18) * 0.12 * t.current;
  });
  return (
    <group ref={g} position={[0, -1.6, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.6, 1.8, 0.3, 32]} />
        <meshStandardMaterial color="#64748b" emissive="#334155" emissiveIntensity={0.6} roughness={0.5} />
      </mesh>
      {Array.from({ length: height }, (_, k) => (
        <Block key={k} y={k * 0.5 + 0.25} color={PALETTE[k % PALETTE.length]} />
      ))}
    </group>
  );
}

function Block({ y, color }: { y: number; color: string }) {
  const m = useRef<Group>(null);
  useFrame(() => {
    if (!m.current) return;
    // Drop in from above and settle.
    m.current.position.y += (y - m.current.position.y) * 0.15;
    m.current.rotation.y += (0 - m.current.rotation.y) * 0.1;
  });
  return (
    <group ref={m} position={[0, y + 3, 0]} rotation={[0, 0.8, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 0.46, 1]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </mesh>
    </group>
  );
}
