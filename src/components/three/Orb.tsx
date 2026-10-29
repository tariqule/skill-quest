"use client";

import { Sparkles } from "@react-three/drei";
import { EmojiSprite, EnergyCore, OrbitMoon } from "./parts";
import { Parallax, Stage } from "./Stage";

/** The WebGL course core: a glowing orb with one moon per domain and the course icon in the middle. */
export default function Orb({ colors, icon, className }: { colors: string[]; icon: string; className?: string }) {
  const core = colors[0] ?? "#38bdf8";
  return (
    <Stage className={className} camera={{ position: [0, 0.6, 6.2], fov: 45 }} fit={2.9}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={18} color={core} distance={8} />
      <directionalLight position={[4, 5, 3]} intensity={1} />
      <EnergyCore color={core} radius={0.85} distort={0.32} />
      {colors.map((c, i) => (
        <OrbitMoon
          key={i}
          radius={1.65 + i * 0.28}
          color={c}
          tilt={[((i * 41) % 50) * (Math.PI / 180) - 0.4, 0, ((i * 23) % 30) * (Math.PI / 180) - 0.25]}
          speed={0.55 - i * 0.06}
          phase={i * 1.7}
          size={0.12}
          glow={0.45}
        />
      ))}
      <EmojiSprite emoji={icon} position={[0, 0, 1.3]} scale={0.8} />
      <Sparkles count={40} scale={[6, 4, 6]} size={2} speed={0.5} color={core} opacity={0.7} />
      <Parallax x={0.8} y={0.5} baseY={0.6} />
    </Stage>
  );
}
