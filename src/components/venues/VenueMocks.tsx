"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";
import { TiltGlow } from "@/components/motion/Cards";
import { ScrambleText } from "@/components/motion/Text";
import { EASE_EXPO } from "@/lib/motion";
import { useTilt } from "@/lib/useTilt";

/** Children of a Shot (rows, cards, list items) rise in one after another when the screen scrolls into view. */
const ITEM = { hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0 } };

/* ---------- tiny building blocks ---------- */

export type IconName = "home" | "pin" | "grid" | "ticket" | "calendar" | "tag" | "chart" | "plug" | "users" | "bell" | "card" | "gear" | "lock" | "check" | "user" | "doc" | "shield" | "clock" | "key" | "webhook" | "code" | "help" | "list" | "globe";

const ICONS: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  pin: "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 7.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  ticket: "M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4zM9 6v12",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  tag: "M3 12V4h8l10 10-8 8zM7.5 7.5h.01",
  chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4",
  users: "M9 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM3 20c0-3.6 2.7-6 6-6s6 2.4 6 6M16 5.2a3.2 3.2 0 0 1 0 6M18 14.4c1.8.8 3 2.6 3 5.6",
  bell: "M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21a2 2 0 0 0 4 0",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  check: "M5 12.5 10 17.5 19 7",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-7 8-7s8 3 8 7",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  shield: "M12 3 20 6v6c0 4.5-3.3 8-8 9-4.7-1-8-4.5-8-9V6z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  key: "M15 8a4 4 0 1 1-1.2 2.8L4 20v-3l2-2v-2l2-2h2.2A4 4 0 0 1 15 8zM16.5 8.5h.01",
  webhook: "M9 17a4 4 0 1 1 6.9-2.7M12 8a3 3 0 1 1 2.6 4.5L11 19M8 15l3.5-6.5",
  code: "m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
};

export function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

type Tone = "lime" | "amber" | "red" | "blue" | "grey";
const TONES: Record<Tone, string> = {
  lime: "bg-[#B6FF3B]/15 text-[#B6FF3B]",
  amber: "bg-amber-400/15 text-amber-300",
  red: "bg-red-400/15 text-red-300",
  blue: "bg-sky-400/15 text-sky-300",
  grey: "bg-white/10 text-white/60",
};

export function Chip({ tone = "grey", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold ${TONES[tone]}`}>{children}</span>;
}

/**
 * Window frame used for every illustration: dark navy surface, lime hairline, "Illustration" tag.
 * It tilts toward a mouse with a light spot, and the items inside rise in one by one when it appears.
 */
export function Shot({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>(4);
  return (
    <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className={className}>
      <div className="tilt relative h-full overflow-hidden rounded-2xl border border-[#B6FF3B]/15 bg-[#071426] text-white shadow-[0_28px_60px_-28px_rgba(7,20,38,0.9)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-red-400/70" />
            <span className="h-2 w-2 rounded-full bg-amber-300/70" />
            <span className="h-2 w-2 rounded-full bg-[#B6FF3B]/70" />
          </div>
          <span className="text-[10px] font-semibold text-white/55">{title}</span>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40">Illustration</span>
        </div>
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } }}
          className="p-4"
        >
          {children}
        </motion.div>
        <TiltGlow />
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={ITEM} transition={{ duration: 0.5, ease: EASE_EXPO }} className={`rounded-xl border border-white/10 bg-white/[0.04] p-3 ${className}`}>
      {children}
    </motion.div>
  );
}

/* ---------- dashboard ---------- */

const STATS: { label: string; value: string; hint?: string }[] = [
  { label: "Venues", value: "3" },
  { label: "Playing areas", value: "8" },
  { label: "Today's bookings", value: "14" },
  { label: "Upcoming", value: "42" },
  { label: "Completed", value: "318" },
  { label: "Cancelled", value: "12" },
  { label: "Total revenue (GTV)", value: "₹4,82,500", hint: "Owners only" },
  { label: "Open slots today", value: "9" },
];

const TREND = [12, 15, 11, 18, 22, 17, 25, 28, 21, 19, 26, 31, 27, 24, 30, 34, 29, 26, 33, 38, 35, 31, 37, 41, 36, 33, 40, 44, 39, 46];

/** Counts a stat up from 0 when it scrolls into view. Shows the final value without JS or with reduced motion. */
function CountUp({ value }: { value: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\D*)([\d,]+)(.*)$/);
    if (!el || !inView || reduceMotion || !match) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ""));
    const format = new Intl.NumberFormat("en-IN");
    const controls = animate(0, target, {
      duration: 1.3,
      ease: EASE_EXPO,
      onUpdate: (v) => {
        el.textContent = prefix + format.format(Math.round(v)) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return <span ref={ref}>{value}</span>;
}

export function TrendChart() {
  const reduceMotion = useReducedMotion();
  const w = 300;
  const h = 90;
  const max = Math.max(...TREND);
  const pts = TREND.map((v, i) => [(i / (TREND.length - 1)) * w, h - (v / max) * (h - 8) - 4] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full" role="img" aria-label="Illustrative 30-day booking trend line rising over the month">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="white" strokeOpacity="0.07" />
      ))}
      <motion.path
        d={`${line} L${w} ${h} L0 ${h} Z`}
        fill="#B6FF3B"
        fillOpacity="0.1"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="#B6FF3B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reduceMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE_EXPO }}
      />
    </svg>
  );
}

const DONUT = [
  { label: "Upcoming", value: 42, color: "#B6FF3B" },
  { label: "Completed", value: 318, color: "#38bdf8" },
  { label: "Cancelled", value: 12, color: "#f87171" },
];

export function Donut() {
  const reduceMotion = useReducedMotion();
  const total = DONUT.reduce((sum, d) => sum + d.value, 0);
  const r = 34;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90" role="img" aria-label="Illustrative booking status donut: mostly completed, some upcoming, few cancelled">
        <circle cx="50" cy="50" r={r} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="12" />
        {DONUT.map((d, i) => {
          const len = (d.value / total) * c;
          const seg = (
            <motion.circle
              key={d.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="12"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.25 }}
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <ul className="space-y-1.5 text-[10px] text-white/70">
        {DONUT.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            {d.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardMock({ compact = false }: { compact?: boolean }) {
  return (
    <Shot title="Dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#B6FF3B]/20 bg-gradient-to-r from-[#B6FF3B]/10 to-transparent p-3">
        <div>
          <p className="text-[11px] font-bold">Welcome back, Venue Owner</p>
          <p className="mt-1 flex items-center gap-2 text-[9px] text-white/55">
            Your owner code <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[#B6FF3B]"><ScrambleText text="JGO-7X9QVZ" /></span>
          </p>
        </div>
        <span className="venue-pulse relative rounded-full bg-[#B6FF3B] px-3 py-1.5 text-[9px] font-bold text-[#071426]">+ Add booking</span>
      </div>

      <div className={`mt-3 grid gap-2 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-4"}`}>
        {(compact ? STATS.slice(0, 4) : STATS).map((s) => (
          <Card key={s.label}>
            <p className="text-[8px] text-white/45">{s.label}</p>
            <p className="mt-1 text-sm font-extrabold"><CountUp value={s.value} /></p>
            {s.hint ? <p className="mt-0.5 text-[7px] text-[#B6FF3B]/70">{s.hint}</p> : null}
          </Card>
        ))}
      </div>

      {compact ? null : (
        <div className="mt-3 grid gap-2 md:grid-cols-[1.5fr_1fr]">
          <Card>
            <p className="text-[9px] font-semibold text-white/60">Bookings · last 30 days</p>
            <TrendChart />
          </Card>
          <Card>
            <p className="mb-2 text-[9px] font-semibold text-white/60">Booking status</p>
            <Donut />
          </Card>
        </div>
      )}
    </Shot>
  );
}

/* ---------- sidebar ---------- */

export type MenuItem = { label: string; icon: IconName; locked?: boolean; hidden?: boolean };

export function SidebarMock({ title, items, note }: { title: string; items: MenuItem[]; note?: string }) {
  return (
    <Shot title={title}>
      <ul className="space-y-1">
        {items
          .filter((item) => !item.hidden)
          .map((item) => (
            <motion.li
              key={item.label}
              variants={ITEM}
              transition={{ duration: 0.45, ease: EASE_EXPO }}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] ${item.locked ? "text-white/30" : "bg-white/[0.04] text-white/85"}`}
            >
              <span className="flex items-center gap-2">
                <Icon name={item.icon} className="h-3.5 w-3.5" />
                {item.label}
              </span>
              {item.locked ? <Icon name="lock" className="h-3 w-3" /> : null}
            </motion.li>
          ))}
      </ul>
      {note ? <p className="mt-3 border-t border-white/10 pt-2 text-[9px] text-white/45">{note}</p> : null}
    </Shot>
  );
}

/* ---------- portal page illustrations ---------- */

export function Row({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={ITEM} transition={{ duration: 0.5, ease: EASE_EXPO }} className={`flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] ${className}`}>
      {children}
    </motion.div>
  );
}

export function VenuesMock() {
  const rows = [
    { name: "Rally Sports Arena", meta: "Badminton · 4 courts", tone: "lime" as Tone, status: "Active" },
    { name: "Greenline Turf", meta: "Football · 2 turfs", tone: "lime" as Tone, status: "Active" },
    { name: "Baseline Courts", meta: "Tennis · 3 courts", tone: "amber" as Tone, status: "Draft" },
  ];
  return (
    <Shot title="Venues">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold">Your venues</p>
        <span className="rounded-full bg-[#B6FF3B] px-3 py-1 text-[9px] font-bold text-[#071426]">+ Add venue</span>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <Row key={r.name}>
            <span>
              <span className="block font-semibold">{r.name}</span>
              <span className="text-[9px] text-white/45">{r.meta}</span>
            </span>
            <Chip tone={r.tone}>{r.status}</Chip>
          </Row>
        ))}
      </div>
    </Shot>
  );
}

export function AreasMock() {
  const areas = [
    { name: "Court 1", type: "Badminton court", roof: "Covered", shape: "Rectangle", price: "₹600/hr" },
    { name: "Turf A", type: "Football turf", roof: "Open sky", shape: "Rectangle", price: "₹1,800/hr" },
    { name: "Turf B", type: "Football turf", roof: "Covered", shape: "Rectangle", price: "₹2,100/hr" },
  ];
  return (
    <Shot title="Playing areas">
      <div className="grid gap-2 sm:grid-cols-3">
        {areas.map((a) => (
          <Card key={a.name}>
            <div className="mb-2 grid h-14 place-items-center rounded-lg border border-white/10 bg-[#0b1c33]">
              <svg viewBox="0 0 60 36" className="h-9 w-14 text-[#B6FF3B]/70" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="2" y="2" width="56" height="32" rx="2" />
                <path d="M30 2v32" />
                <circle cx="30" cy="18" r="6" />
              </svg>
            </div>
            <p className="text-[10px] font-bold">{a.name}</p>
            <p className="text-[8px] text-white/45">{a.type}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Chip tone="blue">{a.roof}</Chip>
              <Chip>{a.shape}</Chip>
            </div>
            <p className="mt-2 text-[10px] font-semibold text-[#B6FF3B]">{a.price}</p>
          </Card>
        ))}
      </div>
    </Shot>
  );
}

export function BookingsMock() {
  const rows = [
    { time: "Today · 6:00 PM", area: "Court 1", who: "Aarav K.", tone: "blue" as Tone, status: "Upcoming" },
    { time: "Today · 7:30 PM", area: "Turf A", who: "Meera S.", tone: "blue" as Tone, status: "Upcoming" },
    { time: "Yesterday · 8:00 PM", area: "Turf B", who: "Rohan P.", tone: "lime" as Tone, status: "Completed" },
    { time: "Yesterday · 5:00 PM", area: "Court 1", who: "Nisha T.", tone: "red" as Tone, status: "Cancelled" },
  ];
  return (
    <Shot title="Bookings">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold">All bookings</p>
        <span className="rounded-full bg-[#B6FF3B] px-3 py-1 text-[9px] font-bold text-[#071426]">+ Add booking</span>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <Row key={r.time + r.area}>
            <span>
              <span className="block font-semibold">{r.time}</span>
              <span className="text-[9px] text-white/45">{r.area} · {r.who}</span>
            </span>
            <Chip tone={r.tone}>{r.status}</Chip>
          </Row>
        ))}
      </div>
    </Shot>
  );
}

export function CalendarMock() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const blocks: Record<string, { row: number; span: number; tone: string }[]> = {
    Mon: [{ row: 1, span: 1, tone: "bg-sky-400/50" }],
    Tue: [{ row: 0, span: 2, tone: "bg-[#B6FF3B]/50" }],
    Wed: [{ row: 2, span: 1, tone: "bg-sky-400/50" }, { row: 3, span: 1, tone: "bg-[#B6FF3B]/50" }],
    Thu: [{ row: 1, span: 2, tone: "bg-amber-400/50" }],
    Fri: [{ row: 0, span: 1, tone: "bg-sky-400/50" }, { row: 2, span: 2, tone: "bg-[#B6FF3B]/50" }],
    Sat: [{ row: 0, span: 2, tone: "bg-[#B6FF3B]/50" }, { row: 2, span: 2, tone: "bg-sky-400/50" }],
    Sun: [{ row: 1, span: 1, tone: "bg-amber-400/50" }],
  };
  return (
    <Shot title="Calendar">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <div key={d} className="text-center text-[8px] font-semibold text-white/50">{d}</div>
        ))}
        {days.map((d) => (
          <div key={d + "col"} className="relative h-28 rounded-lg border border-white/10 bg-white/[0.03]">
            {(blocks[d] ?? []).map((b, i) => (
              <motion.span key={i} variants={{ hidden: { scaleY: 0, opacity: 0 }, shown: { scaleY: 1, opacity: 1 } }} transition={{ duration: 0.55, ease: EASE_EXPO }} className={`absolute inset-x-1 origin-top rounded-md ${b.tone}`} style={{ top: `${b.row * 25 + 3}%`, height: `${b.span * 25 - 6}%` }} />
            ))}
          </div>
        ))}
      </div>
    </Shot>
  );
}

export function PricingMock() {
  const rows = [
    { area: "Court 1", base: "₹600", peak: "₹800" },
    { area: "Turf A", base: "₹1,800", peak: "₹2,200" },
    { area: "Turf B", base: "₹2,100", peak: "₹2,500" },
  ];
  return (
    <Shot title="Pricing">
      <div className="space-y-2">
        <div className="grid grid-cols-3 px-3 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/40">
          <span>Playing area</span>
          <span>Standard / hr</span>
          <span>Peak / hr</span>
        </div>
        {rows.map((r) => (
          <Row key={r.area} className="grid grid-cols-3">
            <span className="font-semibold">{r.area}</span>
            <span>{r.base}</span>
            <span className="text-[#B6FF3B]">{r.peak}</span>
          </Row>
        ))}
        <p className="px-1 text-[9px] text-white/45">One price list, shared with every approved channel.</p>
      </div>
    </Shot>
  );
}

export function ReportsMock() {
  const bars = [38, 52, 44, 66, 58, 80, 72];
  return (
    <Shot title="Reports">
      <div className="grid gap-2 sm:grid-cols-3">
        {[["Bookings", "318"], ["Revenue (GTV)", "₹4.8L"], ["Cancelled", "12"]].map(([label, value]) => (
          <Card key={label}>
            <p className="text-[8px] text-white/45">{label}</p>
            <p className="mt-1 text-sm font-extrabold">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-2">
        <p className="mb-2 text-[9px] font-semibold text-white/60">Bookings by day</p>
        <div className="flex h-24 items-end gap-2">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: EASE_EXPO }}
              className="flex-1 origin-bottom rounded-t-md bg-[#B6FF3B]/70"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </Card>
    </Shot>
  );
}

export function IntegrationsMock() {
  const rows = [
    { name: "PlayNow", status: "Connected", on: true },
    { name: "CourtClub", status: "Connected", on: true },
    { name: "Booking app C", status: "Waiting for your approval", on: false },
  ];
  return (
    <Shot title="Integrations">
      <div className="space-y-2">
        {rows.map((r) => (
          <Row key={r.name}>
            <span>
              <span className="block font-semibold">{r.name}</span>
              <span className="text-[9px] text-white/45">{r.status}</span>
            </span>
            <motion.span
              variants={{ hidden: { backgroundColor: "rgba(255,255,255,0.15)" }, shown: { backgroundColor: r.on ? "#B6FF3B" : "rgba(255,255,255,0.15)" } }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex h-4 w-8 items-center rounded-full p-0.5"
            >
              <motion.span variants={{ hidden: { x: 0 }, shown: { x: r.on ? 16 : 0 } }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }} className="h-3 w-3 rounded-full bg-[#071426]" />
            </motion.span>
          </Row>
        ))}
        <p className="px-1 text-[9px] text-white/45">Every connection starts with your approval.</p>
      </div>
    </Shot>
  );
}

export function StaffMock() {
  const staff = [
    { name: "Priya (Front desk)", perms: ["View bookings", "Add bookings"] },
    { name: "Karthik (Manager)", perms: ["View venues", "Edit venues", "View calendar"] },
    { name: "Divya (New)", perms: [] as string[] },
  ];
  return (
    <Shot title="Staff">
      <div className="space-y-2">
        {staff.map((s) => (
          <Card key={s.name}>
            <p className="text-[10px] font-bold">{s.name}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {s.perms.length ? s.perms.map((p) => <Chip key={p} tone="lime">{p}</Chip>) : <Chip>Nothing assigned</Chip>}
            </div>
          </Card>
        ))}
      </div>
    </Shot>
  );
}

export function ActivityMock() {
  const items = [
    { icon: "bell" as IconName, text: "New booking added for Turf A", when: "2 min ago" },
    { icon: "tag" as IconName, text: "Peak price updated for Court 1", when: "1 hr ago" },
    { icon: "users" as IconName, text: "Staff permissions changed", when: "Yesterday" },
    { icon: "plug" as IconName, text: "PlayNow connection approved", when: "2 days ago" },
  ];
  return (
    <Shot title="Notifications & activity log">
      <ul className="space-y-2">
        {items.map((i) => (
          <Row key={i.text}>
            <span className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#B6FF3B]/10 text-[#B6FF3B]">
                <Icon name={i.icon} className="h-3 w-3" />
              </span>
              {i.text}
            </span>
            <span className="shrink-0 text-[8px] text-white/40">{i.when}</span>
          </Row>
        ))}
      </ul>
    </Shot>
  );
}

export function SubscriptionMock() {
  return (
    <Shot title="Subscription">
      <div className="mb-3 flex items-center gap-2">
        <Chip tone="lime">Trial active</Chip>
        <span className="text-[9px] text-white/50">Plans, billing and trial status in one place</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {["Starter", "Growth"].map((name, i) => (
          <Card key={name} className={i === 1 ? "border-[#B6FF3B]/40" : ""}>
            <p className="text-[10px] font-bold">{name}</p>
            <div className="mt-2 space-y-1">
              <span className="block h-1.5 w-4/5 rounded-full bg-white/15" />
              <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
              <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />
            </div>
            <span className={`mt-3 inline-block rounded-full px-3 py-1 text-[9px] font-bold ${i === 1 ? "bg-[#B6FF3B] text-[#071426]" : "border border-white/20 text-white/70"}`}>
              {i === 1 ? "Current plan" : "Choose"}
            </span>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-[9px] text-white/45">Only owners see this page, staff never do.</p>
    </Shot>
  );
}
