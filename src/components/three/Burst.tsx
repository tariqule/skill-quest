"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, type InstancedMesh } from "three";
import { rand } from "./hooks";

const COLORS = ["#38bdf8", "#a78bfa", "#f59e0b", "#34d399", "#f87171", "#facc15"];
const DUMMY = new Object3D();

/** Full-screen 3D confetti: tumbling shards fly up from the bottom, then fall with gravity. */
export default function Burst({ count = 140 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 12], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 6, 5]} intensity={1.4} />
        <Shards count={count} />
      </Canvas>
    </div>
  );
}

function Shards({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const t = useRef(0);
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (rand(i) - 0.5) * 6,
        vx: (rand(i + 1000) - 0.5) * 9,
        vy: 9 + rand(i + 2000) * 8,
        vz: (rand(i + 3000) - 0.5) * 6,
        spin: (rand(i + 4000) - 0.5) * 14,
        delay: rand(i + 5000) * 0.35,
        s: 0.12 + rand(i + 6000) * 0.16,
      })),
    [count],
  );

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new Color();
    parts.forEach((_, i) => m.setColorAt(i, c.set(COLORS[i % COLORS.length])));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [parts]);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    t.current += Math.min(dt, 0.05);
    parts.forEach((p, i) => {
      const k = Math.max(0, t.current - p.delay);
      DUMMY.position.set(p.x + p.vx * k, -7 + p.vy * k - 6.5 * k * k, p.vz * k);
      DUMMY.rotation.set(p.spin * k, p.spin * 0.7 * k, p.spin * 0.4 * k);
      DUMMY.scale.setScalar(k > 0 ? p.s * 1.4 : 0);
      DUMMY.updateMatrix();
      m.setMatrixAt(i, DUMMY.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.3} metalness={0.4} />
    </instancedMesh>
  );
}
