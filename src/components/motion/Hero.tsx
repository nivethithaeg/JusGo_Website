"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { DURATION, EASE, EASE_EXPO, HERO_DELAY, SPRING, STAGGER } from "@/lib/motion";

export type HeadlineLine = { text: string; accent?: boolean; alternates?: string[] };

/**
 * Headline split into lines; each line slides up out of an overflow-hidden mask.
 * The real text lives in aria-label, the visual spans are aria-hidden.
 */
export function HeadlineReveal({
  lines,
  className = "",
  delay = 0.08,
}: {
  lines: HeadlineLine[];
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <h1 aria-label={lines.map((line) => line.text).join(" ")} className={className}>
      {lines.map((line, index) => (
        // Padding + negative margin keep descenders/ascenders inside the mask without moving the layout.
        <span key={line.text} aria-hidden="true" className="-my-[0.06em] block overflow-hidden py-[0.06em]">
          <motion.span
            initial={reduceMotion ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: DURATION.headline, delay: delay + index * STAGGER.headline, ease: EASE_EXPO }}
            className={`block ${line.accent && !line.alternates?.length ? "accent-shimmer" : ""}`}
          >
            {line.alternates?.length ? <RotatingText phrases={[line.text, ...line.alternates]} /> : line.text}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

const ROTATE_FIRST_MS = 3600;
const ROTATE_EVERY_MS = 3200;

/**
 * Cycles through phrases in one spot. All phrases share one grid cell so the line keeps the height of the
 * tallest one (no layout shift); the active one slides up into the line's mask while the old one leaves.
 */
function RotatingText({ phrases }: { phrases: string[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let interval: number | undefined;
    const first = window.setTimeout(() => {
      setActive(1);
      interval = window.setInterval(() => {
        if (!document.hidden) setActive((current) => (current + 1) % phrases.length);
      }, ROTATE_EVERY_MS);
    }, ROTATE_FIRST_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [phrases.length, reduceMotion]);

  return (
    <span className="grid">
      {phrases.map((phrase, index) => {
        const isActive = index === active;
        return (
          <motion.span
            key={phrase}
            className="accent-shimmer col-start-1 row-start-1"
            initial={false}
            animate={{ y: isActive ? "0%" : index === (active + phrases.length - 1) % phrases.length ? "-110%" : "110%", opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.8, ease: EASE_EXPO }}
          >
            {phrase}
          </motion.span>
        );
      })}
    </span>
  );
}

/** Hero follow-up: the subtitle (0.45s) and CTA buttons (0.55s, spring overshoot). */
export function HeroItem({
  children,
  kind,
  className = "",
}: {
  children: ReactNode;
  kind: "subtitle" | "cta";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const cta = kind === "cta";
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: cta ? 22 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        cta
          ? { ...SPRING.cta, delay: HERO_DELAY.cta }
          : { duration: DURATION.base, delay: HERO_DELAY.subtitle, ease: EASE }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Rounded mouse outline with a lime dot that slides down and fades, looping. */
export function ScrollHint() {
  const reduceMotion = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 [@media(min-height:700px)]:block lg:bottom-14"
    >
      <div className="flex h-9 w-[22px] justify-center rounded-full border border-white/35 pt-2">
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 12], opacity: [1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          className="h-1.5 w-1 rounded-full bg-jg-lime"
        />
      </div>
    </div>
  );
}
