"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE_EXPO } from "@/lib/motion";

/* Pitch in perspective: stripe edges at six depths (far to near) and the pitch's left/right edge at each. */
const STRIPES = [
  { y: 262, l: 190, r: 610 },
  { y: 274.3, l: 179, r: 621 },
  { y: 301.9, l: 154.7, r: 645.3 },
  { y: 341.4, l: 119.5, r: 680.5 },
  { y: 391.5, l: 74.8, r: 725.2 },
  { y: 451.2, l: 21.5, r: 778.5 },
  { y: 520, l: -40, r: 840 },
];

const TOWERS = [
  { x: 70, top: 112, aim: 330, depth: 1 },
  { x: 730, top: 112, aim: 470, depth: 1 },
  { x: 245, top: 142, aim: 385, depth: 0.7 },
  { x: 555, top: 142, aim: 415, depth: 0.7 },
];

/** A night-match football stadium drawn as SVG: stands full of lit crowd, floodlight towers with beams, a striped pitch. */
export function StadiumArt() {
  const reduceMotion = useReducedMotion();
  return (
    <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label="Illustration of a football stadium at night under floodlights">
      <defs>
        <linearGradient id="stad-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#030a14" />
          <stop offset="0.55" stopColor="#0a2233" />
          <stop offset="1" stopColor="#0d4a36" />
        </linearGradient>
        <linearGradient id="stad-pitch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a3d2a" />
          <stop offset="1" stopColor="#05241a" />
        </linearGradient>
        <linearGradient id="stad-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ffd6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#B6FF3B" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="stad-glow">
          <stop offset="0" stopColor="#f4ffd6" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#B6FF3B" stopOpacity="0.4" />
          <stop offset="1" stopColor="#B6FF3B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="stad-haze" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#B6FF3B" stopOpacity="0.32" />
          <stop offset="1" stopColor="#B6FF3B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="stad-vignette" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#030a14" stopOpacity="0" />
          <stop offset="1" stopColor="#030a14" stopOpacity="0.75" />
        </radialGradient>
        <pattern id="stad-crowd" width="7" height="6" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#B6FF3B" opacity="0.5" />
          <circle cx="5.5" cy="4.5" r="0.9" fill="#ffffff" opacity="0.45" />
        </pattern>
        <clipPath id="stad-bowl">
          <path d="M0 250 L0 176 Q130 122 270 152 L530 152 Q670 122 800 176 L800 250 Z" />
        </clipPath>
      </defs>

      <rect width="800" height="520" fill="url(#stad-sky)" />
      {[
        [120, 40], [260, 70], [410, 30], [560, 60], [690, 28], [40, 96], [610, 100], [330, 100],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="#fff" opacity="0.55" />
      ))}
      <ellipse cx="400" cy="262" rx="420" ry="90" fill="url(#stad-haze)" />

      {/* stands */}
      <path d="M0 250 L0 176 Q130 122 270 152 L530 152 Q670 122 800 176 L800 250 Z" fill="#07182a" />
      <rect x="0" y="120" width="800" height="135" fill="url(#stad-crowd)" clipPath="url(#stad-bowl)" opacity="0.85" />
      <path d="M0 176 Q130 122 270 152 L530 152 Q670 122 800 176" fill="none" stroke="#B6FF3B" strokeOpacity="0.28" strokeWidth="1.5" />
      <path d="M0 262 L0 236 L800 236 L800 262 Z" fill="#050f1d" />
      <line x1="0" x2="800" y1="257" y2="257" stroke="#B6FF3B" strokeOpacity="0.55" strokeWidth="4" strokeDasharray="26 10" />

      {/* floodlight towers and their beams */}
      {TOWERS.map((tower, i) => {
        const panelY = tower.top;
        const bottom = tower.top + 24;
        return (
          <g key={tower.x}>
            <motion.polygon
              points={`${tower.x - 16},${bottom} ${tower.x + 16},${bottom} ${tower.aim + 110},470 ${tower.aim - 110},470`}
              fill="url(#stad-beam)"
              style={{ mixBlendMode: "screen" }}
              animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 6, delay: i * 1.2, repeat: Infinity, ease: "easeInOut" }}
              opacity={0.8}
            />
            <rect x={tower.x - 2} y={bottom} width="4" height={250 - bottom} fill="#0a1a2c" />
            <rect x={tower.x - 20 * tower.depth} y={panelY} width={40 * tower.depth} height="24" rx="3" fill="#0b2036" stroke="#fff" strokeOpacity="0.14" />
            {[0, 1, 2].map((c) =>
              [0, 1].map((r) => (
                <circle key={`${c}-${r}`} cx={tower.x - 12 * tower.depth + c * 12 * tower.depth} cy={panelY + 7 + r * 10} r="2.2" fill="#fff" />
              )),
            )}
            <motion.circle
              cx={tower.x}
              cy={panelY + 12}
              r={30 * tower.depth}
              fill="url(#stad-glow)"
              animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 6, delay: i * 1.2, repeat: Infinity, ease: "easeInOut" }}
              opacity={0.85}
            />
          </g>
        );
      })}

      {/* pitch */}
      <polygon points="-40,520 840,520 610,262 190,262" fill="url(#stad-pitch)" />
      {STRIPES.slice(0, -1).map((s, k) => {
        const n = STRIPES[k + 1];
        return (
          <polygon
            key={k}
            points={`${s.l},${s.y} ${s.r},${s.y} ${n.r},${n.y} ${n.l},${n.y}`}
            fill={k % 2 === 0 ? "#12683f" : "#0a3d2a"}
            opacity={k % 2 === 0 ? 0.5 : 0.25}
          />
        );
      })}
      <g fill="none" stroke="#B6FF3B" strokeOpacity="0.4" strokeWidth="2">
        <line x1="109.7" y1="352" x2="690.3" y2="352" />
        <ellipse cx="400" cy="352" rx="95" ry="22" />
        <path d="M300 262 L285 292 L515 292 L500 262" />
        <rect x="360" y="256" width="80" height="6" />
      </g>
      <circle cx="400" cy="352" r="2.5" fill="#B6FF3B" opacity="0.7" />

      <rect width="800" height="520" fill="url(#stad-vignette)" />
    </svg>
  );
}

/**
 * Cinematic stadium frame: the image wipes open from the left as it scrolls into view, then slowly zooms in and out
 * while drifting against the page scroll (parallax). Reduced motion shows it still.
 *
 * The in-view trigger sits on the outer, never-clipped wrapper: a fully clipped element can't report that it has
 * scrolled into view, so the clip itself is animated by the wrapper's variants.
 */
export function StadiumImage({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [-34, 34]);

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0 round 28px)" },
          shown: { clipPath: "inset(0 0% 0 0 round 28px)" },
        }}
        transition={{ duration: 1.4, ease: EASE_EXPO }}
        className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#071426] shadow-[0_30px_70px_-30px_rgba(7,20,38,0.7)]"
      >
        <motion.div style={reduceMotion ? undefined : { y: drift }} className="absolute -inset-y-[10%] inset-x-0">
          <motion.div
            variants={{ hidden: { scale: 1.3 }, shown: { scale: 1.08 } }}
            transition={{ duration: 1.8, ease: EASE_EXPO }}
            className="h-full w-full"
          >
            <motion.div
              animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
              transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full"
            >
              <StadiumArt />
            </motion.div>
          </motion.div>
        </motion.div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071426]/60 via-transparent to-transparent" />
      </motion.div>
    </motion.div>
  );
}
