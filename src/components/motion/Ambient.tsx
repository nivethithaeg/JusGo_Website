"use client";

import { useEffect, useState } from "react";

type Particle = { left: number; top: number; size: number; duration: number; delay: number };

/** Faint lime motes drifting upward. Positions are random, so they are created after mount to avoid hydration mismatch. */
export function AmbientParticles({ count = 14 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: 20 + Math.random() * 80,
        size: 2 + Math.random() * 3,
        duration: 9 + Math.random() * 8,
        delay: -Math.random() * 12,
      })),
    );
  }, [count]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="ambient-mote absolute rounded-full bg-jg-lime"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
        />
      ))}
    </div>
  );
}
