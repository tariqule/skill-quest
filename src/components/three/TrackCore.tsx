"use client";

import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { rand, useCoarsePointer } from "./hooks";
import { OrbitMoon } from "./parts";
import { Stage } from "./Stage";

export interface StageRing {
  color: string;
  /** 0–1: brighter, thicker rings and bigger moons as the stage is mastered. */
  mastery: number;
}

/**
 * A Code Quest track's 3D core: a metallic torus knot in the track colour, one ring per stage
 * that lights up with mastery, and floating code blocks. Drag to spin it.
 */
export default function TrackCore({ color, stages, className }: { color: string; stages: StageRing[]; className?: string }) {
  const touch = useCoarsePointer();
  const blocks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        pos: [(rand(i) - 0.5) * 7, (rand(i + 50) - 0.5) * 4.5, (rand(i + 90) - 0.5) * 4 - 1] as [number, number, number],
        size: 0.12 + rand(i + 130) * 0.16,
        hue: i % 3,
      })),
    [],
  );

  return (
    <Stage className={className} camera={{ position: [0, 0.4, 6.5], fov: 45 }} fit={2.9}>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 2.5]} intensity={20} color={color} distance={10} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} />
      <Knot color={color} />
      {stages.map((s, i) => (
        <OrbitMoon
          key={i}
          radius={1.55 + i * 0.32}
          color={s.color}
          tilt={[0.35 + i * 0.32, 0, -0.2 + i * 0.18]}
          speed={0.5 - i * 0.08}
          phase={i * 1.4}
          size={0.08 + s.mastery * 0.1}
          glow={0.15 + s.mastery * 0.85}
        />
      ))}
      {blocks.map((b, i) => (
        <Float key={i} speed={1 + (i % 4) * 0.4} rotationIntensity={1.4} floatIntensity={1.2}>
          <mesh position={b.pos}>
            <boxGeometry args={[b.size, b.size, b.size]} />
            <meshBasicMaterial color={b.hue === 0 ? color : b.hue === 1 ? "#34d399" : "#38bdf8"} wireframe transparent opacity={0.45} />
          </mesh>
        </Float>
      ))}
      <Sparkles count={50} scale={[7, 4, 5]} size={2} speed={0.4} color={color} opacity={0.6} />
      {/* Drag-to-spin on desktop only: on phones a drag over the scene should scroll the page. */}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={!touch} autoRotate autoRotateSpeed={0.7} rotateSpeed={0.6} />
    </Stage>
  );
}

function Knot({ color }: { color: string }) {
  const knot = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!knot.current) return;
    knot.current.rotation.x += dt * 0.3;
    knot.current.rotation.y += dt * 0.45;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={knot}>
        <torusKnotGeometry args={[0.7, 0.22, 200, 28]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.35} metalness={0.7} roughness={0.18} clearcoat={1} />
      </mesh>
    </Float>
  );
}
