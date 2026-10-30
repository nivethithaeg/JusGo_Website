"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import { IconNavbar } from "@/components/IconNavbar";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, SOCIAL_LINKS } from "@/lib/contact";
import { Magnetic } from "@/components/motion/Interactions";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-jg-lime"
      style={reduceMotion ? { scaleX: 0 } : { scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}

/** The site's navigation: an icon-over-label bar fixed to the top of the screen. */
export function SiteNavbar({ currentPage = "home" }: { currentPage?: "home" | "product" | "venues" | "developers" | "team" | "contact" }) {
  return <IconNavbar currentPage={currentPage} />;
}

const FOOTER_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Venues", href: "/venues" },
  { label: "Developers", href: "/developers" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const SOCIALS = [
  {
    name: "Instagram",
    href: SOCIAL_LINKS.instagram,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...ICON}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...ICON}>
        <path d="M5 10v9M5 5.6v.01M10 19v-9M10 13.5c0-2 1.4-3.5 3.3-3.5S17 11.4 17 13.5V19" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: SOCIAL_LINKS.facebook,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...ICON}>
        <path d="M14 8h2.5V4.5H14C11.8 4.5 10.5 6 10.5 8.2V10H8v3.5h2.5V20H14v-6.5h2.4l.6-3.5H14V8.4c0-.3.2-.4.5-.4z" />
      </svg>
    ),
  },
];

const RISE = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } } as const;

/** Site footer: navy card with the JusGo wordmark, tagline, links, social icons and a darker copyright bar. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const spring = (delay: number) => ({ type: "spring", stiffness: 140, damping: 16, delay }) as const;
  return (
    <footer className="px-4 pb-6 pt-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[28px] bg-[#071426] text-white shadow-[0_24px_60px_-28px_rgba(7,20,38,0.8)]">
        <div className="flex flex-col items-center px-5 py-9 text-center sm:py-10">
          <motion.p {...RISE} transition={spring(0)} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55">
            Aakavi presents
          </motion.p>
          <motion.a
            {...RISE}
            transition={spring(0.05)}
            href="/#home"
            aria-label="JusGo home"
            className="font-display text-3xl font-extrabold tracking-[-0.03em] text-[#B6FF3B] transition-opacity hover:opacity-80"
          >
            JusGo
          </motion.a>
          <motion.p {...RISE} transition={spring(0.1)} className="mt-3 text-base font-semibold tracking-[0.01em] text-[#B6FF3B] sm:text-lg">
            Limitless Play. Limitless Connections.
          </motion.p>
          <motion.nav {...RISE} transition={spring(0.2)} aria-label="Footer" className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Magnetic key={link.label} pull={4}>
                <a href={link.href} className="text-[15px] font-semibold text-white transition-colors hover:text-[#B6FF3B]">
                  {link.label}
                </a>
              </Magnetic>
            ))}
          </motion.nav>
          <motion.p {...RISE} transition={spring(0.28)} className="mt-4 text-xs text-white/50">
            <a href={`mailto:${CONTACT_EMAIL}`} data-cursor="Write" className="transition-colors hover:text-[#B6FF3B]">{CONTACT_EMAIL}</a>
            <span aria-hidden="true" className="mx-2 text-white/20">·</span>
            <a href={CONTACT_PHONE_HREF} className="transition-colors hover:text-[#B6FF3B]">{CONTACT_PHONE_DISPLAY}</a>
          </motion.p>
          <motion.ul {...RISE} transition={spring(0.36)} className="mt-5 flex items-center justify-center gap-5 text-[#B6FF3B]">
            {SOCIALS.map((social) => (
              <li key={social.name}>
                {social.href ? (
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="block transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110">
                    {social.icon}
                  </a>
                ) : (
                  <span aria-hidden="true" className="block opacity-90">{social.icon}</span>
                )}
              </li>
            ))}
          </motion.ul>
        </div>
        <div className="bg-[#04090f] px-5 py-4 text-center text-sm text-white/90">
          © <span suppressHydrationWarning>{year}</span> JusGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
