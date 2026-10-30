"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useRef, type PointerEvent } from "react";

/**
 * Pointer tilt + light spot. Writes CSS vars straight onto the element (no re-render):
 *   --rx / --ry  tilt in degrees
 *   --mx / --my  pointer position in %
 *   --tx / --ty  pointer offset from the centre, -1..1 (unitless, for parallax layers)
 *   --glow       0 | 1, drives the `.tilt-glow` layer
 * Consume them with the `.tilt` / `.tilt-glow` classes in globals.css.
 * Mouse only; touch, pen and reduced-motion users get no effect.
 *
 * Put the returned handlers on a wrapper that is not itself tilted, so the
 * measured bounds stay stable, and put `.tilt` on a child.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max: number) {
  const ref = useRef<T>(null);
  const reduceMotion = useReducedMotion();

  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      const el = ref.current;
      if (!el || reduceMotion || event.pointerType !== "mouse") return;
      const bounds = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      const py = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
      el.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--tx", ((px - 0.5) * 2).toFixed(3));
      el.style.setProperty("--ty", ((py - 0.5) * 2).toFixed(3));
      el.style.setProperty("--glow", "1");
    },
    [max, reduceMotion],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tx", "0");
    el.style.setProperty("--ty", "0");
    el.style.setProperty("--glow", "0");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
