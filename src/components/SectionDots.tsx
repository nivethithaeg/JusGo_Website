"use client";

import { useEffect, useState } from "react";

export type SectionDot = { id: string; label: string };

/** Side dot indicator: highlights the section in view; clicking a dot jumps there (Lenis handles the scroll). */
export function SectionDots({ sections }: { sections: SectionDot[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current = sections[0]?.id ?? "";
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <nav aria-label="Page sections" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      {sections.map(({ id, label }) => {
        const isActive = id === active;
        return (
          <a key={id} href={`#${id}`} aria-label={label} aria-current={isActive ? "true" : undefined} className="group relative flex h-4 w-4 items-center justify-center">
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-3 w-3 bg-jg-lime shadow-[0_0_10px_rgba(155,226,47,0.8)]"
                  : "h-1.5 w-1.5 bg-white/45 ring-1 ring-jg-950/30 group-hover:bg-jg-lime"
              }`}
            />
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full bg-jg-950/90 px-3 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
