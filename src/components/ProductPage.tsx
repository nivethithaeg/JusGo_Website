"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChaosToOneStory } from "@/components/ChaosToOneStory";
import {
  ConnectionStory,
  ProductAudiences,
  ProductOverview,
} from "@/components/JusGoSite";
import { HeroImage } from "@/components/motion/HeroImage";
import { AmbientParticles } from "@/components/motion/Ambient";
import { HowItWorksTimeline } from "@/components/motion/Sections";
import { HeadlineReveal, HeroItem } from "@/components/motion/Hero";
import { ScrollProgress, SiteFooter, SiteNavbar } from "@/components/SiteChrome";
import { EASE as ease } from "@/lib/motion";
import { useHeroScroll } from "@/lib/useHeroScroll";

function ProductHero() {
  const reduceMotion = useReducedMotion();
  const { ref, textStyle, visualStyle } = useHeroScroll();
  return (
    <section ref={ref} className="hero-backdrop relative isolate overflow-hidden px-5 pb-16 pt-16 text-white sm:px-8 sm:pb-20 lg:px-12 lg:pt-20">
      <HeroImage src="/assets/product-bg.jpg" width={407} height={462} position="50% 28%" />
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-50" />
      <AmbientParticles />
      <motion.div
        animate={reduceMotion ? undefined : { scale: [0.9, 1.08, 0.9], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="lime-glow pointer-events-none absolute -right-36 top-0 h-[34rem] w-[34rem] rounded-full"
      />
      <div className="relative mx-auto grid max-w-[1160px] items-center gap-8 lg:grid-cols-[1fr_.8fr]">
        <motion.div style={textStyle} className="max-w-[680px]">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-jg-lime"
          >
            One platform. Both sides of the game.
          </motion.p>
          <HeadlineReveal
            lines={[{ text: "The connection between" }, { text: "venues and apps.", accent: true }]}
            className="mt-5 text-balance font-display text-5xl font-extrabold leading-[.98] tracking-[-0.07em] sm:text-6xl lg:text-7xl"
          />
          <HeroItem kind="subtitle">
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              JusGo gives venue owners a place to manage their rules and gives booking apps one consistent way to connect. Together, they keep availability, pricing, and bookings working in sync.
            </p>
          </HeroItem>
          <HeroItem kind="cta" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#venues" className="rounded-full bg-jg-lime px-5 py-3.5 text-center text-xs font-bold text-jg-950 transition-transform hover:-translate-y-0.5">See how it works <span className="ml-2" aria-hidden="true">↓</span></a>
            <a href="/contact" className="rounded-full border border-white/20 px-5 py-3.5 text-center text-xs font-semibold text-white transition-colors hover:bg-white/10">Talk to JusGo <span className="ml-2" aria-hidden="true">↗</span></a>
          </HeroItem>
        </motion.div>

        <motion.div style={visualStyle}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, x: 18 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease }}
          className="relative mx-auto w-full max-w-[430px]"
        >
          <div className="lime-glow absolute inset-[12%] rounded-full" />
          <div className="relative rounded-[26px] border border-white/10 bg-jg-950/45 p-5 backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
              <span>One connected platform</span><span className="text-jg-lime">JusGo</span>
            </div>
            <div className="relative mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center sm:p-4"
              >
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-jg-lime/15 text-base text-jg-lime">⌖</span>
                <p className="mt-3 text-[10px] font-bold text-white">Venue owners</p>
                <p className="mt-1 text-[8px] leading-4 text-white/45">Rules, slots, pricing</p>
              </motion.div>
              <motion.span
                animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="text-lg text-jg-lime"
                aria-hidden="true"
              >
                ⇄
              </motion.span>
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center sm:p-4"
              >
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-info-500/15 text-base text-info-500">⌘</span>
                <p className="mt-3 text-[10px] font-bold text-white">Booking apps</p>
                <p className="mt-1 text-[8px] leading-4 text-white/45">Discover, book, sync</p>
              </motion.div>
            </div>
            <div className="mt-5 rounded-xl border border-jg-lime/20 bg-jg-800/25 p-3 text-center">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-jg-lime">Connected through JusGo</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {["Availability", "Effective price", "Bookings"].map((item) => <span key={item} className="rounded-full bg-white/[0.06] px-2.5 py-1.5 text-[8px] text-white/60">{item}</span>)}
              </div>
            </div>
            <p className="mt-4 text-center text-[8px] text-white/35">Venue approval stays in control of every connection.</p>
          </div>
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function JusGoProductPage() {
  return (
    <>
      <ScrollProgress />
      <SiteNavbar currentPage="product" />
      <main className="pt-20">
        <ProductHero />
        <ProductOverview />
        <ChaosToOneStory />
        <ConnectionStory />
        <HowItWorksTimeline />
        <ProductAudiences />
      </main>
      <SiteFooter />
    </>
  );
}
