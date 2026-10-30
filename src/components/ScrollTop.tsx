"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useState } from "react";

const SHOW_AFTER = 600;

/** Back-to-top button whose ring fills with page scroll progress. Appears once you have scrolled a bit. */
export function ScrollTop() {
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setVisible(value > SHOW_AFTER));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Back to top"
          data-cursor="Top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          whileHover={reduceMotion ? undefined : { y: -3 }}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-jg-950/90 text-jg-lime shadow-xl backdrop-blur-md"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="24" cy="24" r="22" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="2" />
            <motion.circle cx="24" cy="24" r="22" fill="none" stroke="#9BE22F" strokeWidth="2" strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
          </svg>
          <span aria-hidden="true" className="relative text-lg leading-none">↑</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
