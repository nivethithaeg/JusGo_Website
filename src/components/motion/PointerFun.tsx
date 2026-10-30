"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const TRAIL_DOTS = 12;
const TRAIL_STEP = 22; // px the pointer must travel before the next dot

/** Faint lime dots that fade behind a mouse moving over the parent element. Mouse only. */
export function HeroTrail() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const host = root?.parentElement;
    if (!root || !host || reduceMotion) return;
    const dots = Array.from(root.children) as HTMLElement[];
    let next = 0;
    let last: { x: number; y: number } | null = null;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = host.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      if (last && Math.hypot(x - last.x, y - last.y) < TRAIL_STEP) return;
      last = { x, y };
      const dot = dots[next++ % dots.length];
      dot.animate(
        [
          { transform: `translate3d(${x}px, ${y}px, 0) scale(1)`, opacity: 0.55 },
          { transform: `translate3d(${x}px, ${y + 10}px, 0) scale(0.2)`, opacity: 0 },
        ],
        { duration: 750, easing: "ease-out" },
      );
    };
    const onLeave = () => {
      last = null;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {Array.from({ length: TRAIL_DOTS }, (_, i) => (
        <span key={i} className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-jg-lime opacity-0" />
      ))}
    </div>
  );
}

/** A small ball that bounces along the bottom of the footer and rolls toward the mouse. */
export function FooterBall() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const target = useMotionValue(0);
  const x = useSpring(target, { stiffness: 60, damping: 14 });

  useEffect(() => {
    const host = rootRef.current?.parentElement;
    if (!host || reduceMotion) return;
    target.set(host.clientWidth * 0.5);
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = host.getBoundingClientRect();
      target.set(Math.max(8, Math.min(box.width - 8, event.clientX - box.left)));
    };
    host.addEventListener("pointermove", onMove);
    return () => host.removeEventListener("pointermove", onMove);
  }, [reduceMotion, target]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-8 overflow-hidden motion-reduce:hidden">
      <motion.div style={{ x }} className="absolute bottom-1 left-0">
        <motion.span
          animate={{ y: [0, -18, 0], scaleY: [0.7, 1.18, 0.7], scaleX: [1.35, 0.88, 1.35] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: ["easeOut", "easeIn"] }}
          style={{ originY: 1 }}
          className="-ml-1.5 block h-3 w-3 rounded-full bg-jg-lime shadow-[0_0_10px_rgba(155,226,47,0.7)]"
        />
      </motion.div>
    </div>
  );
}
