"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { CONTACT_EMAIL } from "@/lib/contact";
import { ContactExperience } from "@/components/contact/ContactExperience";
import { EditorialIntro } from "@/components/contact/EditorialIntro";
import { CardRise, FlipIn, InteractiveCard, SlideIn } from "@/components/motion/Cards";
import { ConfettiBurst, DrawDivider, GlowShift, IconBadge } from "@/components/motion/Finale";
import { HeroImage } from "@/components/motion/HeroImage";
import { AmbientParticles } from "@/components/motion/Ambient";
import { ParallaxDecor } from "@/components/motion/Scroll";
import { Magnetic } from "@/components/motion/Interactions";
import { CinematicHeading, Highlight, ReadFill, ScrambleText, WordReveal } from "@/components/motion/Text";
import { HeadlineReveal, HeroItem } from "@/components/motion/Hero";
import { ScrollProgress, SiteFooter, SiteNavbar } from "@/components/SiteChrome";
import { EASE as ease } from "@/lib/motion";
import { useHeroScroll } from "@/lib/useHeroScroll";
const contactEmail = CONTACT_EMAIL;

function FadeIn({
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
      viewport={{ once: true, amount: 0.2 }}
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

function PageShell({
  page,
  children,
}: {
  page: "team" | "contact";
  children: ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <SiteNavbar currentPage={page} />
      <main className="min-h-screen pt-20">{children}</main>
      <SiteFooter />
    </>
  );
}

function OrbitIllustration() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[410px]" aria-hidden="true">
      <div className="absolute inset-[8%] rounded-full border border-jg-lime/10" />
      <div className="absolute inset-[20%] rounded-full border border-jg-lime/15" />
      <div className="absolute inset-[32%] rounded-full border border-jg-lime/20" />
      <div className="lime-glow absolute inset-[15%] rounded-full" />
      <motion.div
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[8%] rounded-full border border-dashed border-white/10"
      >
        <motion.span
          animate={reduceMotion ? undefined : { scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[13%] top-[15%] h-3 w-3 rounded-full bg-jg-lime shadow-lime"
        />
        <span className="absolute bottom-[13%] right-[8%] h-2.5 w-2.5 rounded-full bg-info-500 shadow-lg shadow-info-500/40" />
      </motion.div>
      <motion.div
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[20%] rounded-full border border-dashed border-jg-lime/20"
      >
        <span className="absolute right-[5%] top-[21%] h-2 w-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/40" />
        <motion.span
          animate={reduceMotion ? undefined : { scale: [1, 1.35, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[4%] left-[28%] h-2.5 w-2.5 rounded-full bg-jg-400"
        />
      </motion.div>
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 grid h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[28%] border border-white/15 bg-jg-900/90 p-3 shadow-2xl backdrop-blur-xl"
      >
        <div className="w-full rounded-2xl bg-white p-2"><img src="/assets/jusgo-logo.png" alt="" width={557} height={418} className="w-full" /></div>
        <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.17em] text-jg-lime">One connected game</span>
      </motion.div>
      <span className="absolute left-[6%] top-[47%] rounded-full border border-white/10 bg-jg-950/85 px-3 py-2 text-[9px] text-white/70">Venues</span>
      <span className="absolute right-[2%] top-[35%] rounded-full border border-white/10 bg-jg-950/85 px-3 py-2 text-[9px] text-white/70">Booking apps</span>
      <span className="absolute bottom-[8%] left-[34%] rounded-full border border-white/10 bg-jg-950/85 px-3 py-2 text-[9px] text-white/70">Players</span>
    </div>
  );
}

const teamPrinciples = [
  {
    icon: "◎",
    title: "Start with real needs",
    description: "We build around the people managing venues, creating booking experiences, and looking for their next game.",
  },
  {
    icon: "⟷",
    title: "Make every connection count",
    description: "Clear permissions and shared rules help venues and platforms work together without losing control.",
  },
  {
    icon: "✳",
    title: "Keep the experience in play",
    description: "From discovery to booking, we want the details to stay in sync so people can focus on getting out to play.",
  },
];

const teamDisciplines = [
  { index: "01", label: "Product & experience", detail: "Making complex booking workflows feel straightforward.", color: "bg-jg-lime" },
  { index: "02", label: "Engineering & integrations", detail: "Building the dependable connections behind every booking.", color: "bg-info-500" },
  { index: "03", label: "Venue partnerships", detail: "Working alongside the people who bring places to play to life.", color: "bg-amber-500" },
];

const TEAM_ART = ["cricket", "tennis", "football"] as const;

export function TeamPage() {
  const reduceMotion = useReducedMotion();
  const { ref, textStyle, visualStyle } = useHeroScroll();
  return (
    <PageShell page="team">
      <section ref={ref} className="hero-backdrop relative isolate overflow-hidden px-5 pb-20 pt-16 text-white sm:px-8 sm:pb-24 lg:px-12 lg:pt-20">
        <HeroImage src="/assets/team-bg.jpg" width={629} height={360} position="55% 40%" />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-50" />
        <AmbientParticles />
        <motion.div
          animate={reduceMotion ? undefined : { x: [0, 25, 0], y: [0, -16, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="lime-glow pointer-events-none absolute -right-36 top-10 h-[34rem] w-[34rem] rounded-full"
        />
        <div className="relative mx-auto grid max-w-[1160px] items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div style={textStyle} className="max-w-[620px]">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
              <Eyebrow light>The team behind JusGo</Eyebrow>
            </motion.div>
            <HeadlineReveal
              lines={[{ text: "Better play takes" }, { text: "a team.", accent: true }]}
              className="mt-5 text-balance font-display text-5xl font-extrabold leading-[.98] tracking-[-0.07em] sm:text-6xl lg:text-7xl"
            />
            <HeroItem kind="subtitle">
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                JusGo is being built to bring sports venues and booking platforms closer together—with thoughtful technology and a shared focus on making every booking work better.
              </p>
            </HeroItem>
            <HeroItem kind="cta" className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-jg-lime px-5 py-3.5 text-xs font-bold text-jg-950 transition-transform hover:-translate-y-0.5"
              >
                Get to know us <span aria-hidden="true">→</span>
              </a>
            </HeroItem>
          </motion.div>
          <motion.div style={visualStyle}>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease }}
            className="mx-auto w-full max-w-[440px]"
          >
            <OrbitIllustration />
          </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative isolate bg-mist-50 px-5 py-20 text-ink-900 sm:px-8 sm:py-28 lg:px-12">
        <ParallaxDecor side="right" />
        <DrawDivider />
        <div className="mx-auto max-w-[1160px]">
          <FadeIn>
            <div className="max-w-2xl">
              <Eyebrow>What brings us together</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-[-0.055em] sm:text-5xl"><WordReveal>One <Highlight>connected</Highlight> experience, built from every side of the game.</WordReveal></h2>
              <ReadFill className="mt-5 text-sm leading-7 text-ink-900/65 sm:text-base" text={"Behind JusGo is work across product, technology, and partnerships. We bring those perspectives together to solve the everyday gaps between running a venue and booking one."} />
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {teamPrinciples.map((principle, index) => (
              <FlipIn key={principle.title} index={index} className="h-full">
                <InteractiveCard tilt={5} art={TEAM_ART[index % TEAM_ART.length]} className="h-full rounded-2xl border border-[#B6FF3B]/15 bg-[#071426] p-6 text-white shadow-[0_22px_50px_-22px_rgba(7,20,38,0.8)] sm:p-7">
                  <IconBadge tone="stadium">{principle.icon}</IconBadge>
                  <h3 className="mt-6 text-base font-bold">{principle.title}</h3>
                  <CardRise order={1} className="mt-3"><p className="text-sm leading-6 text-white/65">{principle.description}</p></CardRise>
                </InteractiveCard>
              </FlipIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <DrawDivider />
        <div className="mx-auto max-w-[1160px]">
          <FadeIn>
            <Eyebrow>How we work</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-[-0.055em] text-ink-900 sm:text-5xl"><CinematicHeading lead="Different disciplines." tail="One" accent="shared goal." /></h2>
          </FadeIn>
          <div className="mt-9 divide-y divide-jg-900/10 border-y border-jg-900/10">
            {teamDisciplines.map((discipline, index) => (
              <SlideIn key={discipline.index} index={index}>
                <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.25, ease }} className="grid gap-3 py-6 sm:grid-cols-[70px_1fr_1fr] sm:items-center sm:py-7">
                  <span className={`h-2 w-2 rounded-full ${discipline.color}`} />
                  <div className="flex items-center gap-4"><span className="font-mono text-[10px] text-jg-600">{discipline.index}</span><h3 className="text-base font-bold text-ink-900 sm:text-lg">{discipline.label}</h3></div>
                  <p className="text-sm leading-6 text-ink-900/60">{discipline.detail}</p>
                </motion.div>
              </SlideIn>
            ))}
          </div>
          <FadeIn className="mt-9">
            <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-jg-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
              <div><p className="text-lg font-bold">Want to build a more connected game with us?</p><p className="mt-2 text-sm text-white/55">We’d love to hear what you’re working on.</p></div>
              <a href="/contact" className="shrink-0 rounded-full bg-jg-lime px-5 py-3 text-xs font-bold text-jg-950 hover:-translate-y-0.5">Start a conversation <span aria-hidden="true">→</span></a>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageShell>
  );
}

const contactOptions = [
  {
    title: "I run a venue",
    description: "Talk to us about managing your venue and connecting with booking platforms.",
    subject: "JusGo venue partnership",
    icon: "⌖",
  },
  {
    title: "I build a booking app",
    description: "Ask about integrations, API access, or getting your platform connected.",
    subject: "JusGo platform integration",
    icon: "⌘",
  },
  {
    title: "Something else",
    description: "Partnerships, questions, or just figuring out where to start—we’re listening.",
    subject: "JusGo general inquiry",
    icon: "✳",
  },
];

const CONTACT_ART = ["tennis", "football", "cricket"] as const;

export function ContactPage() {
  const reduceMotion = useReducedMotion();
  const { ref, textStyle } = useHeroScroll();
  return (
    <PageShell page="contact">
      <section ref={ref} className="hero-backdrop relative isolate overflow-hidden px-5 pb-16 pt-16 text-white sm:px-8 sm:pb-20 lg:px-12 lg:pt-20">
        <HeroImage src="/assets/contact-bg.jpg" width={718} height={427} position="50% 85%" />
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-50" />
        <AmbientParticles />
        <motion.div
          animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="lime-glow pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full"
        />
        <motion.div style={textStyle} className="relative mx-auto max-w-[880px] text-center">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <Eyebrow light>Get in touch</Eyebrow>
          </motion.div>
          <HeadlineReveal
            lines={[{ text: "Let’s get your side" }, { text: "in the game.", accent: true }]}
            className="mt-5 text-balance font-display text-5xl font-extrabold leading-[.98] tracking-[-0.07em] sm:text-6xl lg:text-7xl"
          />
          <HeroItem kind="subtitle">
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">Whether you run a venue, build a booking app, or want to explore a partnership, start a conversation with the JusGo team.</p>
          </HeroItem>
          <HeroItem kind="cta" className="mt-8">
            <Magnetic><a href={`mailto:${contactEmail}?subject=Hello%20JusGo`} data-cursor="Write" className="inline-flex items-center gap-2 rounded-full bg-jg-lime px-6 py-3.5 text-xs font-bold text-jg-950 transition-transform hover:-translate-y-0.5">
              Email the JusGo team <span aria-hidden="true">↗</span>
            </a></Magnetic>
          </HeroItem>
        </motion.div>
      </section>

      <EditorialIntro />

      <ContactExperience />

      <section className="relative isolate bg-mist-50 px-5 py-16 text-ink-900 sm:px-8 sm:py-24 lg:px-12">
        <ParallaxDecor side="left" />
        <DrawDivider />
        <div className="mx-auto max-w-[1160px]">
          <FadeIn className="text-center">
            <Eyebrow>Choose your conversation</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.055em] sm:text-4xl"><WordReveal>What brings you to <Highlight>JusGo?</Highlight></WordReveal></h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-900/60">Pick the path that fits. Each link opens an email draft addressed to our team.</p>
          </FadeIn>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {contactOptions.map((option, index) => (
              <FlipIn key={option.title} index={index} className="h-full">
                <InteractiveCard tilt={5} art={CONTACT_ART[index % CONTACT_ART.length]} className="flex h-full flex-col rounded-2xl border border-[#B6FF3B]/15 bg-[#071426] p-6 text-white shadow-[0_22px_50px_-22px_rgba(7,20,38,0.8)] sm:p-7">
                  <IconBadge tone="stadium">{option.icon}</IconBadge>
                  <h3 className="mt-6 text-lg font-bold">{option.title}</h3>
                  <CardRise order={1} className="mt-3 flex-1"><p className="text-sm leading-6 text-white/65">{option.description}</p></CardRise>
                  <CardRise order={2} className="mt-6">
                  <a
                    href={`mailto:${contactEmail}?subject=${encodeURIComponent(option.subject)}`}
                    data-cursor="Write"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#B6FF3B] hover:text-white"
                  >
                    Start an email <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1">↗</span>
                  </a>
                  </CardRise>
                </InteractiveCard>
              </FlipIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white px-5 py-14 sm:px-8 lg:px-12">
        <DrawDivider />
        <FadeIn className="mx-auto max-w-[1160px]">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-jg-900/10 bg-mist-50 p-6 text-center sm:flex-row sm:text-left sm:p-8">
            <div><Eyebrow>Prefer to explore first?</Eyebrow><h2 className="mt-2 text-xl font-bold text-ink-900"><WordReveal>See how JusGo brings bookings <Highlight>together.</Highlight></WordReveal></h2></div>
            <a href="/product" className="shrink-0 rounded-full bg-jg-950 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-jg-800">Explore the product <span aria-hidden="true">→</span></a>
          </div>
        </FadeIn>
      </section>
    </PageShell>
  );
}
