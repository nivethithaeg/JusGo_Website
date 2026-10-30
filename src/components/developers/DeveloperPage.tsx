"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useState } from "react";
import {
  ApiCodeMock,
  ApiKeyMock,
  ApiLogsMock,
  DevBookingsMock,
  DevHomeMock,
  DevTeamMock,
  DocsHelpMock,
  GoLiveMock,
  RateLimitMock,
  SyncDiagram,
  SyncModesMock,
  VenueAccessMock,
  VerifyMock,
  WebhookMock,
} from "@/components/developers/DeveloperMocks";
import { AmbientParticles } from "@/components/motion/Ambient";
import { HeadlineReveal, HeroItem } from "@/components/motion/Hero";
import { HeroImage } from "@/components/motion/HeroImage";
import { Parallax, ParallaxDecor } from "@/components/motion/Scroll";
import { SportsBackdrop } from "@/components/motion/SportsBackdrop";
import { Highlight } from "@/components/motion/Text";
import { ScrollProgress, SiteFooter, SiteNavbar } from "@/components/SiteChrome";
import { ActivityMock, Icon, type IconName, type MenuItem, SidebarMock, SubscriptionMock } from "@/components/venues/VenueMocks";
import { Rise, SectionHead } from "@/components/venues/VenueOwnerPage";
import { EASE_EXPO } from "@/lib/motion";
import { useHeroScroll } from "@/lib/useHeroScroll";

/* ---------- hero ---------- */

function Hero() {
  const reduceMotion = useReducedMotion();
  const { ref, textStyle, visualStyle } = useHeroScroll();
  return (
    <section ref={ref} className="hero-backdrop relative isolate overflow-hidden px-5 pb-16 pt-16 text-white sm:px-8 sm:pb-24 lg:px-12 lg:pt-20">
      <HeroImage src="/assets/developers-bg.jpg" width={625} height={350} position="50% 85%" />
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-50" />
      <AmbientParticles />
      <motion.div
        animate={reduceMotion ? undefined : { scale: [0.9, 1.08, 0.9], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="lime-glow pointer-events-none absolute -right-36 top-0 h-[34rem] w-[34rem] rounded-full"
      />
      <div className="relative mx-auto grid max-w-[1160px] items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <motion.div style={textStyle} className="max-w-[600px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jg-lime">For developers</p>
          <HeadlineReveal
            lines={[{ text: "One integration." }, { text: "Every slot, in sync.", accent: true, alternates: ["Sold once.", "Blocked everywhere."] }]}
            className="mt-5 text-balance font-display text-5xl font-extrabold leading-[.98] tracking-[-0.07em] sm:text-6xl lg:text-7xl"
          />
          <HeroItem kind="subtitle">
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Built for companies that run a booking app. Connect it to JusGo so a turf slot is sold once and blocked everywhere. Here is how the Developer portal and the Partner API work.
            </p>
          </HeroItem>
          <HeroItem kind="cta" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#journey" className="rounded-full bg-jg-lime px-5 py-3.5 text-center text-xs font-bold text-jg-950 transition-transform hover:-translate-y-0.5">
              See the five steps <span className="ml-2" aria-hidden="true">↓</span>
            </a>
            <a href="/contact" className="rounded-full border border-white/20 px-5 py-3.5 text-center text-xs font-semibold text-white transition-colors hover:bg-white/10">
              Talk to JusGo <span className="ml-2" aria-hidden="true">↗</span>
            </a>
          </HeroItem>
        </motion.div>
        <motion.div style={visualStyle} className="mx-auto w-full max-w-[520px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE_EXPO }}
          >
            <motion.div animate={reduceMotion ? undefined : { y: [0, -9, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <DevHomeMock />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- marquee ---------- */

const MARQUEE_WORDS = ["API Setup", "Webhooks", "Venues", "Verify Integration", "Go Live", "Bookings", "API Logs", "Documentation"];

function Marquee() {
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

/* ---------- the five-step journey ---------- */

type Step = { title: string; page: string; text: string; points?: string[]; visual: ReactNode };

const STEPS: Step[] = [
  {
    title: "Create a project and a sandbox key",
    page: "API Setup",
    text: "Each project is one app. Create one and generate a sandbox API key. The key is shown once, and JusGo doesn't store it in a readable form, so copy it when you see it.",
    visual: <ApiKeyMock />,
  },
  {
    title: "Register your webhook",
    page: "Webhook / API Setup",
    text: "Add an HTTPS webhook URL and choose the events you want. Rotate signing secrets whenever you need to, send a test, and read the delivery log. Then choose how bookings stay in sync.",
    visual: (
      <div className="space-y-4">
        <WebhookMock />
        <SyncModesMock />
      </div>
    ),
  },
  {
    title: "Get access to venues",
    page: "Venues",
    text: "Request access to a turf owner's venues. The owner approves, and until they do, those venues don't appear in the API. Map venue and playing-area IDs to your own IDs by hand or with automatic matching.",
    visual: <VenueAccessMock />,
  },
  {
    title: "Verify in the sandbox",
    page: "Verify Integration",
    text: "Run the sandbox checks: list venues, check availability and a booking dry run. Nothing real is booked while you test.",
    visual: <VerifyMock />,
  },
  {
    title: "Go live",
    page: "Go Live",
    text: "JusGo approves the project for production and you create a production key. Follow the rules below so a slot is never sold twice.",
    points: [
      "Hold the slot before you take payment.",
      "Treat a 409 SLOT_TAKEN as “don't charge the customer”.",
      "Process the webhooks you receive.",
      "Report every booking and cancellation.",
    ],
    visual: <GoLiveMock />,
  },
];

function Journey() {
  return (
    <section id="journey" className="relative isolate bg-white px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="right" />
      <SportsBackdrop set="a" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead
          eyebrow="Your integration journey"
          intro="Five steps take you from a first key to live bookings. The home page of the portal tracks your progress as a checklist."
        >
          From first key to <Highlight>live bookings.</Highlight>
        </SectionHead>

        <ol className="mt-16 space-y-24 lg:space-y-32">
          {STEPS.map((step, index) => {
            const flip = index % 2 === 1;
            return (
              <li key={step.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={flip ? "lg:order-2" : ""}>
                  <Parallax distance={flip ? -34 : 34}>
                    <Rise>{step.visual}</Rise>
                  </Parallax>
                </div>
                <div className={flip ? "lg:order-1" : ""}>
                  <Parallax distance={12}>
                    <Rise delay={0.1}>
                      <p className="font-mono text-xs font-bold text-jg-600">Step {String(index + 1).padStart(2, "0")} · {step.page}</p>
                      <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-[-0.045em] sm:text-4xl">{step.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-ink-900/65 sm:text-base">{step.text}</p>
                      {step.points ? (
                        <ul className="mt-5 space-y-2.5">
                          {step.points.map((point) => (
                            <li key={point} className="flex gap-3 text-sm leading-6 text-ink-900/75">
                              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-jg-lime/25 text-jg-600">
                                <Icon name="check" className="h-3 w-3" />
                              </span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </Rise>
                  </Parallax>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- slots stay in sync ---------- */

const SYNC_POINTS = [
  "Each turf has one calendar.",
  "A booking made on any platform is pushed to all the others with signed webhooks.",
  "The events are booking.held, booking.confirmed, booking.cancelled and booking.expired.",
  "Repeats are ignored using the X-JusGo-Delivery header, so handling a webhook twice is safe.",
];

function SyncSection() {
  return (
    <section id="sync" className="relative isolate bg-mist-50 px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="left" />
      <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <SectionHead eyebrow="Sold once, blocked everywhere" intro="That is the promise. This is how it happens.">
            One calendar, <Highlight>every platform.</Highlight>
          </SectionHead>
          <ul className="mt-8 space-y-4">
            {SYNC_POINTS.map((point, index) => (
              <Rise key={point} delay={index * 0.08}>
                <li className="flex gap-3 text-sm leading-6 text-ink-900/70">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-jg-lime/25 text-jg-600">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {point}
                </li>
              </Rise>
            ))}
          </ul>
        </div>
        <Parallax distance={32}>
          <Rise>
            <SyncDiagram />
          </Rise>
        </Parallax>
      </div>
    </section>
  );
}

/* ---------- the Partner API ---------- */

function ApiSection() {
  return (
    <section id="api" className="relative isolate bg-white px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="right" />
      <SportsBackdrop set="b" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead eyebrow="The Partner API" intro="This is what your app calls. Authenticate with an API key in a header, and use a sandbox key until you are ready for production.">
          Simple to call, <Highlight>safe to test.</Highlight>
        </SectionHead>
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <Parallax distance={-24}>
            <Rise>
              <ApiCodeMock />
            </Rise>
          </Parallax>
          <Parallax distance={30}>
            <Rise delay={0.1}>
              <RateLimitMock />
            </Rise>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

/* ---------- the rest of the portal ---------- */

type PortalPage = { id: string; label: string; icon: IconName; text: string; mock: ReactNode };

const PAGES: PortalPage[] = [
  { id: "home", label: "Home", icon: "grid", text: "A welcome banner with your developer ID and a five-step setup checklist that tracks your go-live progress.", mock: <DevHomeMock /> },
  { id: "bookings", label: "Bookings & connected venues", icon: "list", text: "See what has synced and which venue owners you are linked to.", mock: <DevBookingsMock /> },
  { id: "logs", label: "API logs", icon: "code", text: "Your request history, so you can see what your app sent and what came back.", mock: <ApiLogsMock /> },
  { id: "docs", label: "Documentation & help", icon: "help", text: "The documentation, plus a help chat for API questions.", mock: <DocsHelpMock /> },
  { id: "activity", label: "Notifications & activity", icon: "bell", text: "Your account feeds for notifications and a record of what happened.", mock: <ActivityMock /> },
  { id: "team", label: "Team members", icon: "users", text: "Add teammates as integration viewers with only the permissions they need. Owner only.", mock: <DevTeamMock /> },
  { id: "subscription", label: "Subscription", icon: "key", text: "Billing and plan. Owner only.", mock: <SubscriptionMock /> },
];

function Explorer() {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const page = PAGES[selected];
  return (
    <section id="portal" className="relative isolate bg-mist-50 px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="left" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead eyebrow="Inside the portal" intro="Beyond the five steps, the portal gives you a home for everything about your integration. The screens are illustrated sample layouts.">
          Everything about your integration, <Highlight>in one place.</Highlight>
        </SectionHead>
        <div className="mt-12 grid gap-6 lg:grid-cols-[270px_1fr]">
          <div role="tablist" aria-label="Developer portal pages" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {PAGES.map((item, index) => {
              const active = index === selected;
              return (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  id={`dev-tab-${item.id}`}
                  aria-selected={active}
                  aria-controls="dev-panel"
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
          <div id="dev-panel" role="tabpanel" aria-labelledby={`dev-tab-${page.id}`} className="min-h-[27rem] min-w-0">
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

/* ---------- approval and access ---------- */

const ONBOARDING_STEPS = ["Personal details", "Company details", "App details", "Self-verification", "Review & submit", "Application status"];

const OWNER_MENU: MenuItem[] = [
  { label: "Home", icon: "home" },
  { label: "API Setup", icon: "key" },
  { label: "Webhooks", icon: "webhook" },
  { label: "Venues", icon: "pin" },
  { label: "Verify Integration", icon: "check" },
  { label: "Go Live", icon: "globe" },
  { label: "Bookings", icon: "list" },
  { label: "API Logs", icon: "code" },
  { label: "Documentation", icon: "doc" },
  { label: "Team Members", icon: "users" },
  { label: "Subscription", icon: "card" },
  { label: "Profile", icon: "user" },
];

const VIEWER_MENU: MenuItem[] = OWNER_MENU.map((item) => ({
  ...item,
  hidden: ["Team Members", "Subscription", "Profile"].includes(item.label),
  locked: ["API Setup", "Webhooks", "Go Live"].includes(item.label),
}));

const ACCESS_POINTS = [
  "Until JusGo approves your company application, no developer data loads.",
  "The company owner can touch keys, webhooks and billing. Nobody else can.",
  "Staff join as integration viewers, limited to the permissions the owner grants.",
  "Staff never see Team Members, Subscription or Profile.",
];

function Access() {
  return (
    <section id="access" className="relative isolate bg-white px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
      <ParallaxDecor side="right" />
      <SportsBackdrop set="c" />
      <div className="mx-auto max-w-[1160px]">
        <SectionHead eyebrow="Approval and access" intro="You start with a short application. After approval, the full portal opens, filtered to what each person is allowed to do.">
          Safe by <Highlight>design.</Highlight>
        </SectionHead>

        <Rise className="mt-12">
          <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ONBOARDING_STEPS.map((label, index) => (
              <li key={label} className="rounded-2xl border border-[#B6FF3B]/20 bg-[#071426] p-4 text-white">
                <p className="font-mono text-[10px] text-[#B6FF3B]">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-xs font-bold leading-5">{label}</p>
              </li>
            ))}
          </ol>
        </Rise>

        <div className="mt-12 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr]">
          <Parallax distance={24}>
            <Rise>
              <SidebarMock title="Company owner" items={OWNER_MENU} note="Every page, every setting." />
            </Rise>
          </Parallax>
          <Parallax distance={-24}>
            <Rise delay={0.1}>
              <SidebarMock title="Integration viewer" items={VIEWER_MENU} note="Locked pages are for the owner only." />
            </Rise>
          </Parallax>
          <ul className="space-y-4 md:col-span-2 lg:col-span-1">
            {ACCESS_POINTS.map((text, index) => (
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

export function DeveloperPage() {
  return (
    <>
      <ScrollProgress />
      <SiteNavbar currentPage="developers" />
      <main className="pt-20">
        <Hero />
        <Marquee />
        <Journey />
        <SyncSection />
        <ApiSection />
        <Explorer />
        <Access />
      </main>
      <SiteFooter />
    </>
  );
}
