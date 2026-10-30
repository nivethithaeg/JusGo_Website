"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Dimmed sports photo behind a hero. It is blended in "luminosity" mode over the green backdrop so it takes on
 * the site's colour, kept at low opacity so headlines stay readable, and it moves two ways: a slow
 * pan-and-zoom loop, and a parallax drift as the page scrolls. Reduced motion shows it still.
 */
export function HeroImage({ src = "/assets/hero-bg.jpg", width = 612, height = 408, position = "72% 78%" }: { src?: string; width?: number; height?: number; position?: string }) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Depth: the photo lags the page (moves down), pitch lines keep pace, the light orb runs ahead.
  const photoY = useTransform(scrollY, [0, 700], [0, 190]);
  const linesY = useTransform(scrollY, [0, 700], [0, -120]);
  const orbY = useTransform(scrollY, [0, 700], [0, -280]);

  return (
    <div aria-hidden="true" className="hero-photo pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={reduceMotion ? undefined : { y: photoY }} className="absolute -inset-x-[2%] -inset-y-[22%]">
        <motion.img
          src={src}
          alt=""
          width={width}
          height={height}
          loading="eager"
          decoding="async"
          animate={reduceMotion ? undefined : { scale: [1.02, 1.1, 1.02], x: ["-1.5%", "1.5%", "-1.5%"], y: ["0%", "-1.5%", "0%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full object-cover opacity-[0.42] mix-blend-luminosity"
          style={{ objectPosition: position, scale: 1.02 }}
        />
      </motion.div>
      <motion.div style={reduceMotion ? undefined : { y: linesY }} className="absolute -bottom-[10%] right-[-6%] h-[70%] w-[62%]">
        <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="h-full w-full text-[#B6FF3B] opacity-[0.1]" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="20" y="20" width="360" height="220" rx="4" />
          <path d="M200 20V240" />
          <circle cx="200" cy="130" r="38" />
          <rect x="20" y="75" width="62" height="110" />
          <rect x="318" y="75" width="62" height="110" />
        </svg>
      </motion.div>
      <motion.div style={reduceMotion ? undefined : { y: orbY }} className="absolute right-[12%] top-[34%] h-40 w-40 rounded-full bg-[#B6FF3B]/20 blur-3xl" />
      {/* keeps the left (headline) side and the bottom edge darker so text stays crisp */}
      <div className="absolute inset-0 bg-gradient-to-r from-jg-950/75 via-jg-950/35 to-jg-950/10" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-jg-950/70 to-transparent" />
    </div>
  );
}
