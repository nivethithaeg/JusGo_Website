"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

type Chip = { label: string; color: string; from: [number, number]; rotate: number; cell: [number, number] };

// Positions are % of the stage field (centre of the chip). Cells are [column, body row].
const CHIPS: Chip[] = [
  { label: "Phone call", color: "#A78BFA", from: [18, 20], rotate: -7, cell: [0, 1] },
  { label: "WhatsApp", color: "#25D366", from: [50, 11], rotate: 4, cell: [2, 0] },
  { label: "Walk-in", color: "#F472B6", from: [83, 22], rotate: 8, cell: [4, 0] },
  { label: "Excel sheet", color: "#2DD4BF", from: [26, 54], rotate: 5, cell: [1, 2] },
  { label: "Notebook", color: "#D6D3D1", from: [63, 47], rotate: -6, cell: [3, 1] },
  { label: "Booking app A", color: "#4F86E8", from: [17, 84], rotate: 6, cell: [5, 2] },
  { label: "Booking app B", color: "#E8A23C", from: [50, 85], rotate: -5, cell: [2, 3] },
  { label: "Partner app", color: "#FDE047", from: [83, 72], rotate: -8, cell: [6, 3] },
];

const WARNINGS = [
  { label: "Double booked: Sat 6 PM", at: [36, 33] },
  { label: "Price mismatch on PlayNow", at: [73, 60] },
  { label: "Missed WhatsApp request", at: [31, 70] },
] as const;

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const COLS = 7;
const BODY_ROWS = 4;
const GRID = { left: 5, top: 4, width: 90, height: 92 }; // % of the field

const PROBLEMS = ["Calls, chats and sheets, all separate", "Double bookings", "Prices that don't match"];
const BENEFITS = ["One live view of availability", "The same price everywhere", "Venue approval on every connection"];

// Scroll phases (0..1 of the pinned distance). 0.86–1 is the pause before the section unpins.
const FLY_START = 0.34;
const FLY_STEP = 0.035;
const FLY_LENGTH = 0.14;

const cellCentre = (col: number, row: number) => ({
  x: GRID.left + (GRID.width * (col + 0.5)) / COLS,
  y: GRID.top + (GRID.height * (row + 1.5)) / (BODY_ROWS + 1),
});

// cubic ease-in-out for the flight
const glide = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function FlyingChip({ chip, index, progress }: { chip: Chip; index: number; progress: MotionValue<number> }) {
  const start = FLY_START + index * FLY_STEP;
  const end = start + FLY_LENGTH;
  const target = cellCentre(...chip.cell);
  const t = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const x = useTransform(t, (v) => `${chip.from[0] + (target.x - chip.from[0]) * glide(v)}cqw`);
  const y = useTransform(t, (v) => {
    const g = glide(v);
    return `${chip.from[1] + (target.y - chip.from[1]) * g - 9 * Math.sin(Math.PI * g)}cqh`;
  });
  const scale = useTransform(t, [0, 0.7, 1], [1, 0.8, 0.18]);
  const opacity = useTransform(t, [0, 0.82, 1], [1, 1, 0]);
  const rotate = useTransform(t, [0, 1], [chip.rotate, 0]);

  return (
    <motion.div style={{ x, y }} className="absolute left-0 top-0">
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ scale, opacity, rotate }}>
          <span
            className="chip-jitter block whitespace-nowrap rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-jg-950 shadow-lg shadow-black/30 sm:px-3.5 sm:py-2 sm:text-xs"
            style={{ backgroundColor: chip.color, "--jd": `${2.6 + (index % 4) * 0.45}s`, "--jl": `${index * -0.37}s` } as React.CSSProperties}
          >
            {chip.label}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function WarningTag({ label, at, index, progress }: { label: string; at: readonly [number, number]; index: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0.1 + index * 0.02, 0.26 + index * 0.02], [1, 0]);
  const opacity = useTransform(progress, [0.1 + index * 0.02, 0.24 + index * 0.02], [1, 0]);
  return (
    <div className="absolute left-0 top-0" style={{ transform: `translate(${at[0]}cqw, ${at[1]}cqh)` }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ scale, opacity }}>
          <span
            className="warn-shake flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-400/60 bg-red-500/20 px-2 py-1 text-[9px] font-bold text-red-200 sm:px-2.5 sm:text-[11px]"
            style={{ "--jl": `${index * -0.21}s` } as React.CSSProperties}
          >
            <span aria-hidden="true">⚠</span>
            {label}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

const slotClass = "relative h-full w-full rounded-md border border-white/10 bg-white/[0.04] sm:rounded-lg";

/** Chip target: the cell fills with the chip colour and pops when its chip lands. */
function FilledSlot({ color, landsAt, progress }: { color: string; landsAt: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [landsAt - 0.01, landsAt + 0.015, landsAt + 0.045], [0.6, 1.12, 1]);
  const opacity = useTransform(progress, [landsAt - 0.01, landsAt + 0.005], [0, 1]);
  return (
    <div className="p-[2px] sm:p-[3px]">
      <div className={slotClass}>
        <motion.span style={{ scale, opacity, backgroundColor: color }} className="absolute inset-0 rounded-md sm:rounded-lg" />
      </div>
    </div>
  );
}

export function ChaosToOneStory() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const finished = useMotionValue(1);
  // Reduced motion: every transform below resolves to the final state and the section is not pinned.
  const progress = reduceMotion ? finished : scrollYProgress;

  const jitter = useTransform(progress, [0.05, 0.32], [1, 0]);
  const gridOpacity = useTransform(progress, [0.2, 0.34], [0, 1]);
  const gridRotate = useTransform(progress, [0.2, 0.36], [25, 0]);
  const gridScale = useTransform(progress, [0.2, 0.36], [0.8, 1]);
  const glow = useTransform(progress, [0.78, 0.86], [0, 1]);

  const oldY = useTransform(progress, [0.7, 0.8], ["0%", "-115%"]);
  const oldOpacity = useTransform(progress, [0.7, 0.78], [1, 0]);
  const newY = useTransform(progress, [0.7, 0.8], ["115%", "0%"]);
  const newOpacity = useTransform(progress, [0.7, 0.78], [0, 1]);
  const problemsOpacity = useTransform(progress, [0.7, 0.78], [1, 0]);
  const benefitsOpacity = useTransform(progress, [0.74, 0.82], [0, 1]);

  const fieldStyle = { "--j": jitter } as unknown as MotionStyle;

  return (
    <section
      ref={ref}
      id="story"
      aria-label="From scattered bookings to one source of truth"
      className="relative h-[180vh] bg-jg-950 text-white md:h-[260vh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-5 pb-8 pt-24 sm:px-8 sm:pt-28 lg:px-12 motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="section-glow pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* Real text for assistive tech; everything below is the visual. */}
        <div className="sr-only">
          <h2>Booking is scattered. One source of truth.</h2>
          <ul>{BENEFITS.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>

        <div aria-hidden="true" className="relative mx-auto flex w-full max-w-[1000px] flex-1 flex-col justify-center gap-4 sm:gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jg-lime">From chaos to clarity</p>
            <div className="mt-3 grid overflow-hidden py-1 font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-5xl lg:text-6xl [&>*]:[grid-area:1/1]">
              <motion.p style={{ y: oldY, opacity: oldOpacity }}>Booking is scattered.</motion.p>
              <motion.p style={{ y: newY, opacity: newOpacity }} className="text-jg-lime">One source of truth.</motion.p>
            </div>
          </div>

          <motion.div style={fieldStyle} className="relative h-[clamp(230px,40svh,420px)] w-full [container-type:size]">
            {/* Weekly slot grid */}
            <motion.div
              style={{
                opacity: gridOpacity,
                rotateX: gridRotate,
                scale: gridScale,
                transformPerspective: 1000,
                left: `${GRID.left}%`,
                top: `${GRID.top}%`,
                width: `${GRID.width}%`,
                height: `${GRID.height}%`,
              }}
              className="absolute"
            >
              <motion.div style={{ opacity: glow }} className="absolute -inset-2 rounded-2xl border border-jg-lime/50 shadow-lime" />
              <div className="relative grid h-full grid-cols-7 grid-rows-5">
                {DAYS.map((day, i) => (
                  <span key={i} className="grid place-items-center text-[9px] font-bold text-white/40 sm:text-[10px]">{day}</span>
                ))}
                {Array.from({ length: COLS * BODY_ROWS }, (_, i) => {
                  const col = i % COLS;
                  const row = Math.floor(i / COLS);
                  const chipIndex = CHIPS.findIndex((chip) => chip.cell[0] === col && chip.cell[1] === row);
                  return chipIndex === -1 ? (
                    <div key={i} className="p-[2px] sm:p-[3px]"><div className={slotClass} /></div>
                  ) : (
                    <FilledSlot
                      key={i}
                      progress={progress}
                      color={CHIPS[chipIndex].color}
                      landsAt={FLY_START + chipIndex * FLY_STEP + FLY_LENGTH}
                    />
                  );
                })}
              </div>
            </motion.div>

            {WARNINGS.map((warning, index) => (
              <WarningTag key={warning.label} index={index} progress={progress} {...warning} />
            ))}
            {CHIPS.map((chip, index) => (
              <FlyingChip key={chip.label} chip={chip} index={index} progress={progress} />
            ))}
          </motion.div>

          <div className="grid text-xs font-semibold sm:text-sm [&>*]:[grid-area:1/1]">
            <motion.ul style={{ opacity: problemsOpacity }} className="flex flex-col gap-1.5 text-white/60 sm:flex-row sm:gap-6">
              {PROBLEMS.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-red-400">✕</span>{item}</li>
              ))}
            </motion.ul>
            <motion.ul style={{ opacity: benefitsOpacity }} className="flex flex-col gap-1.5 text-white/85 sm:flex-row sm:gap-6">
              {BENEFITS.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-jg-lime">✓</span>{item}</li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
