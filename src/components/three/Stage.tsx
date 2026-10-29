"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "./hooks";

/**
 * A transparent WebGL canvas. It stops animating while scrolled off screen and renders a
 * single still frame when the player prefers reduced motion.
 */
export function Stage({
  children,
  className = "",
  camera = { position: [0, 0, 8], fov: 45 },
  fit,
}: {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
  /** Radius of the scene's content. On narrow screens the camera backs off so it all stays in view. */
  fit?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative min-w-0 max-w-full overflow-hidden ${className}`}
    >
      {/* Absolutely positioned so the canvas's own pixel size can never widen the page. */}
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 1.75]}
          camera={camera}
          frameloop={visible && !reduced ? "always" : "demand"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          {fit !== undefined && (
            <FitWidth radius={fit} baseZ={camera.position[2]} />
          )}
          {children}
        </Canvas>
      </div>
    </div>
  );
}

/** Moves the camera back until a sphere of `radius` fits the canvas width (portrait phones). */
function FitWidth({ radius, baseZ }: { radius: number; baseZ: number }) {
  useFrame(({ camera, size }) => {
    if (!("fov" in camera)) return;
    const halfFov = MathUtils.degToRad(camera.fov / 2);
    camera.position.z = Math.max(
      baseZ,
      radius / (Math.tan(halfFov) * (size.width / size.height)),
    );
  });
  return null;
}

/** Eases the camera toward the pointer so the scene feels like a window you can lean into. */
export function Parallax({
  x = 1.4,
  y = 0.9,
  baseY = 0,
  lookY = 0,
}: {
  x?: number;
  y?: number;
  baseY?: number;
  lookY?: number;
}) {
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * x - camera.position.x) * 0.04;
    camera.position.y += (baseY + pointer.y * y - camera.position.y) * 0.04;
    camera.lookAt(0, lookY, 0);
  });
  return null;
}
