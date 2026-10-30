"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type Motif = "football" | "basketball" | "shuttle" | "tennis" | "cricket" | "goal";

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const PENTAGON = "M0 -2.6 L2.5 -0.8 L1.5 2.1 L-1.5 2.1 L-2.5 -0.8 Z";

/** Soccer-style ball centred on (0,0). */
function FootballBall({ r = 6.5 }: { r?: number }) {
  return (
    <>
      <circle r={r} {...STROKE} />
      <path d={PENTAGON} fill="currentColor" fillOpacity="0.85" />
      <path d={`M0 -2.6 V${-r} M2.5 -0.8 L${r * 0.95} ${-r * 0.3} M1.5 2.1 L${r * 0.6} ${r * 0.8} M-1.5 2.1 L${-r * 0.6} ${r * 0.8} M-2.5 -0.8 L${-r * 0.95} ${-r * 0.3}`} {...STROKE} strokeWidth={1.1} />
    </>
  );
}

export type BallKind = "football" | "basketball" | "tennis" | "cricket";

/** A flying sports ball (28px, rotates freely) in the current text colour. */
export function BallGlyph({ kind }: { kind: BallKind }) {
  return (
    <svg viewBox="-8 -8 16 16" className="block h-7 w-7 overflow-visible">
      {kind === "football" ? <FootballBall r={7} /> : null}
      {kind === "basketball" ? (
        <>
          <circle r="7" {...STROKE} />
          <path d="M-7 0 H7 M0 -7 V7 M-5 -5 Q0 0 -5 5 M5 -5 Q0 0 5 5" {...STROKE} strokeWidth={1.1} />
        </>
      ) : null}
      {kind === "tennis" ? (
        <>
          <circle r="7" {...STROKE} />
          <path d="M-5.6 -4 Q0 0 -5.6 4 M5.6 -4 Q0 0 5.6 4" {...STROKE} strokeWidth={1.2} />
        </>
      ) : null}
      {kind === "cricket" ? (
        <>
          <circle r="6.5" fill="currentColor" fillOpacity="0.9" />
          <path d="M-5.5 -2 Q0 -4.6 5.5 -2 M-5.5 2 Q0 4.6 5.5 2" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.4 1.2" />
        </>
      ) : null}
    </svg>
  );
}

const GROUND = <line x1="3" y1="44" x2="61" y2="44" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />;

function Football() {
  return (
    <>
      {GROUND}
      <g transform="translate(12 37)">
        <motion.g variants={{ play: { x: [0, 42], transition: { duration: 1.5, ease: "easeOut" } } }}>
          <motion.g variants={{ play: { rotate: [0, 600], transition: { duration: 1.5, ease: "easeOut" } } }}>
            <FootballBall />
          </motion.g>
        </motion.g>
      </g>
    </>
  );
}

function Basketball() {
  return (
    <>
      <path d="M62 6 V24" {...STROKE} />
      <path d="M62 14 H49" {...STROKE} />
      <motion.g
        style={{ originY: 0 }}
        variants={{ play: { scaleY: [1, 1, 1.3, 0.92, 1], transition: { duration: 1.6, times: [0, 0.65, 0.78, 0.9, 1] } } }}
      >
        <path d="M49 14 L51.5 25 M62 14 L59.5 25 M53.5 14 L54.5 25 M57.5 14 L56.5 25 M50.5 19 H60.5" {...STROKE} strokeWidth={1.1} />
      </motion.g>
      <g transform="translate(9 38)">
        <motion.g
          variants={{
            play: {
              x: [0, 22, 46, 46],
              y: [0, -30, -22, -4],
              transition: { duration: 1.6, times: [0, 0.4, 0.66, 1], ease: "easeInOut" },
            },
          }}
        >
          <motion.g variants={{ play: { rotate: [0, 300], transition: { duration: 1.6 } } }}>
            <circle r="6" {...STROKE} />
            <path d="M-6 0 H6 M0 -6 V6 M-4.2 -4.2 Q0 0 -4.2 4.2 M4.2 -4.2 Q0 0 4.2 4.2" {...STROKE} strokeWidth={1.1} />
          </motion.g>
        </motion.g>
      </g>
      {GROUND}
    </>
  );
}

function Shuttle() {
  return (
    <g transform="translate(10 34)">
      <motion.g
        variants={{
          play: {
            x: [0, 22, 44, 22, 0],
            y: [0, -24, 0, -24, 0],
            rotate: [-35, 0, 40, 180, 215],
            transition: { duration: 2, ease: "easeInOut" },
          },
        }}
      >
        <circle cx="5" r="2.6" fill="currentColor" fillOpacity="0.85" />
        <path d="M2.4 -1.2 L-9 -6.5 M2.4 1.2 L-9 6.5 M2.4 0 L-9.5 0 M-9 -6.5 Q-11 0 -9 6.5" {...STROKE} strokeWidth={1.3} />
      </motion.g>
    </g>
  );
}

function Tennis() {
  return (
    <>
      {GROUND}
      <g transform="translate(8 12)">
        <motion.g
          variants={{
            play: {
              x: [0, 10, 20, 30, 38, 46],
              y: [0, 27, 10, 27, 17, 27],
              transition: { duration: 1.5, ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"] },
            },
          }}
        >
          <motion.g variants={{ play: { rotate: [0, 480], transition: { duration: 1.5 } } }}>
            <circle r="5" {...STROKE} />
            <path d="M-4 -3 Q0 0 -4 3 M4 -3 Q0 0 4 3" {...STROKE} strokeWidth={1.1} />
          </motion.g>
        </motion.g>
      </g>
    </>
  );
}

function Cricket() {
  return (
    <>
      {GROUND}
      <motion.g variants={{ play: { rotate: [0, 0, 7, 0], x: [0, 0, 2, 0], transition: { duration: 1.6, times: [0, 0.55, 0.72, 1] } } }}>
        <path d="M49 44 V27 M54 44 V27 M59 44 V27" {...STROKE} />
      </motion.g>
      <motion.g variants={{ play: { y: [0, 0, -13, 0], rotate: [0, 0, 35, 0], transition: { duration: 1.6, times: [0, 0.55, 0.78, 1] } } }}>
        <path d="M49.5 25.5 H53.5 M54.5 25.5 H58.5" {...STROKE} />
      </motion.g>
      <g transform="translate(10 39)">
        <motion.g variants={{ play: { x: [0, 34], transition: { duration: 1.6, times: [0, 0.55], ease: "easeIn" } } }}>
          <motion.g variants={{ play: { rotate: [0, 540], transition: { duration: 0.9, ease: "linear" } } }}>
            <circle r="4" {...STROKE} />
            <path d="M-3.4 -1.2 Q0 -3 3.4 -1.2 M-3.4 1.2 Q0 3 3.4 1.2" {...STROKE} strokeWidth={1} />
          </motion.g>
        </motion.g>
      </g>
    </>
  );
}

function Goal() {
  return (
    <>
      {GROUND}
      <path d="M44 44 V18 H62 V44" {...STROKE} />
      <motion.g
        style={{ originX: "62px" }}
        variants={{ play: { scaleX: [1, 1, 1.14, 0.96, 1], transition: { duration: 1.5, times: [0, 0.6, 0.72, 0.86, 1] } } }}
      >
        <path d="M44 25 H62 M44 32 H62 M44 39 H62 M50 18 V44 M56 18 V44" {...STROKE} strokeWidth={0.9} strokeOpacity={0.55} />
      </motion.g>
      <g transform="translate(8 38)">
        <motion.g variants={{ play: { x: [0, 28, 46], y: [0, -20, -6], transition: { duration: 1.5, ease: "easeOut" } } }}>
          <motion.g variants={{ play: { rotate: [0, 540], transition: { duration: 1.5, ease: "easeOut" } } }}>
            <FootballBall r={5} />
          </motion.g>
        </motion.g>
      </g>
    </>
  );
}

const MOTIFS: Record<Motif, () => React.JSX.Element> = {
  football: Football,
  basketball: Basketball,
  shuttle: Shuttle,
  tennis: Tennis,
  cricket: Cricket,
  goal: Goal,
};

/**
 * Small decorative sports scene drawn in the corner of a card. It plays once when the card scrolls into
 * view and again every time `active` turns true (card hover). Reduced motion keeps the resting pose.
 */
export function SportsMotif({ kind, active = false, className = "" }: { kind: Motif; active?: boolean; className?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // run 0 = resting pose. Each increment remounts the svg (key) so the "play" variant restarts from the start pose.
  const [run, setRun] = useState(0);
  const Scene = MOTIFS[kind];

  useEffect(() => {
    if (reduceMotion || !inView) return;
    setRun((current) => current + 1);
  }, [inView, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !active) return;
    setRun((current) => current + 1);
  }, [active, reduceMotion]);

  return (
    <motion.svg
      key={run}
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 64 48"
      animate={run > 0 ? "play" : undefined}
      className={`pointer-events-none absolute h-12 w-16 overflow-visible ${className || "right-4 top-4 text-[#B6FF3B]"}`}
    >
      <Scene />
    </motion.svg>
  );
}

export type Strike = { id: number; x: number; y: number; dx: number; dy: number };

/**
 * One cricket shot at a click point: the bat swings through, hits the ball and sends it flying off the card
 * with a small impact ring. Self-contained; the parent removes it after STRIKE_MS.
 */
export const STRIKE_MS = 1500;

export function CricketStrike({ x, y, dx, dy }: Omit<Strike, "id">) {
  return (
    <>
      <motion.span
        aria-hidden="true"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 1.7], opacity: [0.8, 0] }}
        transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
        className="absolute h-8 w-8 rounded-full border-2 border-current"
        style={{ left: x - 16, top: y - 16 }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ rotate: 95, opacity: 0 }}
        animate={{ rotate: [95, 0, -55], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.55, times: [0, 0.4, 1], ease: ["easeIn", "easeOut"], opacity: { duration: 0.55, times: [0, 0.1, 0.75, 1] } }}
        className="absolute"
        style={{ left: x - 24, top: y - 32, originX: "24px", originY: "4px" }}
      >
        <svg viewBox="0 0 48 56" className="h-14 w-12 overflow-visible">
          <rect x="22.5" y="1" width="3" height="15" rx="1.5" fill="currentColor" />
          <path d="M22.5 5 H25.5 M22.5 8 H25.5 M22.5 11 H25.5" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.8" />
          <path d="M18 16 H30 V45 Q30 52 24 52 Q18 52 18 45 Z" fill="currentColor" fillOpacity="0.92" />
          <path d="M24 18 V48" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </motion.div>
      <motion.svg
        aria-hidden="true"
        viewBox="-7 -7 14 14"
        initial={{ scale: 0.6, opacity: 1 }}
        animate={{ x: [0, 0, dx * 0.5, dx], y: [0, 0, -70, dy], scale: [0.6, 1, 1, 0.5], opacity: [1, 1, 1, 0], rotate: [0, 0, 360, 900] }}
        transition={{ duration: 1.3, delay: 0.05, times: [0, 0.15, 0.55, 1], ease: "easeOut" }}
        className="absolute h-3.5 w-3.5 overflow-visible"
        style={{ left: x - 7, top: y - 7 }}
      >
        <circle r="6" fill="currentColor" />
        <path d="M-5 -1.5 Q0 -4 5 -1.5 M-5 1.5 Q0 4 5 1.5" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="1" strokeLinecap="round" />
      </motion.svg>
    </>
  );
}

