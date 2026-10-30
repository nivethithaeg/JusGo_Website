"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ChaosToOneStory } from "@/components/ChaosToOneStory";
import { ActivityFeed, FlipNumber, SyncToast, useLiveActivity, VenueFlash } from "@/components/LiveActivity";
import { CardRise, FlipIn, InteractiveCard, TiltGlow } from "@/components/motion/Cards";
import { DrawDivider, GlowShift } from "@/components/motion/Finale";
import { HeroImage } from "@/components/motion/HeroImage";
import { AmbientParticles } from "@/components/motion/Ambient";
import { HeadlineReveal, HeroItem, ScrollHint } from "@/components/motion/Hero";
import { Magnetic } from "@/components/motion/Interactions";
import { HeroTrail } from "@/components/motion/PointerFun";
import { Parallax, ParallaxDecor, ScrollRail } from "@/components/motion/Scroll";
import { Highlight, ReadFill, ScrambleText, Underline, WordReveal } from "@/components/motion/Text";
import { SectionDots } from "@/components/SectionDots";
import { ScrollProgress, SiteFooter, SiteNavbar } from "@/components/SiteChrome";
import { EASE as ease } from "@/lib/motion";
import { useHeroScroll } from "@/lib/useHeroScroll";
import { useTilt } from "@/lib/useTilt";
const logo = "/assets/jusgo-logo.png";

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="JusGo — Limitless Play. Limitless Connections."
      width={557}
      height={418}
      fetchPriority="high"
      className={`block h-auto w-full object-contain ${className}`}
    />
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${light ? "text-jg-lime" : "text-jg-600"}`}>
      {typeof children === "string" ? <ScrambleText text={children} /> : children}
    </p>
  );
}

const PREVIEW_VENUES = [
  { name: "Rally Sports Arena", kind: "Badminton · 4 courts", time: "Today · 6:00 PM", status: "Available" },
  { name: "Greenline Turf", kind: "Football · 2 turfs", time: "Today · 7:30 PM", status: "Available" },
];

const CHART_BARS = [34, 52, 40, 66, 48, 82, 58, 96, 70, 88, 62, 100];
const CHART_LINE = CHART_BARS.map((height, index) => `${index === 0 ? "M" : "L"} ${((index + 0.5) / CHART_BARS.length) * 100} ${100 - height}`).join(" ");
/** 1 = already booked, lights up lime in sequence. */
const SLOT_PATTERN = [1, 0, 1, 1, 0, 1, 0, 0];
const SLOT_DIM = "rgba(255,255,255,0.1)";
const SLOT_ON = "rgba(155,226,47,0.85)";

function ProductPreview() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const chipLeftY = useTransform(scrollY, [0, 700], [0, -56]);
  const chipRightY = useTransform(scrollY, [0, 700], [0, 48]);
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>(5);
  const { feed, free, ticks } = useLiveActivity(ref);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[620px]" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <SyncToast latest={feed[0]} />
      <div className="tilt relative z-10 rounded-[26px] border border-white/15 bg-[#0a2017]/90 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:rounded-[32px] sm:p-4">
        <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3 sm:px-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-jg-lime text-xs font-black text-jg-950">J</div>
            <div>
              <p className="text-[11px] font-bold text-white">JusGo Partner</p>
              <p className="mt-0.5 text-[9px] text-white/45">Venue dashboard</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-jg-lime/20 bg-jg-lime/10 px-2.5 py-1.5 text-[8px] font-semibold text-jg-lime sm:px-3 sm:text-[9px]">
            <span className="h-1.5 w-1.5 rounded-full bg-jg-lime" /> Connected
          </span>
        </div>

        <div className="grid gap-3 p-2.5 sm:grid-cols-[1.05fr_.95fr] sm:gap-4 sm:p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-[9px] text-white/45">Your venues</p><p className="mt-1 text-[13px] font-bold text-white sm:text-sm">Ready to play</p></div>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-jg-lime/10 text-jg-lime" aria-hidden="true">⌖</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {PREVIEW_VENUES.map((venue) => (
                <div key={venue.name} className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-jg-950/55 p-3">
                  <VenueFlash tick={ticks[venue.name] ?? 0} />
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="text-[10px] font-semibold text-white sm:text-[11px]">{venue.name}</p><p className="mt-1 text-[8px] text-white/45 sm:text-[9px]">{venue.kind}</p></div>
                    <span className="rounded-full bg-jg-lime/10 px-2 py-1 text-[7px] font-semibold text-jg-lime sm:text-[8px]">{venue.status}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-2.5">
                    <span className="text-[8px] text-white/45">{venue.time} · <span className="inline-flex gap-0.5 font-semibold text-white/70"><FlipNumber value={free[venue.name]} /> free</span></span>
                    <span className="text-[9px] font-semibold text-white">View slots <span className="text-jg-lime">→</span></span>
                  </div>
                </div>
              ))}
            </div>
            <ActivityFeed feed={feed} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-1 flex-col rounded-2xl border border-jg-lime/20 bg-gradient-to-br from-jg-800/65 to-jg-950 p-4">
              <p className="text-[9px] text-white/55">Connected channels</p>
              <div className="mt-4 flex -space-x-2">
                {["P", "A", "S"].map((item, index) => (
                  <span key={item} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-[#0a2017] text-[10px] font-bold text-white ${index === 0 ? "bg-jg-600" : index === 1 ? "bg-info-500" : "bg-amber-500"}`}>{item}</span>
                ))}
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#0a2017] bg-white/10 text-[9px] text-white/70">+2</span>
              </div>
              <div className="mt-4" aria-hidden="true">
                <p className="mb-1.5 text-[8px] text-white/40">Today&apos;s slots</p>
                <div className="grid grid-cols-8 gap-1">
                  {SLOT_PATTERN.map((booked, index) => (
                    <motion.span
                      key={index}
                      className="h-2.5 rounded-[3px]"
                      style={{ backgroundColor: booked ? (reduceMotion ? SLOT_ON : SLOT_DIM) : SLOT_DIM }}
                      animate={booked && !reduceMotion ? { backgroundColor: [SLOT_DIM, SLOT_ON, SLOT_ON, SLOT_DIM] } : undefined}
                      transition={{ duration: 6, times: [0, 0.12, 0.8, 1], delay: 1 + index * 0.22, repeat: Infinity, repeatDelay: 1.2 }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-auto pt-4 text-[10px] font-semibold text-white">One setup. More ways to get booked.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-white/50">Booking activity</p>
                <span className="text-[8px] text-jg-lime">Updated just now</span>
              </div>
              <div className="relative mt-4 flex h-12 items-end gap-1.5" aria-label="Illustrative booking activity chart">
                {CHART_BARS.map((height, index) => (
                  <motion.span
                    key={index}
                    initial={reduceMotion ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.7, delay: 0.6 + index * 0.06, ease }}
                    className="relative flex-1 origin-bottom"
                    style={{ height: `${height}%` }}
                  >
                    <motion.span
                      animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.75] }}
                      transition={{ duration: 2 + (index % 4) * 0.35, delay: index * 0.07, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-t-sm ${index === CHART_BARS.length - 1 ? "bg-jg-lime" : "bg-jg-600/70"}`}
                    />
                  </motion.span>
                ))}
                <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                  <motion.path
                    d={CHART_LINE}
                    fill="none"
                    stroke="#9BE22F"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.9 }}
                    transition={{ duration: 1.5, delay: 1.1, ease }}
                  />
                </svg>
              </div>
              <p className="mt-2 text-[8px] text-white/35">A clearer view of your bookings across channels.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-2 pt-3 sm:px-3 sm:pt-4">
          <span className="text-[8px] text-white/40 sm:text-[9px]">One connected booking experience</span>
          <span className="font-mono text-[8px] text-white/35">JUSGO / PREVIEW</span>
        </div>
        <TiltGlow />
      </div>
      <motion.div style={reduceMotion ? undefined : { y: chipLeftY }} className="absolute -left-2 top-[18%] z-20 sm:-left-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.8, ease }}
        className="rounded-2xl border border-white/15 bg-jg-950/90 p-3 shadow-xl backdrop-blur-xl sm:p-4"
      >
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-jg-lime">Venue controls</span>
        <p className="mt-1.5 text-[10px] font-semibold text-white sm:text-xs">Slots · pricing · availability</p>
      </motion.div>
      </motion.div>
      <motion.div style={reduceMotion ? undefined : { y: chipRightY }} className="absolute -right-2 bottom-[14%] z-20 sm:-right-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1, ease }}
        className="rounded-2xl border border-white/15 bg-jg-950/90 p-3 shadow-xl backdrop-blur-xl sm:p-4"
      >
        <span className="flex items-center gap-2 text-[9px] font-semibold text-white sm:text-[10px]"><span className="grid h-5 w-5 place-items-center rounded-full bg-jg-lime/15 text-jg-lime">✓</span> One source of truth</span>
      </motion.div>
      </motion.div>
    </div>
  );
}

const RIBBON_TOP = ["Availability", "Pricing", "Venue identity", "Owner approval", "Live bookings"];
const RIBBON_BOTTOM = ["Set your rules once", "Connect on your terms", "Keep bookings in sync", "Limitless Play", "Limitless Connections"];

/** One endlessly looping row. `direction` -1 scrolls left, 1 scrolls right; `speed` scales the base rate. */
function MarqueeRow({
  labels,
  direction,
  baseSpeed,
  speed,
  active,
  className,
  labelClassName,
  starClassName,
  hidden = false,
}: {
  labels: string[];
  direction: 1 | -1;
  baseSpeed: number;
  speed: MotionValue<number>;
  active: boolean;
  className: string;
  labelClassName: string;
  starClassName: string;
  hidden?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const offset = useMotionValue(0); // percent of one copy, kept in [0, 50)
  const x = useTransform(offset, (value) => `${value - 50}%`);
  const activeRef = useRef(active);
  activeRef.current = active;

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !activeRef.current) return;
    const step = (baseSpeed * speed.get() * Math.min(delta, 64)) / 1000;
    offset.set((((offset.get() - direction * step) % 50) + 50) % 50);
  });

  return (
    <div className={className} aria-hidden={hidden || undefined}>
      <motion.div style={{ x }} className="flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-8 px-4 sm:gap-12 sm:px-6" aria-hidden={copy === 1 || undefined}>
            {labels.map((label) => (
              <span key={label} className={`flex items-center gap-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] sm:gap-12 sm:text-xs ${labelClassName}`}>
                {label}<span className={starClassName} aria-hidden="true">✳</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function CapabilitiesRibbon() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onScreen = useInView(wrapperRef, { margin: "80px" });
  const { scrollY } = useScroll();
  // Scrolling speeds both rows up (to 5x); the spring eases them back to 1x.
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 90, damping: 30 });
  const speed = useTransform(velocity, (value) => 1 + Math.min(4, Math.abs(value) / 400));

  return (
    <div ref={wrapperRef} className="relative overflow-hidden bg-white py-9 sm:py-14">
      <MarqueeRow
        labels={RIBBON_TOP}
        direction={-1}
        baseSpeed={1.56}
        speed={speed}
        active={onScreen}
        className="relative -mx-[6%] -rotate-2 border-y border-jg-900/10 bg-white py-5"
        labelClassName="text-ink-900/55"
        starClassName="text-jg-600"
      />
      <MarqueeRow
        labels={RIBBON_BOTTOM}
        direction={1}
        baseSpeed={1.9}
        speed={speed}
        active={onScreen}
        hidden
        className="relative z-10 -mx-[6%] -mt-1 rotate-1 bg-jg-950 py-4 shadow-card"
        labelClassName="text-jg-lime"
        starClassName="text-jg-lime/60"
      />
    </div>
  );
}

/** Halo around a map node that lights up when scroll progress reaches its turn. */
function NodeHalo({ progress, index, x, y, color }: { progress: MotionValue<number>; index: number; x: number; y: number; color: string }) {
  const start = 0.12 + index * 0.16;
  const opacity = useTransform(progress, [start, start + 0.14], [0, 1]);
  const scale = useTransform(progress, [start, start + 0.14], [0.85, 1]);
  return (
    <motion.circle cx={x} cy={y} r="34" fill="none" stroke={color} strokeWidth="1.5" style={{ opacity, scale, transformOrigin: `${x}px ${y}px` }} />
  );
}

export function ConnectionStory() {
  const reduceMotion = useReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const done = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: mapRef, offset: ["start 85%", "center 45%"] });
  const mapProgress = reduceMotion ? done : scrollYProgress;
  const points = [
    { x: 82, y: 112, label: "VENUE", name: "Rally Arena", color: "fill-jg-lime" },
    { x: 82, y: 294, label: "VENUE", name: "Greenline Turf", color: "fill-jg-lime" },
    { x: 518, y: 112, label: "APP", name: "PlayNow", color: "fill-info-500" },
    { x: 518, y: 294, label: "APP", name: "CourtClub", color: "fill-amber-500" },
  ];

  return (
    <section id="network" className="relative isolate overflow-hidden bg-jg-950 px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12">
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-45" />
      <GlowShift className="section-glow pointer-events-none absolute inset-0" />
      <DrawDivider />
      <div className="relative mx-auto grid max-w-[1160px] items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal>
          <Eyebrow light>A shared foundation</Eyebrow>
          <h2 className="mt-4 max-w-lg font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.06em] sm:text-5xl"><WordReveal>One connected network. <span className="text-jg-lime"><Underline>More ways to play.</Underline></span></WordReveal></h2>
          <ReadFill className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base" text={"JusGo sits between venues and the booking platforms they approve. Venue identity, availability, pricing, and bookings flow through a shared source of truth."} />
          <div className="mt-8">
            <ScrollRail>
            {[
              { step: "01", label: "Owners set the rules", detail: "Courts, slots, and pricing stay under venue control." },
              { step: "02", label: "Apps connect with approval", detail: "Each connection starts with the venue owner’s consent." },
              { step: "03", label: "Bookings stay aligned", detail: "Connected platforms use the same live availability and price." },
            ].map((item, index) => (
              <FlipIn key={item.step} index={index} ballClassName="text-jg-lime">
                <div className="flex gap-4">
                  <span className="font-mono text-[10px] text-jg-lime">{item.step}</span>
                  <div><p className="text-xs font-bold">{item.label}</p><p className="mt-1 text-[10px] leading-5 text-white/45">{item.detail}</p></div>
                </div>
              </FlipIn>
            ))}
            </ScrollRail>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="min-w-0">
          <div ref={mapRef} className="relative rounded-[26px] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/20 sm:p-5">
            <div className="mb-3 flex items-center justify-between px-1 sm:mb-5">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">Connected ecosystem</span>
              <span className="flex items-center gap-2 text-[8px] text-white/45"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jg-lime" />Network map</span>
            </div>
            <svg viewBox="0 0 600 400" className="h-auto w-full overflow-visible" role="img" aria-label="Diagram showing sports venues and booking apps connected through JusGo">
              <defs>
                <radialGradient id="network-glow">
                  <stop offset="0%" stopColor="#1FA94B" stopOpacity=".25" />
                  <stop offset="100%" stopColor="#1FA94B" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="300" cy="202" r="115" fill="url(#network-glow)" />
              <ellipse cx="300" cy="202" rx="135" ry="155" fill="none" stroke="white" strokeOpacity=".06" />
              <ellipse cx="300" cy="202" rx="95" ry="112" fill="none" stroke="#9BE22F" strokeOpacity=".12" />
              {points.map((point, index) => (
                <g key={point.name}>
                  <motion.path
                    d={`M ${point.x} ${point.y} C ${point.x < 300 ? 190 : 410} ${point.y}, ${point.x < 300 ? 205 : 395} 202, ${point.x < 300 ? 245 : 355} 202`}
                    fill="none"
                    stroke={point.color === "fill-jg-lime" ? "#9BE22F" : point.color === "fill-info-500" ? "#4F86E8" : "#E8A23C"}
                    strokeOpacity=".4"
                    strokeWidth="1.5"
                    strokeDasharray="5 7"
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: index * 0.14, ease }}
                  />
                  {/* Hidden with CSS (not conditionally rendered) so the markup matches on hydration. */}
                  <circle className="motion-reduce:hidden" r="3" fill={point.color === "fill-jg-lime" ? "#9BE22F" : point.color === "fill-info-500" ? "#4F86E8" : "#E8A23C"}>
                    <animateMotion path={`M ${point.x} ${point.y} C ${point.x < 300 ? 190 : 410} ${point.y}, ${point.x < 300 ? 205 : 395} 202, ${point.x < 300 ? 245 : 355} 202`} dur={`${3.5 + index * 0.4}s`} begin={`${index * -0.8}s`} repeatCount="indefinite" />
                  </circle>
                  <NodeHalo progress={mapProgress} index={index} x={point.x} y={point.y} color={point.color === "fill-jg-lime" ? "#9BE22F" : point.color === "fill-info-500" ? "#4F86E8" : "#E8A23C"} />
                  <g transform={`translate(${point.x}, ${point.y})`}>
                    <circle r="27" fill="#062217" stroke="white" strokeOpacity=".12" />
                    <circle r="4" className={point.color} />
                    <text y="54" fill="white" fillOpacity=".55" textAnchor="middle" fontSize="10" fontFamily="Inter, sans-serif" letterSpacing="1.2">{point.label}</text>
                    <text y="70" fill="white" fillOpacity=".9" textAnchor="middle" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">{point.name}</text>
                  </g>
                </g>
              ))}
              <g>
                <motion.circle cx="300" cy="202" r="53" fill="none" stroke="#9BE22F" strokeWidth="1.5" initial={{ opacity: 0 }} animate={reduceMotion ? { opacity: 0 } : { scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} style={{ transformOrigin: "300px 202px" }} />
                <circle cx="300" cy="202" r="53" fill="#0E5C38" fillOpacity=".42" stroke="#9BE22F" strokeOpacity=".42" />
                <circle cx="300" cy="202" r="43" fill="#0A3D2A" stroke="white" strokeOpacity=".14" />
                <text x="300" y="197" fill="white" textAnchor="middle" fontSize="14" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" letterSpacing="-0.6">JusGo</text>
                <text x="300" y="210" fill="#9BE22F" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.8">CONNECTIVE</text>
                <text x="300" y="220" fill="#9BE22F" textAnchor="middle" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.8">LAYER</text>
              </g>
            </svg>
            <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-white/[0.08] pt-4 text-[8px] text-white/45">
              <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-jg-lime" />Venue network</span>
              <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-info-500" />Booking apps</span>
              <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Shared booking flow</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const { ref, textStyle, visualStyle } = useHeroScroll();
  return (
    <section ref={ref} id="home" className="hero-backdrop relative isolate flex min-h-[100svh] overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12">
      <HeroImage />
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" />
      <AmbientParticles />
      <HeroTrail />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className="absolute h-1 w-1 animate-float rounded-full bg-jg-lime/60 motion-reduce:hidden" style={{ left: `${(i * 43 + 11) % 100}%`, top: `${(i * 29 + 7) % 100}%`, animationDelay: `${(i % 7) * -0.75}s` }} />
        ))}
        <motion.div
          animate={reduceMotion ? undefined : { scale: [0.92, 1.08, 0.92], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="lime-glow absolute left-[72%] top-[48%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] items-center gap-12 py-8 lg:grid-cols-[.94fr_1.06fr] lg:gap-6">
        <motion.div style={textStyle} className="max-w-[590px]">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-jg-lime/25 bg-jg-lime/[0.08] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-jg-lime sm:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-jg-lime" /> Introducing JusGo
            </span>
          </motion.div>
          <HeadlineReveal
            lines={[{ text: "More ways to play." }, { text: "One way to manage it all.", accent: true, alternates: ["One source of truth.", "One place for every booking."] }]}
            className="mt-6 text-balance font-display text-[clamp(2.8rem,6.6vw,5.7rem)] font-extrabold leading-[.99] tracking-[-0.075em] text-white"
          />
          <HeroItem kind="subtitle">
            <p className="mt-6 max-w-[540px] text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Meet the booking infrastructure that brings sports venues and booking apps together. Manage your rules in one place, connect with approved channels, and make every booking work in sync.
            </p>
          </HeroItem>
          <HeroItem kind="cta" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Magnetic><a href="#product" data-cursor="Discover" className="group inline-flex items-center justify-center rounded-full bg-jg-lime px-6 py-3.5 text-xs font-bold text-jg-950 transition-transform hover:-translate-y-0.5">
              Discover JusGo <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </a></Magnetic>
            <a href="#product" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-6 py-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/10">
              See how it works
            </a>
          </HeroItem>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-medium text-white/55"
          >
            {["For venue owners", "For booking apps", "Built to stay in sync"].map((item) => (
              <span key={item} className="flex items-center gap-2"><span className="text-jg-lime">✳</span>{item}</span>
            ))}
          </motion.div>
        </motion.div>
        <motion.div style={visualStyle}>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.16, ease }}
            className="relative px-2 py-3 sm:px-8 lg:px-2"
          >
            <ProductPreview />
          </motion.div>
        </motion.div>
      </div>
      <ScrollHint />
      <span className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35 lg:block">A better-connected way to play</span>
    </section>
  );
}

const OVERVIEW_ART = ["football", "cricket", "tennis"] as const;

export function ProductOverview() {
  const capabilities = [
    { number: "01", title: "Set your rules once", description: "Manage venues, playing areas, availability and pricing from one place—then keep every approved channel aligned.", icon: "⌖" },
    { number: "02", title: "Connect on your terms", description: "Choose which booking apps can connect. Venue-owner approval stays at the center of every connection.", icon: "↗" },
    { number: "03", title: "Keep bookings in sync", description: "Give connected apps a shared view of availability and effective prices, so customers can book with confidence.", icon: "⟳" },
  ];

  return (
    <section id="product" className="relative isolate overflow-hidden bg-mist-50 px-5 py-24 text-ink-900 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      <ParallaxDecor side="left" />
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-jg-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1160px]">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div><Eyebrow>One connected platform</Eyebrow><h2 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.06em] sm:text-5xl"><WordReveal>The simpler way to run <span className="text-jg-600"><Highlight>every booking.</Highlight></span></WordReveal></h2></div>
            <ReadFill className="max-w-xl text-sm leading-7 text-ink-900/65 md:justify-self-end sm:text-base" text={"JusGo gives venue owners and booking platforms a shared foundation—so managing availability, pricing, and bookings doesn't mean juggling disconnected systems."} />
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {capabilities.map((item, index) => (
            <FlipIn key={item.number} index={index} className="h-full">
              <InteractiveCard tilt={6} art={OVERVIEW_ART[index]} className="h-full rounded-2xl border border-[#B6FF3B]/15 bg-[#071426] p-6 text-white shadow-[0_22px_50px_-22px_rgba(7,20,38,0.8)] sm:p-7">
                <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#B6FF3B]/10 text-xl text-[#B6FF3B]">{item.icon}</span><span className="font-mono text-[10px] text-white/40">{item.number}</span></div>
                <h3 className="mt-8 text-lg font-bold tracking-tight">{item.title}</h3>
                <CardRise order={1} className="mt-3"><p className="text-sm leading-6 text-white/65">{item.description}</p></CardRise>
              </InteractiveCard>
            </FlipIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductAudiences() {
  return (
    <section id="audiences" className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto grid max-w-[1160px] gap-4 md:grid-cols-2">
        <Reveal>
          <InteractiveCard id="venues" tilt={5} strikeClassName="text-[#B6FF3B]" className="h-full overflow-hidden rounded-[26px] border border-[#B6FF3B]/15 bg-[#071426] p-7 text-white sm:p-9">
            <div className="relative">
              <Eyebrow light>For venue owners</Eyebrow>
              <h2 className="mt-4 max-w-sm font-display text-3xl font-extrabold leading-tight tracking-[-0.05em] sm:text-4xl"><WordReveal>Your venue. Your rules. More ways to get booked.</WordReveal></h2>
              <CardRise order={1} className="mt-4"><p className="max-w-md text-sm leading-7 text-white/65">Keep control of your courts, slots and pricing while making it easier for approved apps to bring players your way.</p></CardRise>
              <ul className="mt-7 space-y-3 text-xs text-white/80">
                {["Manage availability and prices in one place", "Approve the channels that connect to you", "See bookings across your connected platforms"].map((item) => <li key={item} className="flex gap-2.5"><span className="text-jg-lime">✓</span>{item}</li>)}
              </ul>
              <CardRise order={3} className="mt-8"><a href="/venues" className="inline-flex items-center gap-2 text-xs font-bold text-[#B6FF3B] hover:text-white">Explore JusGo for venues <span aria-hidden="true">→</span></a></CardRise>
            </div>
          </InteractiveCard>
        </Reveal>
        <Reveal delay={0.1}>
          <InteractiveCard id="developers" tilt={5} className="h-full rounded-[26px] border border-[#B6FF3B]/15 bg-[#071426] p-7 text-white sm:p-9">
            <Eyebrow light>For booking apps</Eyebrow>
            <h2 className="mt-4 max-w-sm font-display text-3xl font-extrabold leading-tight tracking-[-0.05em] sm:text-4xl"><WordReveal>Build one connection. Reach more venues.</WordReveal></h2>
            <CardRise order={1} className="mt-4"><p className="max-w-md text-sm leading-7 text-white/65">Integrate with JusGo to discover approved venue inventory, retrieve live availability, and send bookings through a consistent API.</p></CardRise>
            <div className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-[9px] leading-6 text-jg-lime/90 sm:p-5 sm:text-[10px]">
              <p className="text-white/35">// One integration, a connected network</p>
              <p className="mt-2"><span className="text-jg-400">GET</span> /api/v1/availability</p>
              <p className="pl-4 text-white/65">?playingAreaId=PA-1001</p>
              <p className="pl-4 text-white/65">&amp;date=2026-10-28</p>
              <p className="mt-2 text-white/40">→ slots · availability · effective price</p>
            </div>
            <CardRise order={3} className="mt-6"><a href="/developers" className="inline-flex items-center gap-2 text-xs font-bold text-[#B6FF3B] hover:text-white">Explore JusGo for developers <span aria-hidden="true">→</span></a></CardRise>
          </InteractiveCard>
        </Reveal>
      </div>
    </section>
  );
}

const HOME_SECTIONS = [
  { id: "home", label: "Welcome" },
  { id: "product", label: "Platform" },
  { id: "story", label: "The problem" },
  { id: "network", label: "Connected network" },
  { id: "audiences", label: "Who it's for" },
];

export function JusGoSite() {
  return (
    <>
      <ScrollProgress />
      <SiteNavbar />
      <SectionDots sections={HOME_SECTIONS} />
      <main>
        <Hero />
        <CapabilitiesRibbon />
        <ProductOverview />
        <ChaosToOneStory />
        <ConnectionStory />
        <ProductAudiences />
      </main>
      <SiteFooter />
    </>
  );
}
