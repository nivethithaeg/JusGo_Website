"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_EXPO } from "@/lib/motion";

const SEEN_KEY = "jusgo-intro-seen";
const TOTAL_MS = 1500;

/**
 * One half of the loader's full-screen backdrop: a sports collage, dulled (low opacity, desaturated, dark veil) with
 * a darker centre so the logo stands out. The image box is 8% taller than the screen and runs off the bottom edge,
 * which crops away the caption strip at the foot of the source picture. Both halves use an identical box, so they
 * line up into one picture and part together when the loader splits open.
 */
function BackdropHalf({ edge }: { edge: "top" | "bottom" }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/loader-bg.webp"
        alt=""
        className={`loader-bg absolute left-0 h-[108svh] w-screen max-w-none object-cover opacity-[0.3] saturate-[0.6] ${edge === "top" ? "top-0" : "-bottom-[8svh]"}`}
      />
      <div
        className={`absolute left-0 h-[100svh] w-screen ${edge === "top" ? "top-0" : "bottom-0"}`}
        style={{ background: "radial-gradient(ellipse at center, rgba(4,23,15,0.82) 0%, rgba(4,23,15,0.6) 42%, rgba(4,23,15,0.88) 100%)" }}
      />
    </>
  );
}

/**
 * First-visit intro: logo pops in, a ball bounces along a progress line,
 * then the screen splits top/bottom. Once per session, at most 1.6s.
 * Starts visible on the server so the page never flashes before it.
 */
export function IntroLoader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen || reduceMotion) {
      setVisible(false);
      return;
    }
    // Mark as seen only once it finishes, so a dev-mode effect re-run does not hide it early.
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setVisible(false);
    }, TOTAL_MS);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const panel = "fixed inset-x-0 z-[100] h-1/2 overflow-hidden bg-jg-950";
  const exit = (y: string) => ({ y, transition: { duration: 0.55, ease: EASE_EXPO } });

  return (
    <AnimatePresence>
      {visible ? (
        <div aria-hidden="true" className="intro-loader">
          <motion.div className={`${panel} top-0`} exit={exit("-100%")}>
            <BackdropHalf edge="top" />
          </motion.div>
          <motion.div className={`${panel} bottom-0`} exit={exit("100%")}>
            <BackdropHalf edge="bottom" />
          </motion.div>
          <motion.div
            className="fixed inset-0 z-[101] flex flex-col items-center justify-center gap-10"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {/* The animations below are CSS (see .loader-* in globals.css), not Framer Motion: CSS runs as soon as the
                page paints, so the logo is on screen even while the page's scripts are still downloading. */}
            <p className="loader-aakavi -mb-4 max-w-[88vw] text-center text-[11px] font-semibold uppercase leading-relaxed text-white/75 sm:text-xs">
              <span className="block">Aakavi Digital Ventures Private Limited</span>
              <span className="mt-1 block text-sm font-extrabold text-jg-lime sm:text-base" style={{ textShadow: "0 0 18px rgba(182,255,59,0.55)" }}>
                Presents
              </span>
            </p>
            <div className="relative">
              <svg aria-hidden="true" viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] overflow-visible">
                <rect
                  className="loader-outline"
                  x="0"
                  y="0"
                  width="100"
                  height="75"
                  rx="9"
                  pathLength="1"
                  fill="none"
                  stroke="#9BE22F"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/jusgo-logo.png"
                alt=""
                width={557}
                height={418}
                fetchPriority="high"
                className="loader-logo aspect-[4/3] w-24 max-w-[40vw] rounded-2xl bg-white object-contain p-1.5 shadow-[0_0_70px_14px_rgba(182,255,59,0.28)] sm:w-32"
              />
            </div>
            <div className="relative h-1 w-56 rounded-full bg-white/15">
              <div className="loader-fill absolute inset-0 origin-left rounded-full bg-jg-lime" />
              <span className="loader-ball absolute -top-3 left-0 block h-3.5 w-3.5 rounded-full bg-jg-lime shadow-[0_0_14px_rgba(155,226,47,0.8)]" />
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
