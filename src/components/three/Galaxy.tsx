"use client";

import { Sparkles, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3, type Group, type Mesh } from "three";
import { useCoarsePointer } from "./hooks";
import { EmojiSprite, EnergyCore } from "./parts";
import { Parallax, Stage } from "./Stage";

export interface GalaxyItem {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const SCALE = new Vector3();

/**
 * An interactive orbit map: each item is a planet (or gem) circling a glowing core.
 * Hovering slows the orbits and names the item; clicking calls `onSelect`.
 */
export default function Galaxy({
  items,
  onSelect,
  coreColor = "#34d399",
  shape = "planet",
  className,
}: {
  items: GalaxyItem[];
  onSelect: (id: string) => void;
  coreColor?: string;
  shape?: "planet" | "gem";
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  useEffect(() => () => void (document.body.style.cursor = ""), []);
  const label = items.find((i) => i.id === hovered);
  const touch = useCoarsePointer();

  return (
    <div className={`relative ${className ?? ""}`}>
      {label && (
        <div
          className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 font-mono text-sm font-bold text-white"
          style={{ boxShadow: `0 0 0 1px ${label.color}, 0 0 24px -6px ${label.color}` }}
        >
          {label.icon} {label.label} <span className="text-xs font-normal text-slate-400">· {touch ? "tap again to open" : "click to open"}</span>
        </div>
      )}
    <Stage className="h-full w-full" camera={{ position: [0, 2.4, 9.5], fov: 45 }} fit={5}>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 0]} intensity={30} color={coreColor} distance={14} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} />
      <EnergyCore color={coreColor} radius={0.95} />
      {items.map((it, i) => (
        <Orbiter key={it.id} item={it} index={i} total={items.length} shape={shape} hovered={hovered} setHovered={setHovered} onSelect={onSelect} touch={touch} />
      ))}
      <Sparkles count={90} scale={[14, 6, 14]} size={2.2} speed={0.4} color={coreColor} opacity={0.6} />
      <Stars radius={60} depth={30} count={1200} factor={3} fade speed={0.6} />
      <Parallax baseY={2.4} />
    </Stage>
    </div>
  );
}

function Orbiter({
  item,
  index,
  total,
  shape,
  hovered,
  setHovered,
  onSelect,
  touch,
}: {
  touch: boolean;
  item: GalaxyItem;
  index: number;
  total: number;
  shape: "planet" | "gem";
  hovered: string | null;
  setHovered: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const body = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const lane = index % 3;
  const radius = 2.4 + lane * 1.05;
  const tilt = (((index * 37) % 30) - 15) * (Math.PI / 180);
  const speed = 0.16 / (1 + lane * 0.45);
  const angle = useRef((index / Math.max(1, total)) * Math.PI * 2);
  const active = hovered === item.id;

  useFrame((_, dt) => {
    angle.current += dt * speed * (hovered ? 0.15 : 1);
    body.current?.position.set(Math.cos(angle.current) * radius, 0, Math.sin(angle.current) * radius);
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += dt * (active ? 2 : 0.7);
    m.rotation.x += dt * 0.3;
    const s = active ? 1.5 : 1;
    m.scale.lerp(SCALE.set(s, s, s), 0.15);
  });

  return (
    <group rotation={[tilt, 0, tilt * 0.6]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.006, 6, 160]} />
        <meshBasicMaterial color={item.color} transparent opacity={active ? 0.65 : 0.16} />
      </mesh>
      <group ref={body}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(item.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(null);
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            e.stopPropagation();
            // No hover on touch screens: the first tap names the planet, the second opens it.
            if (touch && hovered !== item.id) setHovered(item.id);
            else onSelect(item.id);
          }}
        >
          {shape === "gem" ? <octahedronGeometry args={[0.36, 0]} /> : <icosahedronGeometry args={[0.34, 1]} />}
          <meshStandardMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={active ? 1.1 : 0.45}
            roughness={shape === "gem" ? 0.1 : 0.35}
            metalness={shape === "gem" ? 0.6 : 0.3}
            flatShading
          />
        </mesh>
        <EmojiSprite emoji={item.icon} position={[0, 0.7, 0]} scale={active ? 0.62 : 0.46} />
      </group>
    </group>
  );
}
