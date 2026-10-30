"use client";

import { useEffect } from "react";
import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

type ScrollTarget = string | number | HTMLElement;

const SmoothScrollContext = createContext<((target: ScrollTarget) => void) | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true });
    lenisRef.current = lenis;
    let frame = 0;
    const animate = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduceMotion]);

  const scrollTo = useCallback((target: ScrollTarget) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target);
      return;
    }

    let top: number | undefined;
    if (typeof target === "number") {
      top = target;
    } else {
      const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (element) top = element.getBoundingClientRect().top + window.scrollY;
    }
    if (top !== undefined) window.scrollTo({ top, behavior: "auto" });
  }, []);

  return <SmoothScrollContext.Provider value={scrollTo}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll() {
  const scrollTo = useContext(SmoothScrollContext);
  if (!scrollTo) throw new Error("useSmoothScroll must be used within a SmoothScrollProvider");
  return scrollTo;
}
