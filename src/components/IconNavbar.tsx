"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type MouseEvent, type ReactNode, useState } from "react";
import { Magnetic } from "@/components/motion/Interactions";

const logo = "/assets/jusgo-logo.png";
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

type Item = { label: string; short: string; aria: string; href: string; icon: ReactNode };

const ITEMS: Item[] = [
  {
    label: "Product",
    short: "Product",
    aria: "Product",
    href: "/product",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" />
        <path d="M4 7.5 12 12l8-4.5M12 12v9" />
      </svg>
    ),
  },
  {
    label: "Venues",
    short: "Venues",
    aria: "For venues",
    href: "/venues",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Developers",
    short: "Devs",
    aria: "For developers",
    href: "/developers",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
      </svg>
    ),
  },
  {
    label: "Team",
    short: "Team",
    aria: "Team",
    href: "/team",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6" />
        <path d="M16 5.2a3.2 3.2 0 0 1 0 6M18 14.4c1.8.8 3 2.6 3 5.6" />
      </svg>
    ),
  },
  {
    label: "Contact",
    short: "Contact",
    aria: "Contact",
    href: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.5 7 8.5 6.5L20.5 7" />
      </svg>
    ),
  },
];

type Page = "home" | "product" | "venues" | "developers" | "team" | "contact";

function pageIndex(page: Page): number | null {
  if (page === "product") return 0;
  if (page === "venues") return 1;
  if (page === "developers") return 2;
  if (page === "team") return 3;
  if (page === "contact") return 4;
  return null;
}

/**
 * Icon-over-label top bar, fixed to the viewport (it never hides or moves on scroll). The lime underline under
 * the active item slides between items as the selection changes.
 */
export function IconNavbar({ currentPage = "home" }: { currentPage?: Page }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(pageIndex(currentPage));

  const homeHref = currentPage === "home" ? "#home" : "/#home";

  const onItemClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    const url = new URL(ITEMS[index].href, window.location.href);
    // Same page (e.g. a #section link): the underline moves now. Other pages: the page change takes over.
    if (url.pathname === window.location.pathname) setActive(index);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-jg-950/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1240px] items-stretch gap-2 px-3 sm:h-[68px] sm:gap-4 sm:px-6">
        <p className="hidden w-[150px] shrink-0 self-center text-[8px] font-semibold uppercase leading-[1.35] tracking-[0.16em] text-white/55 lg:block">
          Aakavi Digital Ventures Private Limited
          <span className="block text-[10px] font-extrabold tracking-[0.22em] text-jg-lime">Presents</span>
          <span className="block text-[13px] font-extrabold normal-case leading-tight tracking-tight text-white">JusGo</span>
        </p>
        <a
          href={homeHref}
          aria-label="JusGo home"
          className="my-auto aspect-[4/3] w-[62px] shrink-0 rounded-xl border border-jg-lime/50 bg-white p-0.5 sm:w-[84px] sm:p-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="JusGo — Limitless Play. Limitless Connections." width={557} height={418} fetchPriority="high" className="block h-full w-full object-contain" />
        </a>

        <nav aria-label="Main navigation" className="flex flex-1 items-stretch justify-center sm:gap-1">
          {ITEMS.map((item, index) => {
            const isActive = active === index;
            return (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.aria}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => onItemClick(event, index)}
                className={`group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-[8.5px] font-bold uppercase tracking-[0.04em] transition-colors sm:max-w-[104px] sm:flex-none sm:px-4 sm:text-[10px] sm:tracking-[0.08em] ${
                  isActive ? "text-jg-lime" : "text-white/65 hover:text-white"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-6 w-6 place-items-center transition-transform duration-300 motion-reduce:transition-none sm:h-7 sm:w-7 ${
                    isActive ? "scale-110" : "group-hover:-translate-y-0.5 group-hover:scale-110"
                  } [&>svg]:h-full [&>svg]:w-full`}
                >
                  {item.icon}
                </span>
                <span aria-hidden="true" className="truncate">
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
                {isActive ? (
                  <motion.span
                    layoutId="topnav-underline"
                    aria-hidden="true"
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-x-1 bottom-0 h-[3px] rounded-t-full bg-jg-lime shadow-[0_0_12px_rgba(155,226,47,0.7)] sm:inset-x-3"
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="my-auto hidden shrink-0 lg:block">
          <Magnetic>
            <a
              href="/contact"
              data-cursor="Meet"
              className="inline-flex rounded-full bg-jg-lime px-5 py-2.5 text-xs font-bold text-jg-950 transition-transform hover:-translate-y-0.5"
            >
              Meet JusGo <span className="ml-2" aria-hidden="true">↗</span>
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
