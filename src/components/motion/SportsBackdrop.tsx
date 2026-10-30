"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { type BallKind, BallGlyph } from "@/components/motion/SportsMotif";
import { Parallax } from "@/components/motion/Scroll";

const LINE = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

type Gear = BallKind | "bat" | "shuttle" | "trophy" | "whistle";

function GearArt({ kind }: { kind: Gear }) {
  if (kind === "football" || kind === "basketball" || kind === "tennis" || kind === "cricket") return <BallGlyph kind={kind} />;
  return (
    <svg viewBox="-8 -8 16 16" className="block h-7 w-7 overflow-visible">
      {kind === "bat" ? (
        <>
          <path d="M-1 -7.6 H1 V-3 H-1 Z" {...LINE} />
          <path d="M-1 -5.8 H1 M-1 -4.4 H1" {...LINE} strokeWidth={0.8} />
          <path d="M-1 -3 L-3.8 -1.4 V6.6 Q-3.8 7.8 -2.6 7.8 H2.6 Q3.8 7.8 3.8 6.6 V-1.4 L1 -3" {...LINE} />
          <path d="M0 -1.4 V6" {...LINE} strokeWidth={0.9} />
        </>
      ) : null}
      {kind === "shuttle" ? (
        <>
          <circle cx="0" cy="5.4" r="2.2" {...LINE} />
          <path d="M-2 3.4 L-5.6 -5.6 M2 3.4 L5.6 -5.6 M0 3.2 V-6.4 M-5.6 -5.6 Q0 -8 5.6 -5.6" {...LINE} strokeWidth={1.1} />
        </>
      ) : null}
      {kind === "trophy" ? (
        <>
          <path d="M-4 -6 H4 V-1 Q4 3 0 3.4 Q-4 3 -4 -1 Z" {...LINE} />
          <path d="M-4 -4.5 H-6.4 Q-6.4 -0.5 -3.6 0 M4 -4.5 H6.4 Q6.4 -0.5 3.6 0" {...LINE} strokeWidth={1.1} />
          <path d="M0 3.4 V6 M-2.8 7 H2.8" {...LINE} />
        </>
      ) : null}
      {kind === "whistle" ? (
        <>
          <path d="M-7 -2 H2.6 Q7 -2 7 2.6 Q7 6.5 3 6.5 Q-1 6.5 -1 3 V2" {...LINE} />
          <circle cx="3.2" cy="3" r="1.4" {...LINE} strokeWidth={1.1} />
          <path d="M-7 -2 L-7 1 H-1" {...LINE} strokeWidth={1.1} />
        </>
      ) : null}
    </svg>
  );
}

type Spot = { kind: Gear; at: string; size: number; drift: number; tilt: number; delay: number };

/** Four placements per page side; each section picks a different set so the pages do not repeat themselves. */
const SETS: Record<"a" | "b" | "c", Spot[]> = {
  a: [
    { kind: "football", at: "right-[4%] top-[8%]", size: 72, drift: 90, tilt: 14, delay: 0 },
    { kind: "bat", at: "left-[3%] top-[44%]", size: 78, drift: 130, tilt: -28, delay: 0.6 },
    { kind: "trophy", at: "right-[6%] bottom-[10%]", size: 70, drift: 60, tilt: 0, delay: 1.1 },
    { kind: "tennis", at: "left-[8%] bottom-[5%]", size: 44, drift: 150, tilt: 0, delay: 0.3 },
  ],
  b: [
    { kind: "basketball", at: "left-[3%] top-[7%]", size: 70, drift: 110, tilt: 0, delay: 0.2 },
    { kind: "shuttle", at: "right-[4%] top-[40%]", size: 76, drift: 90, tilt: 18, delay: 0.8 },
    { kind: "whistle", at: "left-[5%] bottom-[8%]", size: 62, drift: 70, tilt: -12, delay: 0.4 },
    { kind: "cricket", at: "right-[9%] bottom-[5%]", size: 40, drift: 140, tilt: 0, delay: 1 },
  ],
  c: [
    { kind: "trophy", at: "left-[4%] top-[10%]", size: 74, drift: 70, tilt: -6, delay: 0.5 },
    { kind: "football", at: "right-[3%] top-[34%]", size: 84, drift: 120, tilt: -18, delay: 0 },
    { kind: "bat", at: "right-[8%] bottom-[6%]", size: 70, drift: 90, tilt: 34, delay: 0.9 },
    { kind: "basketball", at: "left-[7%] bottom-[10%]", size: 48, drift: 150, tilt: 0, delay: 0.2 },
  ],
};

/**
 * Faint sports gear (balls, a cricket bat, shuttlecock, trophy, whistle) in the section margins, drifting against
 * the scroll and floating gently. For white sections: it sits behind the content (the section needs
 * `relative isolate`) and is shown from tablet width up, where there is margin to spare.
 */
export function SportsBackdrop({ set = "a" }: { set?: "a" | "b" | "c" }) {
  const reduceMotion = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden text-jg-600 md:block">
      {SETS[set].map((s) => (
        <Parallax key={s.kind + s.at} distance={s.drift} className={`absolute ${s.at}`}>
          <Float reduceMotion={!!reduceMotion} delay={s.delay}>
            <div style={{ width: s.size, height: s.size, transform: `rotate(${s.tilt}deg)` }} className="opacity-[0.2]">
              <div className="origin-top-left" style={{ transform: `scale(${s.size / 28})`, width: 28, height: 28 }}>
                <GearArt kind={s.kind} />
              </div>
            </div>
          </Float>
        </Parallax>
      ))}
    </div>
  );
}

function Float({ children, delay, reduceMotion }: { children: ReactNode; delay: number; reduceMotion: boolean }) {
  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 3, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}
