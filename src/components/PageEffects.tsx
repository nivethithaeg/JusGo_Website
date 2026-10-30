"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";

const PRIMARY_BUTTON = "a.bg-jg-lime, button.bg-jg-lime";
const GLOW_MS = 1600;

/**
 * Two small page-wide effects:
 * - a ripple that spreads from the click point inside primary (lime) buttons;
 * - a brief lime glow on the section a same-page jump link lands on.
 */
export function PageEffects() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    let glowTimer: number | undefined;
    let glowing: Element | null = null;

    const glow = (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      glowing?.classList.remove("anchor-glow");
      window.clearTimeout(glowTimer);
      // Reading offsetWidth forces a reflow so the animation restarts if the same target is hit twice.
      void (target as HTMLElement).offsetWidth;
      target.classList.add("anchor-glow");
      glowing = target;
      glowTimer = window.setTimeout(() => target.classList.remove("anchor-glow"), GLOW_MS);
    };

    const onPointerDown = (event: PointerEvent) => {
      const button = (event.target as Element | null)?.closest?.(PRIMARY_BUTTON) as HTMLElement | null;
      if (!button || event.button !== 0) return;
      const box = button.getBoundingClientRect();
      const size = Math.max(box.width, box.height) * 2.2;
      const ripple = document.createElement("span");
      ripple.className = "click-ripple";
      ripple.setAttribute("aria-hidden", "true");
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - box.left - size / 2}px;top:${event.clientY - box.top - size / 2}px`;
      button.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 700);
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      window.setTimeout(() => glow(decodeURIComponent(url.hash.slice(1))), 650);
    };

    // Arrived from another page with a #section in the URL.
    const arrival = window.location.hash
      ? window.setTimeout(() => glow(decodeURIComponent(window.location.hash.slice(1))), 1100)
      : undefined;

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
      window.clearTimeout(glowTimer);
      window.clearTimeout(arrival);
    };
  }, [reduceMotion]);

  return null;
}
