"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const LEAVE_MS = 260;

/**
 * Fade + lift between pages. Internal links are plain <a> (full page loads), so a click is intercepted:
 * <main> fades out and drifts up (CSS, see .page-leaving in globals.css), then the browser navigates.
 * The next page plays the matching entrance through the page-in keyframes on <main>.
 */
export function PageTransition() {
  const reduceMotion = useReducedMotion();
  const busy = useRef(false);

  useEffect(() => {
    // Back/forward cache can restore a page that was left faded out.
    const onShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      busy.current = false;
      document.documentElement.classList.remove("page-leaving");
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      if (busy.current) return;
      busy.current = true;
      document.documentElement.classList.add("page-leaving");
      window.setTimeout(() => window.location.assign(url.href), LEAVE_MS);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduceMotion]);

  return null;
}
