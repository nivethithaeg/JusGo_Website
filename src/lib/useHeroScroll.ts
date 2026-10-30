"use client";

import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Hero scroll-out. The text column rises to y:-22% and fades to 0 while the
 * visual layer drifts more slowly, so the two layers separate.
 * Attach `ref` to the hero <section>, spread `textStyle` / `visualStyle` on motion elements.
 */
export function useHeroScroll() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);

  return {
    ref,
    textStyle: reduceMotion ? undefined : { y: textY, opacity: textOpacity },
    visualStyle: reduceMotion ? undefined : { y: visualY },
  };
}
