"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type PointerEvent, type ReactNode, useEffect, useState } from "react";

const MAX_PULL = 8;

/** Wraps a button/link so it leans slightly toward a fine pointer. Mouse only, off with reduced motion. */
export function Magnetic({ children, className = "", pull = MAX_PULL }: { children: ReactNode; className?: string; pull?: number }) {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(query.matches && !reduceMotion);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduceMotion]);

  const move = (event: PointerEvent<HTMLElement>) => {
    if (!enabled || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * pull);
    y.set(Math.max(-1, Math.min(1, dy)) * pull * 0.6);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span onPointerMove={move} onPointerLeave={reset} style={{ x, y }} className={`inline-flex ${className}`}>
      {children}
    </motion.span>
  );
}
