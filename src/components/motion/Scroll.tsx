"use client";

import { type MotionValue, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Children, type ReactNode, useRef } from "react";

/** Moves its children against the page scroll while the section passes by. */
export function Parallax({ children, distance = 60, className = "" }: { children: ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={reduceMotion ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

function RailStep({ index, total, progress, children }: { index: number; total: number; progress: MotionValue<number>; children: ReactNode }) {
  const at = (index + 0.5) / total;
  const glow = useTransform(progress, [at - 0.18, at], [0, 1]);
  return (
    <div className="relative">
      <span aria-hidden="true" className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full border border-white/25 bg-jg-950">
        <motion.span style={{ opacity: glow }} className="absolute -inset-px rounded-full bg-jg-lime shadow-[0_0_10px_rgba(155,226,47,0.7)]" />
      </span>
      {children}
    </div>
  );
}

/** Vertical rail that fills with lime as the steps scroll through; each dot lights when reached. */
export function ScrollRail({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const done = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = reduceMotion ? done : scrollYProgress;
  const items = Children.toArray(children);
  return (
    <div ref={ref} className={`relative pl-6 ${className}`}>
      <span aria-hidden="true" className="absolute bottom-1 left-[3px] top-2 w-px bg-white/10">
        <motion.span style={{ scaleY: progress }} className="absolute inset-0 origin-top bg-jg-lime" />
      </span>
      <div className="space-y-4">
        {items.map((item, index) => (
          <RailStep key={index} index={index} total={items.length} progress={progress}>
            {item}
          </RailStep>
        ))}
      </div>
    </div>
  );
}

/**
 * Faint sports-line shapes (a dashed ring, a pitch outline, two dots) that sit behind a section and drift at
 * different speeds as it scrolls past, so the section reads as layered. Clipped to the section, decorative only.
 * The section needs `relative isolate` so the layer stays behind its content.
 */
export function ParallaxDecor({ tone = "light", side = "right" }: { tone?: "light" | "dark"; side?: "left" | "right" }) {
  const color = tone === "light" ? "text-jg-600" : "text-[#B6FF3B]";
  const flip = side === "left";
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${color}`}>
      <Parallax distance={120} className={`absolute top-[6%] h-[26rem] w-[26rem] ${flip ? "-left-40" : "-right-40"}`}>
        <svg viewBox="0 0 200 200" className="h-full w-full opacity-[0.16]" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="100" cy="100" r="96" strokeDasharray="3 6" />
          <circle cx="100" cy="100" r="62" />
          <circle cx="100" cy="100" r="2.5" fill="currentColor" />
        </svg>
      </Parallax>
      <Parallax distance={60} className={`absolute bottom-[4%] h-60 w-80 ${flip ? "-right-24" : "-left-24"}`}>
        <svg viewBox="0 0 160 100" className="h-full w-full opacity-[0.14]" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="4" y="4" width="152" height="92" rx="2" />
          <path d="M80 4v92" />
          <circle cx="80" cy="50" r="16" />
          <rect x="4" y="28" width="26" height="44" />
          <rect x="130" y="28" width="26" height="44" />
        </svg>
      </Parallax>
      <Parallax distance={170} className={`absolute bottom-[22%] h-3 w-3 rounded-full bg-current opacity-30 ${flip ? "left-[14%]" : "right-[14%]"}`}>
        <span />
      </Parallax>
      <Parallax distance={95} className={`absolute top-[18%] h-2 w-2 rounded-full bg-current opacity-25 ${flip ? "right-[10%]" : "left-[10%]"}`}>
        <span />
      </Parallax>
    </div>
  );
}
