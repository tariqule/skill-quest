"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";
import { useWebGL } from "../hooks";
import { Stage } from "../Stage";
import { hoverHandlers, TextSprite, type GameProps, type SortStatement } from "./common";

/** Sort the Bins: is this meaning right for this term? Throw the card into True or False. */
export default function SortBins({ data, onFinish }: GameProps<SortStatement[]>) {
  const gl = useWebGL();
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [thrown, setThrown] = useState<{ bin: boolean; ok: boolean } | null>(null);
  const s = data[i];

  function sort(bin: boolean) {
    if (thrown) return;
    const ok = bin === s.truth;
    const next = score + (ok ? 1 : 0);
    setThrown({ bin, ok });
    setScore(next);
    setTimeout(() => {
      setThrown(null);
      if (i + 1 >= data.length) onFinish(next, data.length);
      else setI(i + 1);
    }, 900);
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-bold text-slate-300">
        <span>
          Card {i + 1}/{data.length}
        </span>
        <span>⭐ {score}</span>
      </div>
      <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Does this term mean this?</div>
        <p className="mt-1 text-lg font-black text-white">{s.term}</p>
        <p className="mt-1 text-base text-slate-200">{s.meaning}</p>
      </div>
      {gl && (
        <Stage className="mt-3 h-60 w-full" camera={{ position: [0, 0.4, 6.8], fov: 45 }} fit={3.4}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 5, 4]} intensity={1.2} />
          <Card key={i} text={s.term} thrown={thrown} />
          <Bin x={-2.2} label="✓ True" color="#34d399" onClick={() => sort(true)} />
          <Bin x={2.2} label="✗ False" color="#f87171" onClick={() => sort(false)} />
        </Stage>
      )}
      {thrown && <p className={`mt-2 text-center text-sm font-bold ${thrown.ok ? "text-emerald-300" : "text-rose-300"}`}>{thrown.ok ? "Nice!" : s.truth ? "That one was true." : "That one was false."}</p>}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" disabled={!!thrown} onClick={() => sort(true)} className="rounded-xl border border-emerald-400/50 bg-emerald-400/10 py-2.5 font-black text-emerald-100">
          ✓ True
        </button>
        <button type="button" disabled={!!thrown} onClick={() => sort(false)} className="rounded-xl border border-rose-400/50 bg-rose-400/10 py-2.5 font-black text-rose-100">
          ✗ False
        </button>
      </div>
    </div>
  );
}

function Card({ text, thrown }: { text: string; thrown: { bin: boolean } | null }) {
  const g = useRef<Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const tx = thrown ? (thrown.bin ? -2.2 : 2.2) : 0;
    const ty = thrown ? -1.6 : 0.6;
    const ts = thrown ? 0.35 : 1;
    g.current.position.x += (tx - g.current.position.x) * 0.12;
    g.current.position.y += (ty - g.current.position.y) * 0.12;
    g.current.scale.setScalar(g.current.scale.x + (ts - g.current.scale.x) * 0.12);
    g.current.rotation.z += ((thrown ? (thrown.bin ? 0.6 : -0.6) : 0) - g.current.rotation.z) * 0.1;
  });
  return (
    <group ref={g} position={[0, 0.6, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <TextSprite text={text} width={3.6} fontSize={84} background="rgba(15,23,42,0.95)" />
      </Float>
    </group>
  );
}

function Bin({ x, label, color, onClick }: { x: number; label: string; color: string; onClick: () => void }) {
  return (
    <group position={[x, -1.6, 0]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        {...hoverHandlers}
      >
        <cylinderGeometry args={[0.95, 0.75, 1, 32, 1, true]} />
        <meshStandardMaterial color={color} side={2} roughness={0.4} emissive={color} emissiveIntensity={0.15} />
      </mesh>
      <TextSprite text={label} position={[0, 0, 1.05]} width={1.7} fontSize={88} background="rgba(0,0,0,0.65)" />
    </group>
  );
}
