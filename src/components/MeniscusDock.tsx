"use client";

import { useReducedMotion } from "framer-motion";
import { type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dockPath } from "@/lib/meniscus";
import { type RGB, hexToRgb, mixOklch, rgbCss, toneForContrast } from "@/lib/oklch";

/* ---- geometry (px, dock-local; the dock's top edge is y = 0) ---- */
const W = 340;
const H = 64;
const R = 16;
const BEAD = 44;
const RB = BEAD / 2 + 6; // bowl radius = bead radius + gap
const S = 14; // resting shoulder radius
const X0 = 58; // centre of the first tab (leaves room for the shoulder next to the rounded corner)
const STEP = 56;
const MAX_VELOCITY = 900; // px/s that counts as q = 1
const STIFFNESS = 260;
const DAMPING = 22;
const NAV_DELAY_MS = 430;
const PLATE_AT_LABEL: RGB = [6, 18, 13]; // the plate colour behind the label, used for the contrast solve
const LABEL_CONTRAST = 14.9; // target 14.7:1 with headroom for colour rounding

const center = (index: number) => X0 + index * STEP;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const SHAPE = { W, H, R, rb: RB, by: 0 };

type Tab = { label: string; aria: string; href: string; accent: string; icon: ReactNode };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const TABS: Tab[] = [
  {
    label: "Product",
    aria: "Product",
    href: "/product",
    accent: "#c9f24a",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" />
        <path d="M4 7.5 12 12l8-4.5M12 12v9" />
      </svg>
    ),
  },
  {
    label: "Venues",
    aria: "For venues",
    href: "/product#venues",
    accent: "#ffd23f",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Developers",
    aria: "For developers",
    href: "/product#developers",
    accent: "#ffa53a",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
      </svg>
    ),
  },
  {
    label: "Team",
    aria: "Team",
    href: "/team",
    accent: "#ff7a45",
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
    aria: "Contact",
    href: "/contact",
    accent: "#ff4d7d",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.5 7 8.5 6.5L20.5 7" />
      </svg>
    ),
  },
];

const ACCENTS: RGB[] = TABS.map((tab) => hexToRgb(tab.accent));
const LABEL_TONES: RGB[] = ACCENTS.map((rgb) => toneForContrast(rgb, PLATE_AT_LABEL, LABEL_CONTRAST));

function pageIndex(currentPage: "home" | "product" | "team" | "contact"): number | null {
  if (currentPage === "product") return 0;
  if (currentPage === "team") return 3;
  if (currentPage === "contact") return 4;
  return null;
}

/**
 * Bottom tab bar whose active tab is a floating bead: the dock's top edge melts around it (one tangent-solved
 * SVG path, rebuilt every frame from the bead's spring state). See src/lib/meniscus.ts for the geometry.
 */
export function MeniscusDock({ currentPage = "home" }: { currentPage?: "home" | "product" | "team" | "contact" }) {
  const reduceMotion = useReducedMotion();
  const initial = useMemo(() => pageIndex(currentPage), [currentPage]);
  const [active, setActive] = useState<number | null>(initial);

  const rootRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const beadIcons = useRef<(HTMLSpanElement | null)[]>([]);
  const tabIcons = useRef<(HTMLSpanElement | null)[]>([]);

  // Spring state lives in a ref: it changes every frame and must not re-render React.
  const sim = useRef({
    x: center(2),
    v: 0,
    target: center(2),
    p: 0, // bead presence 0..1 (the socket closes completely when there is no active tab)
    pv: 0,
    pTarget: 0,
    dragging: false,
    grab: 0,
    lastMoveAt: 0,
    nearest: -1,
    raf: 0,
    last: 0,
    reduce: false,
  });

  const render = useCallback(() => {
    const s = sim.current;
    const q = s.reduce ? 0 : clamp(s.v / MAX_VELOCITY, -1, 1);
    const mag = Math.abs(q);
    const p = Math.max(0, s.p);
    const shape = { ...SHAPE, rb: RB * p };

    // One path: flat edge -> shoulder -> bowl -> shoulder -> flat edge. Trailing shoulder draws out, leading tightens.
    pathRef.current?.setAttribute("d", dockPath(s.x, S * (1 + 0.06 * mag + 0.4 * q), S * (1 + 0.06 * mag - 0.4 * q), shape));

    const t = clamp((s.x - X0) / STEP, 0, TABS.length - 1);
    const i = Math.min(TABS.length - 2, Math.floor(t));
    const f = t - i;
    const color = mixOklch(ACCENTS[i], ACCENTS[i + 1], f);
    const labelColor = mixOklch(LABEL_TONES[i], LABEL_TONES[i + 1], f);

    const bead = beadRef.current;
    if (bead) {
      const sx = 1 + 0.08 * mag;
      const sy = 1 - 0.06 * mag;
      const grow = Math.min(1.1, p);
      bead.style.transform = `translate3d(${s.x - BEAD / 2}px, ${H - BEAD / 2}px, 0) scale(${sx * grow}, ${sy * grow})`;
      bead.style.opacity = String(Math.min(1, p * 1.6));
      bead.style.backgroundColor = rgbCss(color);
      bead.style.boxShadow = `0 6px 20px ${rgbCss(color, 0.45)}, inset 0 1.5px 0 rgba(255,255,255,0.4)`;
    }

    const nearest = Math.round(t);
    if (nearest !== s.nearest) {
      s.nearest = nearest;
      beadIcons.current.forEach((el, index) => el?.toggleAttribute("data-on", index === nearest));
      if (labelRef.current) labelRef.current.textContent = TABS[nearest].label;
    }

    const label = labelRef.current;
    if (label) {
      label.style.transform = `translate3d(${s.x}px, 0, 0) translateX(-50%)`;
      label.style.color = rgbCss(labelColor);
      label.style.opacity = String(clamp((p - 0.4) / 0.6, 0, 1));
    }

    // The tab icon under the bead is hidden; neighbours fade back in as the bead leaves.
    tabIcons.current.forEach((el, index) => {
      if (!el) return;
      const d = Math.abs(s.x - center(index));
      const away = clamp((d - 12) / 28, 0, 1);
      el.style.opacity = String(1 - (1 - away) * clamp(p * 1.4, 0, 1));
    });

    const glow = glowRef.current;
    if (glow) {
      glow.style.transform = `translate3d(${s.x}px, 0, 0) translateX(-50%)`;
      glow.style.background = `radial-gradient(closest-side, ${rgbCss(color, 0.55)}, transparent)`;
      glow.style.opacity = String(0.55 * clamp(p, 0, 1));
    }
    rootRef.current?.style.setProperty("--mn-acc", rgbCss(color));
  }, []);

  const frame = useCallback(
    (now: number) => {
      const s = sim.current;
      const dt = Math.min(0.032, Math.max(0.001, (now - s.last) / 1000 || 0.016));
      s.last = now;

      if (s.reduce) {
        if (!s.dragging) {
          s.x = s.target;
          s.v = 0;
        }
        s.p = s.pTarget;
        s.pv = 0;
      } else {
        const steps = Math.ceil(dt / 0.004);
        const h = dt / steps;
        for (let k = 0; k < steps; k += 1) {
          if (!s.dragging) {
            s.v += (-STIFFNESS * (s.x - s.target) - DAMPING * s.v) * h;
            s.x += s.v * h;
          }
          s.pv += (-STIFFNESS * (s.p - s.pTarget) - DAMPING * s.pv) * h;
          s.p += s.pv * h;
        }
        // While dragging, the pointer sets x; the lean fades back to zero when the pointer pauses.
        if (s.dragging) s.v *= Math.exp(-dt * 9);
      }

      render();

      const settled =
        !s.dragging && Math.abs(s.x - s.target) < 0.02 && Math.abs(s.v) < 0.4 && Math.abs(s.p - s.pTarget) < 0.002 && Math.abs(s.pv) < 0.02;
      if (settled) {
        s.x = s.target;
        s.v = 0;
        s.p = s.pTarget;
        s.pv = 0;
        render();
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(frame);
    },
    [render],
  );

  const kick = useCallback(() => {
    const s = sim.current;
    if (s.raf) return;
    s.last = performance.now();
    s.raf = requestAnimationFrame(frame);
  }, [frame]);

  // Mount: place the bead on the page's tab and pop it in; keep the dock scaled to narrow screens.
  useEffect(() => {
    const s = sim.current;
    s.reduce = Boolean(reduceMotion);
    if (initial !== null) {
      s.x = s.target = center(initial);
      s.pTarget = 1;
    }
    let hashed: number | null = null;
    if (currentPage === "product") {
      if (window.location.hash === "#venues") hashed = 1;
      if (window.location.hash === "#developers") hashed = 2;
    }
    if (hashed !== null) {
      s.x = s.target = center(hashed);
      setActive(hashed);
    }
    s.nearest = -1;
    render();
    const pop = window.setTimeout(kick, s.reduce ? 0 : 250);

    const fit = () => {
      const k = Math.min(1, (window.innerWidth - 16) / W);
      rootRef.current?.style.setProperty("--mn-k", String(k));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => {
      window.clearTimeout(pop);
      window.removeEventListener("resize", fit);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [currentPage, initial, kick, reduceMotion, render]);

  const nearestIndex = (x: number) => clamp(Math.round((x - X0) / STEP), 0, TABS.length - 1);

  const activate = useCallback(
    (index: number, options: { navigate?: boolean } = {}) => {
      const s = sim.current;
      setActive(index);
      s.target = center(index);
      if (s.pTarget === 0) {
        s.x = center(index); // nothing to travel from: the bead simply forms in place
        s.v = 0;
        s.pTarget = 1;
      }
      kick();

      const url = new URL(TABS[index].href, window.location.href);
      if (options.navigate && url.pathname !== window.location.pathname) {
        document.documentElement.classList.add("page-leaving");
        window.setTimeout(() => window.location.assign(url.href), s.reduce ? 0 : NAV_DELAY_MS);
      }
    },
    [kick],
  );

  const onTabClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const url = new URL(TABS[index].href, window.location.href);
    if (url.pathname === window.location.pathname) {
      activate(index); // same page: let the browser (Lenis) scroll to the #section
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    activate(index, { navigate: true });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = active ?? 0;
    let next = current;
    if (event.key === "ArrowRight") next = Math.min(TABS.length - 1, current + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, current - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    tabRefs.current[next]?.focus();
    activate(next); // moves the bead; Enter on the focused tab follows the link
  };

  const localX = (event: PointerEvent) => {
    const box = dockRef.current?.getBoundingClientRect();
    if (!box) return 0;
    return (event.clientX - box.left) / (box.width / W);
  };

  const onBeadDown = (event: PointerEvent<HTMLSpanElement>) => {
    const s = sim.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    s.dragging = true;
    s.grab = localX(event) - s.x;
    s.lastMoveAt = event.timeStamp;
    event.currentTarget.dataset.drag = "true";
    kick();
  };

  const onBeadMove = (event: PointerEvent<HTMLSpanElement>) => {
    const s = sim.current;
    if (!s.dragging) return;
    const next = clamp(localX(event) - s.grab, center(0), center(TABS.length - 1));
    const dt = Math.max(0.001, (event.timeStamp - s.lastMoveAt) / 1000);
    s.lastMoveAt = event.timeStamp;
    if (!s.reduce) s.v = s.v * 0.55 + ((next - s.x) / dt) * 0.45;
    s.x = next;
    s.target = next;
    kick();
  };

  const onBeadUp = (event: PointerEvent<HTMLSpanElement>) => {
    const s = sim.current;
    if (!s.dragging) return;
    s.dragging = false;
    delete event.currentTarget.dataset.drag;
    activate(nearestIndex(s.x), { navigate: true });
  };

  return (
    <div ref={rootRef} className="mn-root" style={{ ["--mn-k" as string]: 1 }}>
      <div ref={dockRef} className="mn-dock">
        <span ref={glowRef} aria-hidden="true" className="mn-glow" />
        <svg className="mn-skin" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <defs>
            <linearGradient id="mnPlate" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={H}>
              <stop offset="0" stopColor="#0b2219" />
              <stop offset="1" stopColor="#040d09" />
            </linearGradient>
            <linearGradient id="mnRim" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={H}>
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path ref={pathRef} className="mn-fill" d={dockPath(center(2), S, S, { ...SHAPE, rb: 0 })} />
        </svg>

        <div role="tablist" aria-label="Main navigation" className="mn-tabs" onKeyDown={onKeyDown}>
          {TABS.map((tab, index) => {
            const selected = active === index;
            return (
              <a
                key={tab.label}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                href={tab.href}
                aria-selected={selected}
                aria-label={tab.aria}
                tabIndex={(active ?? 0) === index ? 0 : -1}
                className="mn-tab"
                style={{ ["--acc" as string]: tab.accent }}
                onClick={(event) => onTabClick(event, index)}
              >
                <span
                  ref={(el) => {
                    tabIcons.current[index] = el;
                  }}
                  className="mn-tab__icon"
                >
                  {tab.icon}
                </span>
              </a>
            );
          })}
        </div>

        <span ref={labelRef} aria-hidden="true" className="mn-label" />

        <span
          ref={beadRef}
          aria-hidden="true"
          className="mn-bead"
          onPointerDown={onBeadDown}
          onPointerMove={onBeadMove}
          onPointerUp={onBeadUp}
          onPointerCancel={onBeadUp}
        >
          {TABS.map((tab, index) => (
            <span
              key={tab.label}
              ref={(el) => {
                beadIcons.current[index] = el;
              }}
              className="mn-bead__icon"
            >
              {tab.icon}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
