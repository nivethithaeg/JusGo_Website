"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Parallax } from "@/components/motion/Scroll";
import { EASE_EXPO } from "@/lib/motion";

const NAVY = "#071426";
const LIME = "#B6FF3B";
const ORANGE = "#F28C28";

const SMALL_HEADING = "The people behind the experience";
const NAME_LEAD = "Meet";
const NAME = "Harish K";
/** Placeholder portrait. Replace this file (or point to a new one) when the real photo is ready. */
const PORTRAIT = "/assets/harish-placeholder.png";
const SUPPORTING = "Building connections through sports.";
const SUBTITLE = "THE JUSGO JOURNEY";
const TEAM_LABEL = "JusGo team";
/** `photo` is optional: add a path (e.g. "/assets/team/nivethitha.jpg") to replace the grey placeholder avatar. */
const TEAM: { name: string; role: string; bio: string; photo?: string }[] = [
  {
    name: "Nivethitha E G",
    role: "Full Stack Developer",
    bio: "Contributed to building the JusGo platform by developing responsive user interfaces, backend functionalities, and database integrations. Focused on creating seamless booking experiences, API integrations, and reliable platform workflows.",
  },
  {
    name: "Dharshini S",
    role: "Full Stack Developer",
    bio: "Contributed to developing and enhancing JusGo's web platform through frontend and backend implementation. Focused on API development, feature integration, UI improvements, and delivering a smooth experience for users and venue owners.",
  },
];
const DESCRIPTION = [
  "Great experiences begin with great connections.",
  "At JusGo, our focus is on bringing players, sports venues and technology together.",
  "Harish represents the people-first spirit behind this journey, helping make every interaction simpler, every connection stronger and every game easier to access.",
];

/* Timeline (seconds after the section enters the viewport). */
const T = {
  small: 0,
  lead: 0.25,
  letters: 0.45,
  letterStep: 0.07,
  words: 1.45,
  wordStep: 0.1,
  subtitle: 2.3,
  lines: 2.7,
  lineStep: 0.4,
  teamLabel: 4.0,
  team: 4.3,
  teamStep: 0.3,
};
const UNDERLINE_AT = T.letters + (NAME.length + 1) * T.letterStep + 0.1;

const HIDDEN_RISE = { opacity: 0, y: 30, filter: "blur(8px)" };
const SHOWN_RISE = { opacity: 1, y: 0, filter: "blur(0px)" };

/** Faint pitch lines, a lime ring and orange dots that drift at different speeds behind the section. */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Parallax distance={90} className="absolute -right-48 top-[4%] h-[44rem] w-[44rem]">
        <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" stroke={NAVY} strokeOpacity="0.07" strokeWidth="1.4">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="64" />
          <path d="M200 10V390" />
          <circle cx="200" cy="200" r="3" fill={NAVY} fillOpacity="0.15" stroke="none" />
        </svg>
      </Parallax>
      <Parallax distance={-70} className="absolute -left-32 bottom-[2%] h-[26rem] w-[26rem]">
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" stroke={LIME} strokeOpacity="0.7" strokeWidth="1.6" strokeDasharray="4 8">
          <circle cx="100" cy="100" r="92" />
        </svg>
      </Parallax>
      <Parallax distance={44} className="absolute bottom-[8%] right-[8%] h-56 w-80">
        <svg viewBox="0 0 160 100" className="h-full w-full" fill="none" stroke={NAVY} strokeOpacity="0.07" strokeWidth="1.2">
          <rect x="4" y="4" width="152" height="92" rx="2" />
          <path d="M4 26H156M4 74H156M40 26V74M120 26V74M40 50H120M80 4V96" />
        </svg>
      </Parallax>
      <Parallax distance={150} className="absolute right-[18%] top-[16%] hidden h-3.5 w-3.5 rounded-full sm:block">
        <span className="block h-full w-full rounded-full" style={{ background: ORANGE, opacity: 0.8 }} />
      </Parallax>
      <Parallax distance={110} className="absolute bottom-[26%] left-[12%] hidden h-2.5 w-2.5 rounded-full sm:block">
        <span className="block h-full w-full rounded-full" style={{ background: ORANGE, opacity: 0.6 }} />
      </Parallax>
      <Parallax distance={180} className="absolute left-[38%] top-[8%] hidden h-2 w-2 rounded-full sm:block">
        <span className="block h-full w-full rounded-full" style={{ background: LIME }} />
      </Parallax>
    </div>
  );
}

/** Placeholder profile picture: a grey silhouette on a light disc, shown until a member's real photo is added. */
function Avatar({ name, photo }: { name: string; photo?: string }) {
  return (
    <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#E4E7E8] ring-2 ring-white shadow-[0_10px_24px_-10px_rgba(7,20,38,0.5)] sm:h-[72px] sm:w-[72px]">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={name} width={144} height={144} className="h-full w-full object-cover" />
      ) : (
        <svg role="img" aria-label={`${name} (photo coming soon)`} viewBox="0 0 100 100" className="h-full w-full">
          <ellipse cx="50" cy="41" rx="19.5" ry="21" fill="#AEB3B5" />
          <path d="M13 100 C14 74 31 64 50 64 C69 64 86 74 87 100 Z" fill="#AEB3B5" />
        </svg>
      )}
    </span>
  );
}

/**
 * Circular portrait: it comes into focus with the name, a lime ring draws round it, and it floats gently while
 * drifting against the page scroll. The placeholder avatar is zoomed so its grey disc fills the frame.
 */
function Portrait() {
  const reduceMotion = useReducedMotion();
  return (
    <Parallax distance={22} className="mx-auto lg:mx-0">
      <motion.div
        variants={{ hidden: { opacity: 0, scale: 0.86, filter: "blur(10px)" }, shown: { opacity: 1, scale: 1, filter: "blur(0px)" } }}
        transition={{ duration: 1.1, delay: T.letters + 0.2, ease: EASE_EXPO }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-44 w-44 sm:h-56 sm:w-56 xl:h-72 xl:w-72"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full bg-[#EEF0EF] shadow-[0_30px_70px_-30px_rgba(7,20,38,0.7)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="Harish K" width={700} height={700} className="h-full w-full scale-[1.27] object-cover" />
          </span>
          <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] -rotate-90">
            <motion.circle
              cx="50"
              cy="50"
              r="48.5"
              fill="none"
              stroke={LIME}
              strokeWidth="1.4"
              strokeLinecap="round"
              variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
              transition={{ duration: 1.5, delay: T.letters + 0.7, ease: EASE_EXPO }}
            />
          </svg>
          <span aria-hidden="true" className="absolute right-[6%] top-[6%] h-4 w-4 rounded-full ring-4 ring-[#EEF0EF]" style={{ background: ORANGE }} />
        </motion.div>
      </motion.div>
    </Parallax>
  );
}

/**
 * Editorial introduction on the Contact page. Everything plays once, in order, when the section enters the viewport:
 * small heading, "Meet", the letters of the name, the lime underline, the supporting heading word by word,
 * the orange subtitle and the description line by line. Reduced motion shows the finished layout.
 */
export function EditorialIntro() {
  const reduceMotion = useReducedMotion();

  const spring = (delay: number) => ({ duration: 0.9, delay, ease: EASE_EXPO });

  return (
    <section id="meet-harish" className="relative isolate overflow-hidden bg-[#EEF0EF] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36" style={{ color: NAVY }}>
      <Backdrop />
      <motion.div
        initial={reduceMotion ? "shown" : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto max-w-[1160px]"
      >
        {/* 1. small heading: fade and slide up */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 22 }, shown: { opacity: 1, y: 0 } }}
          transition={spring(T.small)}
          className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] sm:text-xs"
        >
          <span aria-hidden="true" className="h-[3px] w-10 rounded-full" style={{ background: LIME }} />
          {SMALL_HEADING}
        </motion.p>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div>
        {/* 2. the name: cinematic reveal, with the lime underline drawn under it */}
        <h2
          aria-label={`${NAME_LEAD} ${NAME}.`}
          className="mt-6 font-display text-[clamp(3.25rem,8.6vw,6.75rem)] font-extrabold leading-[0.92] tracking-[-0.065em] sm:mt-8"
        >
          <span aria-hidden="true">
            {/* same clipping wrapper as the letters below, so both words share one baseline */}
            <span className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span variants={{ hidden: HIDDEN_RISE, shown: SHOWN_RISE }} transition={spring(T.lead)} className="inline-block">
                {NAME_LEAD}
              </motion.span>
            </span>
            <span className="relative inline-block whitespace-nowrap">
              {`${NAME}.`.split("").map((letter, i) =>
                letter === " " ? (
                  <span key={i} className="inline-block w-[0.2em]" />
                ) : (
                <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <motion.span
                    variants={{ hidden: { y: "105%", opacity: 0, scale: 1.12 }, shown: { y: "0%", opacity: 1, scale: 1 } }}
                    transition={{ duration: 0.9, delay: T.letters + i * T.letterStep, ease: EASE_EXPO }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                </span>
                ),
              )}
              {/* 4. lime underline, drawn left to right */}
              <motion.span
                variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                transition={{ duration: 0.9, delay: UNDERLINE_AT, ease: EASE_EXPO }}
                className="absolute inset-x-0 bottom-[0.02em] h-[0.1em] origin-left rounded-full"
                style={{ background: LIME }}
              />
            </span>
          </span>
        </h2>

        {/* 3. supporting heading: word by word */}
        <h3 aria-label={SUPPORTING} className="mt-6 max-w-3xl font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.05em] sm:mt-8 sm:text-5xl lg:text-6xl">
          <span aria-hidden="true">
            {SUPPORTING.split(" ").map((word, i) => (
              <span key={i}>
                <motion.span
                  variants={{ hidden: HIDDEN_RISE, shown: SHOWN_RISE }}
                  transition={{ duration: 0.85, delay: T.words + i * T.wordStep, ease: EASE_EXPO }}
                  className="inline-block"
                >
                  {word}
                </motion.span>{" "}
              </span>
            ))}
          </span>
        </h3>

          </div>
          <Portrait />
        </div>

        {/* subtitle + description */}
        <div className="mt-12 grid gap-6 border-t pt-8 sm:mt-16 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:gap-14" style={{ borderColor: "rgba(7,20,38,0.12)" }}>
          {/* 5. orange subtitle: fade in with a slight zoom */}
          <motion.p
            variants={{ hidden: { opacity: 0, scale: 0.9 }, shown: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.9, delay: T.subtitle, ease: EASE_EXPO }}
            style={{ color: ORANGE, transformOrigin: "left center" }}
            className="text-sm font-extrabold tracking-[0.26em] sm:text-base"
          >
            {SUBTITLE}
          </motion.p>

          {/* 6. description: line by line */}
          <div className="max-w-2xl space-y-3 text-base leading-8 sm:text-lg sm:leading-9" style={{ color: "rgba(7,20,38,0.78)" }}>
            {DESCRIPTION.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span
                  variants={{ hidden: { y: "110%", opacity: 0 }, shown: { y: "0%", opacity: 1 } }}
                  transition={{ duration: 0.85, delay: T.lines + i * T.lineStep, ease: EASE_EXPO }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </div>
        </div>

        {/* JusGo team */}
        <div className="mt-10 grid gap-6 border-t pt-8 sm:mt-14 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:gap-14" style={{ borderColor: "rgba(7,20,38,0.12)" }}>
          <motion.h4
            variants={{ hidden: { opacity: 0, scale: 0.9 }, shown: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.9, delay: T.teamLabel, ease: EASE_EXPO }}
            style={{ color: ORANGE, transformOrigin: "left center" }}
            className="text-sm font-extrabold uppercase tracking-[0.26em] sm:text-base"
          >
            {TEAM_LABEL}
          </motion.h4>
          <ul className="grid gap-8 sm:grid-cols-2">
            {TEAM.map((member, i) => (
              <motion.li
                key={member.name}
                variants={{ hidden: HIDDEN_RISE, shown: SHOWN_RISE }}
                transition={{ duration: 0.85, delay: T.team + i * T.teamStep, ease: EASE_EXPO }}
              >
                <span aria-hidden="true" className="mb-4 block h-[3px] w-10 rounded-full" style={{ background: LIME }} />
                <div className="flex items-center gap-4">
                  <Avatar name={member.name} photo={member.photo} />
                  <div>
                    <p className="font-display text-2xl font-extrabold leading-tight tracking-[-0.04em] sm:text-3xl" style={{ color: NAVY }}>
                      {member.name}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold uppercase tracking-[0.14em] sm:text-[15px]" style={{ color: "rgba(7,20,38,0.6)" }}>
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 max-w-md text-justify text-[15px] leading-7 [hyphens:auto] sm:text-base sm:leading-8" style={{ color: "rgba(7,20,38,0.78)" }}>
                  {member.bio}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
