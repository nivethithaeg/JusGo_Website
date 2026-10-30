"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { SPRING } from "@/lib/motion";

type Booking = { id: number; venue: string; time: string; via: string };

const MAX_FEED = 4;
const INITIAL_FREE: Record<string, number> = { "Rally Sports Arena": 6, "Greenline Turf": 5 };

// Sample data only: nothing here is a real booking.
const SAMPLE_BOOKINGS: Omit<Booking, "id">[] = [
  { venue: "Greenline Turf", time: "7:30 PM", via: "PlayNow" },
  { venue: "Rally Sports Arena", time: "6:00 PM", via: "CourtClub" },
  { venue: "Greenline Turf", time: "8:30 PM", via: "CourtClub" },
  { venue: "Rally Sports Arena", time: "7:00 PM", via: "PlayNow" },
  { venue: "Greenline Turf", time: "9:00 PM", via: "PlayNow" },
];

const SEED_FEED: Booking[] = [
  { id: -1, ...SAMPLE_BOOKINGS[3] },
  { id: -2, ...SAMPLE_BOOKINGS[4] },
];

/**
 * Sample booking stream: a new booking every 3–4 seconds while `target` is on screen.
 * `ticks[venue]` bumps on every booking so rows can key a flash / "−1" animation off it.
 */
export function useLiveActivity(target: RefObject<Element | null>) {
  const reduceMotion = useReducedMotion();
  const onScreen = useInView(target, { amount: 0.2 });
  const [feed, setFeed] = useState<Booking[]>(SEED_FEED);
  const [free, setFree] = useState(INITIAL_FREE);
  const [ticks, setTicks] = useState<Record<string, number>>({});

  useEffect(() => {
    if (reduceMotion || !onScreen) return;
    let timer = 0;
    let cursor = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!document.hidden) {
          const sample = SAMPLE_BOOKINGS[cursor % SAMPLE_BOOKINGS.length];
          const id = Date.now() + cursor;
          cursor += 1;
          setFeed((prev) => [{ id, ...sample }, ...prev].slice(0, MAX_FEED));
          setFree((prev) => ({
            ...prev,
            [sample.venue]: prev[sample.venue] > 1 ? prev[sample.venue] - 1 : INITIAL_FREE[sample.venue],
          }));
          setTicks((prev) => ({ ...prev, [sample.venue]: (prev[sample.venue] ?? 0) + 1 }));
        }
        schedule();
      }, 3000 + Math.random() * 1000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [onScreen, reduceMotion]);

  return { feed, free, ticks };
}

/** Number that flips in (rotateX -90 → 0) whenever its value changes. */
export function FlipNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <span className="inline-grid [&>*]:[grid-area:1/1]" style={{ perspective: 200 }}>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          initial={reduceMotion ? false : { rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0, transition: { duration: 0.15 } }}
          transition={SPRING.flip}
          className="text-right"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Lime flash across a venue row plus a red "−1" that floats up. Re-triggers when `tick` changes. */
export function VenueFlash({ tick }: { tick: number }) {
  const reduceMotion = useReducedMotion();
  if (!tick || reduceMotion) return null;
  return (
    <>
      <motion.span
        key={`flash-${tick}`}
        aria-hidden="true"
        initial={{ opacity: 0.45 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 rounded-xl bg-jg-lime/30"
      />
      <motion.span
        key={`minus-${tick}`}
        aria-hidden="true"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -26 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="pointer-events-none absolute bottom-2 right-3 text-[11px] font-extrabold text-red-400"
      >
        −1
      </motion.span>
    </>
  );
}

export function ActivityFeed({ feed }: { feed: Booking[] }) {
  return (
    <div className="mt-3 border-t border-white/[0.08] pt-3">
      <div className="flex items-center justify-between">
        <p className="text-[9px] text-white/45">Live activity</p>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/45">Sample data</span>
      </div>
      <ul className="relative mt-2.5 flex h-[8.75rem] list-none flex-col gap-1.5 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {feed.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING.feed}
              className="shrink-0 rounded-lg border border-white/[0.08] bg-jg-950/55 px-2.5 py-1.5 text-[8px] leading-4 text-white/70"
            >
              <span className="font-semibold text-white">{item.venue}</span> · {item.time} booked via {item.via} <span className="text-jg-lime">– blocked everywhere</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/**
 * Toast that slides in over the corner of the preview whenever the sample stream adds a booking
 * ("PlayNow synced"), with a tick that draws itself. Decorative sample data, hidden from screen readers.
 */
export function SyncToast({ latest }: { latest: Booking }) {
  const reduceMotion = useReducedMotion();
  const [shownId, setShownId] = useState<number | null>(null);

  useEffect(() => {
    if (reduceMotion || latest.id < 0) return;
    setShownId(latest.id);
    const timer = window.setTimeout(() => setShownId(null), 2600);
    return () => window.clearTimeout(timer);
  }, [latest.id, reduceMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute -top-4 right-2 z-30 sm:right-6">
      <AnimatePresence>
        {shownId !== null ? (
          <motion.div
            key={shownId}
            initial={{ opacity: 0, y: -14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={SPRING.feed}
            className="flex items-center gap-2 rounded-full border border-jg-lime/30 bg-jg-950/95 py-1.5 pl-2 pr-3.5 shadow-xl backdrop-blur-xl"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-jg-lime/15">
              <svg viewBox="0 0 20 20" className="h-3 w-3">
                <motion.path
                  d="M4 10.5 L8.5 15 L16 6"
                  fill="none"
                  stroke="#9BE22F"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
                />
              </svg>
            </span>
            <span className="text-[10px] font-semibold text-white">
              {latest.via} synced <span className="text-white/45">· {latest.venue}</span>
            </span>
            <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-white/40">Sample</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
