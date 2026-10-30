"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Magnetic } from "@/components/motion/Interactions";
import { HeadlineReveal, HeroItem } from "@/components/motion/Hero";

/** "Out of bounds" 404 hero: a ball bounces over a pitch line while the page explains the miss. */
export function NotFoundContent() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="hero-backdrop relative isolate flex min-h-[78svh] items-center overflow-hidden px-5 py-24 text-center text-white sm:px-8">
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-2xl">
        <div className="relative mx-auto mb-10 h-28 w-40" aria-hidden="true">
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, -78, 0], scaleY: [0.78, 1.1, 0.78], scaleX: [1.25, 0.92, 1.25] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: ["easeOut", "easeIn"] }}
            style={{ originY: 1 }}
            className="absolute bottom-3 left-1/2 -ml-4 block h-8 w-8 rounded-full bg-jg-lime shadow-[0_0_24px_rgba(155,226,47,0.7)]"
          />
          <motion.span
            animate={reduceMotion ? undefined : { scaleX: [1, 0.55, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: ["easeOut", "easeIn"] }}
            className="absolute bottom-1 left-1/2 -ml-8 block h-1.5 w-16 rounded-full bg-black/50"
          />
          <span className="absolute inset-x-0 bottom-0 h-px bg-white/25" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jg-lime">Error 404</p>
        <HeadlineReveal
          lines={[{ text: "Out of bounds." }, { text: "That page isn't on the field.", accent: true }]}
          className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1] tracking-[-0.06em] sm:text-6xl"
        />
        <HeroItem kind="subtitle">
          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/70 sm:text-base">
            The link may be old or mistyped. Let&apos;s get you back into play.
          </p>
        </HeroItem>
        <HeroItem kind="cta" className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Magnetic>
            <a href="/" className="inline-flex rounded-full bg-jg-lime px-6 py-3.5 text-xs font-bold text-jg-950">
              Back to home <span className="ml-2" aria-hidden="true">→</span>
            </a>
          </Magnetic>
          <a href="/contact" className="inline-flex rounded-full border border-white/20 px-6 py-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/10">
            Contact us
          </a>
        </HeroItem>
      </div>
    </section>
  );
}
