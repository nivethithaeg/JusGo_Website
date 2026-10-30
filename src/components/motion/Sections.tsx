"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Highlight, ScrambleText, WordReveal } from "@/components/motion/Text";

const TIMELINE = [
  { title: "Venue sets the rules", detail: "Courts, slots, and pricing are defined once by the owner." },
  { title: "Apps ask to connect", detail: "A booking platform requests a connection to the venue." },
  { title: "Owner approves", detail: "Every connection starts with the venue owner's consent." },
  { title: "Bookings stay in sync", detail: "Connected platforms share the same live availability and price." },
];

/** Small icon per step that animates with the step's lit value (0 to 1). */
function StepIcon({ index, lit }: { index: number; lit: MotionValue<number> }) {
  const knobX = useTransform(lit, [0, 1], [0, 9]);
  const draw = useTransform(lit, [0, 1], [0, 1]);
  const spin = useTransform(lit, [0, 1], [0, 360]);
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-jg-600/10 text-jg-600" aria-hidden="true">
      <svg viewBox="0 0 28 28" className="h-6 w-6">
        {index === 0 ? (
          <>
            <rect x="3" y="9" width="22" height="10" rx="5" {...common} />
            <motion.circle cx="9" cy="14" r="3" fill="currentColor" style={{ x: knobX }} />
          </>
        ) : null}
        {index === 1 ? (
          <>
            <circle cx="6" cy="14" r="3" {...common} />
            <circle cx="22" cy="14" r="3" {...common} />
            <motion.path d="M9 14 H19" {...common} style={{ pathLength: draw }} />
          </>
        ) : null}
        {index === 2 ? (
          <>
            <circle cx="14" cy="14" r="10" {...common} />
            <motion.path d="M9 14.5 L12.5 18 L19 10.5" {...common} style={{ pathLength: draw }} />
          </>
        ) : null}
        {index === 3 ? (
          <motion.g style={{ rotate: spin, originX: "14px", originY: "14px" }}>
            <path d="M6 12 A8.5 8.5 0 0 1 21 9" {...common} />
            <path d="M22 16 A8.5 8.5 0 0 1 7 19" {...common} />
            <path d="M21 4.5 V9.5 H16" {...common} />
            <path d="M7 23.5 V18.5 H12" {...common} />
          </motion.g>
        ) : null}
      </svg>
    </span>
  );
}

function TimelineStep({ index, progress, title, detail }: { index: number; progress: MotionValue<number>; title: string; detail: string }) {
  const at = index / (TIMELINE.length - 1);
  const lit = useTransform(progress, [Math.max(0, at - 0.14), at], [0, 1]);
  const lift = useTransform(progress, [Math.max(0, at - 0.14), at], [10, 0]);
  const dim = useTransform(progress, [Math.max(0, at - 0.14), at], [0.4, 1]);
  return (
    <motion.li style={{ opacity: dim, y: lift }} className="relative pl-9 md:pl-0 md:pt-9">
      <span className="absolute left-0 top-1 h-4 w-4 rounded-full border border-jg-900/20 bg-white md:left-0 md:top-0" aria-hidden="true">
        <motion.span style={{ opacity: lit }} className="absolute -inset-px rounded-full bg-jg-lime shadow-[0_0_12px_rgba(155,226,47,0.7)]" />
      </span>
      <StepIcon index={index} lit={lit} />
      <p className="font-mono text-[10px] text-jg-600">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-1 text-base font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-900/60">{detail}</p>
    </motion.li>
  );
}

/** "How it works" timeline: the line fills and each step lights up as you scroll through it. */
export function HowItWorksTimeline() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const done = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = reduceMotion ? done : scrollYProgress;

  return (
    <section id="how-it-works" className="relative bg-mist-50 px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1160px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jg-600">
          <ScrambleText text="How it works" />
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-[-0.055em] sm:text-5xl">
          <WordReveal>Four steps from setup to <Highlight>in sync.</Highlight></WordReveal>
        </h2>

        <div ref={ref} className="relative mt-12">
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-jg-900/15 md:hidden">
            <motion.span style={{ scaleY: progress }} className="absolute inset-0 origin-top bg-jg-lime" />
          </span>
          <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-jg-900/15 md:block">
            <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-jg-lime" />
          </span>
          <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
            {TIMELINE.map((step, index) => (
              <TimelineStep key={step.title} index={index} progress={progress} title={step.title} detail={step.detail} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
