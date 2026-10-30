"use client";

import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { useWebGL } from "../hooks";
import { Stage } from "../Stage";
import { hoverHandlers, TextSprite, type CatchRound, type GameProps } from "./common";

const LANES = [-2.1, 0, 2.1];
const TOP = 3;
const GROUND = -2.4;

/** Gem Catch: read the meaning, tap the falling gem with the right term before it lands. */
export default function GemCatch({ data, color, onFinish }: GameProps<CatchRound[]>) {
  const gl = useWebGL();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [flash, setFlash] = useState<{ ok: boolean; pick: number } | null>(null);
  const busy = useRef(false);
  const r = data[round];

  function settle(ok: boolean, pick: number) {
    if (busy.current) return;
    busy.current = true;
    const nextScore = score + (ok ? 1 : 0);
    const nextLives = lives - (ok ? 0 : 1);
    setScore(nextScore);
    setLives(nextLives);
    setStreak(ok ? streak + 1 : 0);
    setFlash({ ok, pick });
    setTimeout(() => {
      busy.current = false;
      setFlash(null);
      if (nextLives <= 0 || round + 1 >= data.length) onFinish(nextScore, data.length);
      else setRound(round + 1);
    }, 700);
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-bold">
        <span>{"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}</span>
        <span className="text-slate-300">
          Round {round + 1}/{data.length} · ⭐ {score}
          {streak >= 2 ? ` · 🔥${streak}` : ""}
        </span>
      </div>
      <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Which term means</div>
        <p className="mt-1 text-base font-semibold text-white">{r.definition}</p>
      </div>
      {gl && (
        <Stage className="mt-3 h-64 w-full sm:h-72" camera={{ position: [0, 0.2, 7.5], fov: 45 }} fit={3.6}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 4]} intensity={1.4} />
          <pointLight position={[0, 0, 3]} intensity={10} color={color} />
          <Gems key={round} round={r} speed={0.55 + streak * 0.08} flash={flash} color={color} onPick={(i) => settle(i === r.answer, i)} onLand={() => settle(false, -1)} />
          <mesh position={[0, GROUND - 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 2]} />
            <meshBasicMaterial color={color} transparent opacity={0.12} />
          </mesh>
          <Sparkles count={30} scale={[7, 5, 2]} size={2} speed={0.4} color={color} />
        </Stage>
      )}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {r.choices.map((c, i) => {
          const tone = flash && (i === r.answer ? "border-emerald-400 bg-emerald-400/20" : i === flash.pick ? "border-rose-400 bg-rose-400/20" : "");
          return (
            <button
              key={i}
              type="button"
              disabled={!!flash}
              onClick={() => settle(i === r.answer, i)}
              className={`rounded-xl border px-2 py-2 text-xs font-bold text-white transition sm:text-sm ${tone || "border-white/15 bg-white/5 hover:bg-white/10"}`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">{gl ? "Tap a falling gem, or a button below it." : "Tap the right term."}</p>
    </div>
  );
}

function Gems({
  round,
  speed,
  flash,
  color,
  onPick,
  onLand,
}: {
  round: CatchRound;
  speed: number;
  flash: { ok: boolean; pick: number } | null;
  color: string;
  onPick: (i: number) => void;
  onLand: () => void;
}) {
  const refs = useRef<(Group | null)[]>([]);
  const spins = useRef<(Mesh | null)[]>([]);
  const y = useRef(TOP);
  const landed = useRef(false);
  useFrame((_, dt) => {
    if (flash) return;
    y.current -= dt * speed;
    refs.current.forEach((g, i) => {
      if (g) g.position.y = y.current + Math.sin(i * 1.7) * 0.25;
    });
    spins.current.forEach((m) => {
      if (!m) return;
      m.rotation.y += dt * 1.6;
      m.rotation.x += dt * 0.6;
    });
    if (y.current < GROUND && !landed.current) {
      landed.current = true;
      onLand();
    }
  });
  return (
    <>
      {round.choices.map((label, i) => {
        const right = flash && i === round.answer;
        const wrong = flash && i === flash.pick && !right;
        const c = right ? "#34d399" : wrong ? "#f87171" : color;
        return (
          <group
            key={i}
            ref={(g) => {
              refs.current[i] = g;
            }}
            position={[LANES[i], TOP, 0]}
          >
            <mesh
              ref={(m) => {
                spins.current[i] = m;
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!flash) onPick(i);
              }}
              {...hoverHandlers}
            >
              <octahedronGeometry args={[0.55, 0]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={right || wrong ? 1 : 0.35} roughness={0.15} metalness={0.5} flatShading />
            </mesh>
            {/* The term rides under its gem. */}
            <TextSprite text={label} position={[0, -1, 0.3]} width={2} fontSize={62} />
          </group>
        );
      })}
    </>
  );
}
