"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { type ReactNode, useRef, useState } from "react";
import { EASE_EXPO } from "@/lib/motion";

/** Thin lime line along the top edge of a section that draws outward from the centre as it enters view. */
export function DrawDivider() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease: EASE_EXPO }}
      className="pointer-events-none absolute inset-x-[8%] top-0 z-10 h-px bg-gradient-to-r from-transparent via-jg-lime/60 to-transparent"
    />
  );
}

/** Soft background glow that slides sideways as its section scrolls past. */
export function GlowShift({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return <motion.div ref={ref} aria-hidden="true" style={reduceMotion ? undefined : { x }} className={className} />;
}

/** Icon tile: its ring draws in on entry and the glyph gives a small wiggle on hover. */
export function IconBadge({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "stadium" }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
      whileHover={reduceMotion ? undefined : { rotate: [0, -10, 8, -4, 0], scale: 1.06 }}
      transition={{ y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 0.5 }, scale: { duration: 0.3 } }}
      className={`relative grid h-11 w-11 place-items-center rounded-2xl text-xl ${tone === "stadium" ? "bg-[#B6FF3B]/10 text-[#B6FF3B]" : "bg-jg-600/10 text-jg-600"}`}
    >
      <svg aria-hidden="true" viewBox="0 0 44 44" className="pointer-events-none absolute inset-0 h-full w-full">
        <motion.rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="15"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.2, ease: EASE_EXPO }}
        />
      </svg>
      {children}
    </motion.span>
  );
}

type Dot = { id: number; x: number; y: number };

const DOT_COUNT = 14;

/** Wrap a button/link: clicking it fires a small burst of lime dots. Dots exist only briefly, created at click time. */
export function ConfettiBurst({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [bursts, setBursts] = useState<{ id: number; dots: Dot[] }[]>([]);

  const fire = () => {
    if (reduceMotion) return;
    const id = Date.now();
    const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
      const angle = (i / DOT_COUNT) * Math.PI * 2 + Math.random() * 0.4;
      const distance = 46 + Math.random() * 44;
      return { id: i, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
    });
    setBursts((current) => [...current, { id, dots }]);
    window.setTimeout(() => setBursts((current) => current.filter((burst) => burst.id !== id)), 1000);
  };

  return (
    <span onClick={fire} className={`relative inline-flex ${className}`}>
      {children}
      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
        {bursts.map((burst) =>
          burst.dots.map((dot) => (
            <motion.span
              key={`${burst.id}-${dot.id}`}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: dot.x, y: dot.y + 18, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className={`absolute -ml-1 -mt-1 h-2 w-2 rounded-full ${dot.id % 3 === 0 ? "bg-white" : "bg-jg-lime"}`}
            />
          )),
        )}
      </span>
    </span>
  );
}

/** Thin lime light that circles the border of a pill-shaped button. The light layer only rotates (transform). */
export function GlowBorder({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden rounded-full p-[2px]">
      <span aria-hidden="true" className="glow-border-spin absolute left-1/2 top-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2" />
      <span className="relative inline-flex rounded-full bg-jg-900">{children}</span>
    </span>
  );
}
