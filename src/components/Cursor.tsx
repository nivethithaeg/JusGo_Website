"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CursorMode = { kind: "idle" | "link" | "label"; label: string };

const RING = 44;
const RING_SCALE = { idle: 1, link: 64 / RING, label: 86 / RING } as const;
const LERP = 0.18;
const INTERACTIVE = "[data-cursor], a, button, [role='button']";

/**
 * Lime dot that tracks the pointer exactly plus a ring that trails it.
 * Fine pointers only; the system cursor stays visible.
 */
export function Cursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>({ kind: "idle", label: "" });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) {
      setEnabled(false);
      return;
    }
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let seen = false;
    let frame = 0;

    const draw = () => {
      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      const settled = Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1;
      frame = settled ? 0 : requestAnimationFrame(draw);
    };

    const show = (visible: boolean) => {
      const opacity = visible ? "1" : "0";
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (!seen) {
        seen = true;
        current.x = target.x;
        current.y = target.y;
        show(true);
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const hit = event.target.closest<HTMLElement>(INTERACTIVE);
      const label = hit?.dataset.cursor;
      setMode((prev) => {
        const next: CursorMode = label
          ? { kind: "label", label }
          : hit
            ? { kind: "link", label: "" }
            : { kind: "idle", label: "" };
        return prev.kind === next.kind && prev.label === next.label ? prev : next;
      });
    };

    const onLeave = () => show(false);
    const onEnter = () => seen && show(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  const labelled = mode.kind === "label";
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        style={{ opacity: 0, width: RING, height: RING, marginLeft: -RING / 2, marginTop: -RING / 2 }}
        className="absolute left-0 top-0 transition-opacity duration-200"
      >
        <motion.div
          animate={{ scale: RING_SCALE[mode.kind] }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="absolute inset-0 rounded-full border-[1.5px] border-jg-lime shadow-[0_0_0_1px_rgba(4,23,15,0.3)]"
        />
        <motion.div
          animate={{ scale: RING_SCALE[mode.kind], opacity: labelled ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="absolute inset-0 rounded-full bg-jg-lime"
        />
        <span
          className={`absolute inset-0 grid place-items-center text-[10px] font-extrabold uppercase tracking-[0.14em] text-jg-950 transition-opacity duration-200 ${labelled ? "opacity-100" : "opacity-0"}`}
        >
          {mode.label}
        </span>
      </div>
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="absolute left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-jg-lime shadow-[0_0_0_1px_rgba(4,23,15,0.45)] transition-opacity duration-200"
      />
    </div>
  );
}
