"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { StadiumImage } from "@/components/contact/StadiumArt";
import { ContactForm } from "@/components/ContactForm";
import { ScrambleText, WordReveal } from "@/components/motion/Text";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF } from "@/lib/contact";
import { EASE_EXPO } from "@/lib/motion";

function Rise({ children, delay = 0, x = 0, className = "" }: { children: ReactNode; delay?: number; x?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 26, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function DetailCard({ icon, label, value, href, cursor }: { icon: ReactNode; label: string; value: string; href: string; cursor?: string }) {
  return (
    <motion.a
      href={href}
      data-cursor={cursor}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex min-w-0 items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_14px_36px_-22px_rgba(7,20,38,0.45)] ring-1 ring-ink-900/[0.05] transition-shadow hover:shadow-[0_18px_44px_-20px_rgba(7,20,38,0.55)]"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#071426] text-[#B6FF3B] transition-transform duration-300 group-hover:scale-105">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-900/45">{label}</span>
        <span className="mt-1 block truncate text-sm font-bold text-ink-900 transition-colors group-hover:text-jg-600 sm:text-[15px]">{value}</span>
      </span>
    </motion.a>
  );
}

/**
 * Contact experience: introduction, stadium image and contact details on the left; the message form on the right.
 * On phones the columns stack with the contact information above the form. Slow green ambient lights drift behind.
 */
export function ContactExperience() {
  return (
    <section id="message" className="relative isolate overflow-hidden bg-[#F4F8F5] px-5 py-16 text-ink-900 sm:px-8 sm:py-24 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="ambient-light -left-24 top-10 h-80 w-80 bg-[#B6FF3B]/25" />
        <span className="ambient-light -right-20 bottom-0 h-96 w-96 bg-jg-600/20" style={{ animationDelay: "-6s", animationDuration: "22s" }} />
        <span className="ambient-light left-1/2 top-1/3 h-64 w-64 bg-[#B6FF3B]/15" style={{ animationDelay: "-11s", animationDuration: "26s" }} />
      </div>

      <div className="relative mx-auto grid max-w-[1160px] items-start gap-10 md:grid-cols-2 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
        {/* left: introduction, image, details */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jg-600">
            <ScrambleText text="Contact us" />
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.06em] text-[#071426] sm:text-5xl">
            <WordReveal>Start a conversation.</WordReveal>
          </h2>
          <Rise delay={0.1}>
            <p className="mt-5 max-w-lg text-sm leading-7 text-ink-900/65 sm:text-base">
              Tell us about your venue, your booking app or your idea. Send a message and we&apos;ll point you to the right next step.
            </p>
          </Rise>

          <StadiumImage className="mt-8 aspect-[16/11]" />

          <div className="mt-6 grid gap-3">
            <Rise delay={0.1}>
              <DetailCard
                href={`mailto:${CONTACT_EMAIL}`}
                cursor="Write"
                label="Email us"
                value={CONTACT_EMAIL}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ICON}>
                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                    <path d="m3.5 7 8.5 6.5L20.5 7" />
                  </svg>
                }
              />
            </Rise>
            <Rise delay={0.2}>
              <DetailCard
                href={CONTACT_PHONE_HREF}
                label="Call us"
                value={CONTACT_PHONE_DISPLAY}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ICON}>
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                }
              />
            </Rise>
          </div>
        </div>

        {/* right: the form */}
        <Rise x={40} delay={0.15}>
          <div className="rounded-[28px] bg-white p-6 shadow-[0_30px_70px_-34px_rgba(7,20,38,0.45)] ring-1 ring-ink-900/[0.05] sm:p-8">
            <ContactForm email={CONTACT_EMAIL} />
          </div>
        </Rise>
      </div>
    </section>
  );
}
