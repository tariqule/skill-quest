"use client";

import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, SRGBColorSpace, type Group, type Mesh } from "three";

/** A liquid glowing sphere inside a slowly turning wireframe shell. */
export function EnergyCore({ color, radius = 1, distort = 0.38 }: { color: string; radius?: number; distort?: number }) {
  const shell = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (!shell.current) return;
    shell.current.rotation.y += dt * 0.25;
    shell.current.rotation.x += dt * 0.1;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.55} distort={distort} speed={2} roughness={0.2} metalness={0.35} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[radius * 1.45, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

/** A thin glowing ring with a moon riding along it. `size` and `glow` (0–1) let callers show progress. */
export function OrbitMoon({
  radius,
  color,
  tilt = [0, 0, 0],
  speed = 0.4,
  phase = 0,
  size = 0.14,
  glow = 0.5,
}: {
  radius: number;
  color: string;
  tilt?: [number, number, number];
  speed?: number;
  phase?: number;
  size?: number;
  glow?: number;
}) {
  const moon = useRef<Group>(null);
  const angle = useRef(phase);
  useFrame((_, dt) => {
    angle.current += dt * speed;
    moon.current?.position.set(Math.cos(angle.current) * radius, 0, Math.sin(angle.current) * radius);
  });
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008 + glow * 0.012, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.15 + glow * 0.55} />
      </mesh>
      <group ref={moon}>
        <mesh>
          <sphereGeometry args={[size, 24, 24]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4 + glow} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/** An emoji drawn into a texture and shown as a camera-facing sprite (no DOM overlay needed). */
export function EmojiSprite({ emoji, position = [0, 0, 0], scale = 0.5 }: { emoji: string; position?: [number, number, number]; scale?: number }) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "96px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
      ctx.fillText(emoji, 64, 72);
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [emoji]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite position={position} scale={[scale, scale, scale]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}
