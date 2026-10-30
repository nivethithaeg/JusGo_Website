"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useState } from "react";
import { AmbientParticles } from "@/components/motion/Ambient";
import { HeadlineReveal, HeroItem } from "@/components/motion/Hero";
import { HeroImage } from "@/components/motion/HeroImage";
import { Parallax, ParallaxDecor } from "@/components/motion/Scroll";
import { SportsBackdrop } from "@/components/motion/SportsBackdrop";
import { Highlight, ReadFill, ScrambleText, WordReveal } from "@/components/motion/Text";
import { ScrollProgress, SiteFooter, SiteNavbar } from "@/components/SiteChrome";
import {
  ActivityMock,
  AreasMock,
  BookingsMock,
  CalendarMock,
  Chip,
  DashboardMock,
  Icon,
  type IconName,
  IntegrationsMock,
  type MenuItem,
  PricingMock,
  ReportsMock,
  Shot,
  SidebarMock,
  StaffMock,
  SubscriptionMock,
  VenuesMock,
} from "@/components/venues/VenueMocks";
import { EASE_EXPO } from "@/lib/motion";
import { useHeroScroll } from "@/lib/useHeroScroll";

export function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, children, intro }: { eyebrow: string; children: ReactNode; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jg-600">
        <ScrambleText text={eyebrow} />
      </p>
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-[-0.055em] text-ink-900 sm:text-5xl">
        <WordReveal>{children}</WordReveal>
      </h2>
      {intro ? <ReadFill className="mt-5 text-sm leading-7 text-ink-900 sm:text-base" text={intro} /> : null}
    </div>
  );
}

/* ---------- hero ---------- */

function Hero() {
  const reduceMotion = useReducedMotion();
  const { ref, textStyle, visualStyle } = useHeroScroll();
  return (
    <section ref={ref} className="hero-backdrop relative isolate overflow-hidden px-5 pb-16 pt-16 text-white sm:px-8 sm:pb-24 lg:px-12 lg:pt-20">
      <HeroImage />
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-50" />
      <AmbientParticles />
      <motion.div
        animate={reduceMotion ? undefined : { scale: [0.9, 1.08, 0.9], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="lime-glow pointer-events-none absolute -right-36 top-0 h-[34rem] w-[34rem] rounded-full"
      />
      <div className="relative mx-auto grid max-w-[1160px] items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <motion.div style={textStyle} className="max-w-[600px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jg-lime">For venue owners</p>
          <HeadlineReveal
            lines={[{ text: "Your venues." }, { text: "One owner portal.", accent: true, alternates: ["One clear dashboard.", "One team, one menu."] }]}
            className="mt-5 text-balance font-display text-5xl font-extrabold leading-[.98] tracking-[-0.07em] sm:text-6xl lg:text-7xl"
          />
          <HeroItem kind="subtitle">
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Set up your venues, manage playing areas, bookings, staff and your plan from one place. Here is how the Venue Owner portal works, step by step.
            </p>
          </HeroItem>
          <HeroItem kind="cta" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#dashboard" className="rounded-full bg-jg-lime px-5 py-3.5 text-center text-xs font-bold text-jg-950 transition-transform hover:-translate-y-0.5">
              See the portal <span className="ml-2" aria-hidden="true">↓</span>
            </a>
            <a href="/contact" className="rounded-full border border-white/20 px-5 py-3.5 text-center text-xs font-semibold text-white transition-colors hover:bg-white/10">
              Talk to JusGo <span className="ml-2" aria-hidden="true">↗</span>
            </a>
          </HeroItem>
        </motion.div>
        <motion.div style={visualStyle} className="mx-auto w-full max-w-[560px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE_EXPO }}
          >
            <motion.div animate={reduceMotion ? undefined : { y: [0, -9, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <DashboardMock compact />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- marquee of portal pages ---------- */

const MARQUEE_WORDS = ["Dashboard", "Venues", "Playing areas", "Bookings", "Calendar", "Pricing", "Reports", "Integrations", "Staff", "Subscription"];

function PageMarquee() {
  const row = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-white/10 bg-[#071426] py-4 motion-reduce:hidden">
      <div className="venue-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                <span className="px-6">{word}</span>
                <span className="text-[#B6FF3B]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- onboarding ---------- */

const STEPS: { title: string; detail: string; icon: IconName }[] = [
  { title: "Personal details", detail: "Tell us who you are.", icon: "user" },
  { title: "Account type", detail: "Choose how you operate.", icon: "grid" },
  { title: "Documents", detail: "Upload what we need.", icon: "doc" },
  { title: "Self-verification", detail: "Confirm your identity.", icon: "shield" },
  { title: "Review & submit", detail: "Check it and send it in.", icon: "check" },
];

function Onboarding() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="onboarding" className="relative isolate bg-white px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="right" />
      <SportsBackdrop set="a" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead
          eyebrow="Getting started"
          intro="New owners are guided through five short steps. After you submit, our team reviews your application before the full portal opens."
        >
          From sign-up to <Highlight>live venue.</Highlight>
        </SectionHead>

        <div className="relative mt-14">
          <span aria-hidden="true" className="absolute left-0 right-0 top-6 hidden h-px bg-ink-900/10 md:block">
            <motion.span
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE_EXPO }}
              className="absolute inset-0 origin-left bg-jg-lime"
            />
          </span>
          <ol className="grid gap-6 md:grid-cols-5">
            {STEPS.map((step, index) => (
              <Rise key={step.title} delay={index * 0.1}>
                <li className="relative flex gap-4 md:block">
                  <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#B6FF3B]/30 bg-[#071426] text-[#B6FF3B] shadow-lg">
                    <span aria-hidden="true" className="step-ping" style={{ animationDelay: `${index * 0.7}s` }} />
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>
                  <div className="md:mt-4">
                    <p className="font-mono text-[10px] text-jg-600">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-0.5 text-base font-bold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-900/60">{step.detail}</p>
                  </div>
                </li>
              </Rise>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Rise>
            <Shot title="Pending review" className="h-full">
              <div className="mb-3 flex items-center gap-2">
                <Chip tone="amber">Pending review</Chip>
                <Icon name="clock" className="h-3.5 w-3.5 text-white/50" />
              </div>
              <div className="relative space-y-2" aria-hidden="true">
                {[78, 62, 70].map((w, i) => (
                  <span key={i} className="block h-6 rounded-lg bg-white/[0.06]" style={{ width: `${w}%` }} />
                ))}
                <span className="absolute inset-0 grid place-items-center rounded-lg bg-[#071426]/55 backdrop-blur-[1px]">
                  <Icon name="lock" className="h-6 w-6 text-[#B6FF3B]" />
                </span>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-white/65">You can look around every page, but actions stay locked until your application is approved.</p>
            </Shot>
          </Rise>
          <Rise delay={0.1}>
            <Shot title="Approved" className="h-full">
              <div className="mb-3 flex items-center gap-2">
                <Chip tone="lime">Approved</Chip>
              </div>
              <div className="grid grid-cols-2 gap-2" aria-hidden="true">
                {["Dashboard", "Venues", "Bookings", "Calendar"].map((label) => (
                  <span key={label} className="rounded-lg bg-white/[0.06] px-2 py-2 text-[9px] text-white/80">{label}</span>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-5 text-white/65">The full portal opens, filtered to what each person is allowed to do.</p>
            </Shot>
          </Rise>
          <Rise delay={0.2}>
            <Shot title="Application status" className="h-full">
              <div className="mb-3 flex items-center gap-2">
                <Chip tone="red">Needs attention</Chip>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-[10px] text-white/70" aria-hidden="true">
                <p className="font-semibold text-white">Where your application stands</p>
                <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-white/15" />
                <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-white/10" />
              </div>
              <p className="mt-3 text-[11px] leading-5 text-white/65">If an application isn&apos;t approved, a status page explains where things stand.</p>
            </Shot>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ---------- dashboard ---------- */

const DASH_POINTS: { title: string; text: string }[] = [
  { title: "Your owner code", text: "A short public code, like JGO-7X9QVZ. Quote it to support or booking partners." },
  { title: "Add booking in one click", text: "Opens Bookings with the add form ready, for anyone allowed to create bookings." },
  { title: "Eight numbers at a glance", text: "Venues, playing areas, today's and upcoming bookings, completed, cancelled, revenue and open slots. Revenue is for owners only." },
  { title: "Trends and status", text: "A 30-day booking line and a status donut, built from your own venues only." },
  { title: "Still readable when a plan ends", text: "Numbers stay visible, actions grey out, and a notice points you to Subscription." },
];

function DashboardSection() {
  return (
    <section id="dashboard" className="relative isolate bg-mist-50 px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="left" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead eyebrow="Your dashboard" intro="Open the portal and see how your venues are doing before you click anything.">
          Everything that matters, <Highlight>first.</Highlight>
        </SectionHead>
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.35fr_.65fr]">
          <Parallax distance={26}>
          <Rise>
            <DashboardMock />
            <p className="mt-3 text-center text-[11px] text-ink-900/45">Illustration with sample data.</p>
          </Rise>
          </Parallax>
          <ul className="space-y-5">
            {DASH_POINTS.map((point, index) => (
              <Rise key={point.title} delay={index * 0.08}>
                <li className="flex gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-jg-lime/25 text-jg-600">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{point.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-ink-900/60">{point.text}</span>
                  </span>
                </li>
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- portal explorer ---------- */

type PortalPage = { id: string; label: string; icon: IconName; text: string; mock: ReactNode };

const PAGES: PortalPage[] = [
  { id: "venues", label: "Venues", icon: "pin", text: "List, create and edit your venues.", mock: <VenuesMock /> },
  { id: "areas", label: "Playing areas", icon: "grid", text: "Courts or turfs inside a venue, with pricing, roof type and turf shape.", mock: <AreasMock /> },
  { id: "bookings", label: "Bookings", icon: "ticket", text: "See every booking and add new ones. This is the only place bookings are made.", mock: <BookingsMock /> },
  { id: "calendar", label: "Calendar", icon: "calendar", text: "Your bookings laid out day by day.", mock: <CalendarMock /> },
  { id: "pricing", label: "Pricing", icon: "tag", text: "Keep the price of each playing area in one place.", mock: <PricingMock /> },
  { id: "reports", label: "Reports", icon: "chart", text: "Review how your venues are performing.", mock: <ReportsMock /> },
  { id: "integrations", label: "Integrations", icon: "plug", text: "Manage the channels connected to your venues. Every connection starts with your approval.", mock: <IntegrationsMock /> },
  { id: "staff", label: "Staff", icon: "users", text: "Add staff and choose exactly what each person can do.", mock: <StaffMock /> },
  { id: "activity", label: "Notifications & activity", icon: "bell", text: "Stay on top of notifications and review the activity log.", mock: <ActivityMock /> },
  { id: "subscription", label: "Subscription", icon: "card", text: "Plans, billing and trial status. Owners only.", mock: <SubscriptionMock /> },
];

function Explorer() {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const page = PAGES[selected];
  return (
    <section id="portal" className="relative isolate bg-white px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="right" />
      <SportsBackdrop set="b" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead eyebrow="Inside the portal" intro="Pick a page to see what it does. The screens below are illustrated sample layouts.">
          One menu, <Highlight>every task.</Highlight>
        </SectionHead>

        <div className="mt-12 grid gap-6 lg:grid-cols-[250px_1fr]">
          <div
            role="tablist"
            aria-label="Portal pages"
            aria-orientation="vertical"
            className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {PAGES.map((item, index) => {
              const active = index === selected;
              return (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  id={`tab-${item.id}`}
                  aria-selected={active}
                  aria-controls="portal-panel"
                  onClick={() => setSelected(index)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                    active ? "border-[#B6FF3B]/40 bg-[#071426] text-white" : "border-ink-900/10 bg-white text-ink-900/70 hover:border-ink-900/25"
                  }`}
                >
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${active ? "bg-[#B6FF3B]/15 text-[#B6FF3B]" : "bg-ink-900/5 text-ink-900/60"}`}>
                    <Icon name={item.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div id="portal-panel" role="tabpanel" aria-labelledby={`tab-${page.id}`} className="min-h-[27rem] min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={page.id}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h3 className="font-display text-2xl font-extrabold tracking-[-0.04em]">{page.label}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-900/65">{page.text}</p>
                <div className="mt-5">{page.mock}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- owners vs staff ---------- */

const OWNER_MENU: MenuItem[] = [
  { label: "Dashboard", icon: "home" },
  { label: "Venues", icon: "pin" },
  { label: "Playing areas", icon: "grid" },
  { label: "Bookings", icon: "ticket" },
  { label: "Calendar", icon: "calendar" },
  { label: "Pricing", icon: "tag" },
  { label: "Reports", icon: "chart" },
  { label: "Integrations", icon: "plug" },
  { label: "Staff", icon: "users" },
  { label: "Subscription", icon: "card" },
  { label: "Settings", icon: "gear" },
];

const STAFF_MENU: MenuItem[] = OWNER_MENU.map((item) => ({
  ...item,
  hidden: item.label === "Subscription",
  locked: !["Dashboard", "Bookings", "Calendar"].includes(item.label) && item.label !== "Subscription",
}));

const ROLE_POINTS = [
  "Owners have full access to every page.",
  "Staff get only the permissions the owner grants, such as viewing venues or adding bookings.",
  "Staff never see the owner's personal or verification details, and revenue stays with owners.",
  "Staff with nothing assigned see a clear “Nothing assigned” message instead of a broken page.",
];

function Roles() {
  return (
    <section id="roles" className="relative isolate bg-mist-50 px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="left" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead eyebrow="Owners and staff" intro="Give your team access to the work, and keep the rest to yourself.">
          The right menu for <Highlight>every person.</Highlight>
        </SectionHead>
        <div className="mt-12 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr]">
          <Parallax distance={24}>
            <Rise>
              <SidebarMock title="Owner view" items={OWNER_MENU} note="Full menu, every page open." />
            </Rise>
          </Parallax>
          <Parallax distance={-24}>
            <Rise delay={0.1}>
              <SidebarMock title="Staff view" items={STAFF_MENU} note="Locked items are the ones the owner hasn't granted." />
            </Rise>
          </Parallax>
          <ul className="space-y-4 md:col-span-2 lg:col-span-1">
            {ROLE_POINTS.map((text, index) => (
              <Rise key={text} delay={index * 0.08}>
                <li className="flex gap-3 text-sm leading-6 text-ink-900/70">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-jg-lime/25 text-jg-600">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {text}
                </li>
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- access states ---------- */

const EXPIRED_MENU: MenuItem[] = OWNER_MENU.map((item) => ({
  ...item,
  locked: !["Dashboard", "Subscription"].includes(item.label),
}));

function AccessStates() {
  return (
    <section id="access" className="relative isolate bg-white px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="right" />
      <SportsBackdrop set="c" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead eyebrow="Always clear" intro="The portal always tells you where you stand, and never opens a page it can't confirm you should see.">
          No guessing about <Highlight>access.</Highlight>
        </SectionHead>
        <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
          <Rise>
            <SidebarMock title="When a plan ends" items={EXPIRED_MENU} note="Dashboard stays readable and Subscription stays open. Everything else points you to Subscription." />
          </Rise>
          <Rise delay={0.1}>
            <Shot title="Couldn't verify access" className="h-full">
              <div className="grid place-items-center py-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-400/15 text-red-300">
                  <Icon name="shield" className="h-6 w-6" />
                </span>
                <p className="mt-3 text-[12px] font-bold">Unverified</p>
                <p className="mt-1 max-w-[200px] text-[10px] leading-5 text-white/55">We couldn&apos;t confirm your access just now.</p>
                <span className="mt-3 rounded-full bg-[#B6FF3B] px-3 py-1.5 text-[9px] font-bold text-[#071426]">Try again</span>
              </div>
              <p className="border-t border-white/10 pt-3 text-[10px] leading-5 text-white/55">A failed check never opens a protected page. You get a retry button instead.</p>
            </Shot>
          </Rise>
          <Rise delay={0.2}>
            <Shot title="Staff without permission" className="h-full">
              <div className="grid place-items-center py-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/15 text-amber-300">
                  <Icon name="lock" className="h-6 w-6" />
                </span>
                <p className="mt-3 text-[12px] font-bold">Access denied</p>
                <p className="mt-1 max-w-[200px] text-[10px] leading-5 text-white/55">Ask the owner to grant you access to this page.</p>
              </div>
              <p className="border-t border-white/10 pt-3 text-[10px] leading-5 text-white/55">Staff land on the first page they are allowed to use, and the same rules are enforced by the system behind the portal.</p>
            </Shot>
          </Rise>
        </div>
      </div>
    </section>
  );
}

export function VenueOwnerPage() {
  return (
    <>
      <ScrollProgress />
      <SiteNavbar currentPage="venues" />
      <main className="pt-20">
        <Hero />
        <PageMarquee />
        <Onboarding />
        <DashboardSection />
        <Explorer />
        <Roles />
        <AccessStates />
      </main>
      <SiteFooter />
    </>
  );
}
