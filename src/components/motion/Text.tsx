"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Children, cloneElement, Fragment, isValidElement, type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import { EASE_EXPO } from "@/lib/motion";

const WORD_STAGGER = 0.045;

function plainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return plainText(node.props.children);
  return "";
}

/** Marks a phrase inside WordReveal: each of its words gets a bar that draws in underneath. */
export function Underline({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** Marks a phrase inside WordReveal: a lime marker stroke wipes in behind each of its words. Use on light backgrounds. */
export function Highlight({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

type Mark = "underline" | "highlight" | null;

/**
 * Section heading content that reveals word by word. Keeps inline elements (accent spans, Underline)
 * and exposes the real text through aria-label on a wrapper; the visual words are aria-hidden.
 */
export function WordReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const counter = { index: 0 };

  const split = (node: ReactNode, mark: Mark = null): ReactNode =>
    Children.map(node, (child) => {
      if (typeof child === "string") {
        return child.split(/(\s+)/).map((part, i) => {
          if (!part.trim()) return part;
          const order = counter.index++;
          return (
            // The observer sits on the mask: a child clipped by overflow-hidden never counts as intersecting.
            <motion.span
              key={`${order}-${i}`}
              initial={reduceMotion ? "shown" : "hidden"}
              whileInView="shown"
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              className="relative isolate -mb-[0.1em] inline-block overflow-hidden pb-[0.16em] pt-[0.06em] align-bottom"
            >
              <motion.span
                className="inline-block"
                variants={{ hidden: { y: "110%", opacity: 0 }, shown: { y: 0, opacity: 1 } }}
                transition={{ duration: 0.75, delay: order * WORD_STAGGER, ease: EASE_EXPO }}
              >
                {part}
              </motion.span>
              {mark === "highlight" ? (
                <motion.span
                  aria-hidden="true"
                  variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                  transition={{ duration: 0.7, delay: order * WORD_STAGGER + 0.55, ease: EASE_EXPO }}
                  className="absolute inset-x-[-2px] bottom-[0.14em] -z-10 h-[0.42em] origin-left rounded-[2px] bg-jg-lime/45"
                />
              ) : null}
              {mark === "underline" ? (
                <motion.span
                  aria-hidden="true"
                  variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                  transition={{ duration: 0.6, delay: order * WORD_STAGGER + 0.35, ease: EASE_EXPO }}
                  className="absolute inset-x-0 bottom-[0.04em] h-[3px] origin-left rounded-full bg-current opacity-60"
                />
              ) : null}
            </motion.span>
          );
        });
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        if (child.type === Underline) return split(child.props.children, "underline");
        if (child.type === Highlight) return split(child.props.children, "highlight");
        return cloneElement(child as ReactElement<{ children?: ReactNode }>, undefined, split(child.props.children, mark));
      }
      return child;
    });

  return (
    <span aria-label={plainText(children)} className="contents">
      <span aria-hidden="true" className="contents">{split(children)}</span>
    </span>
  );
}

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SCRAMBLE_MS = 750;

/** Short label that shuffles its letters once when it scrolls into view, then settles on the real text. */
export function ScrambleText({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const start = performance.now();
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / SCRAMBLE_MS);
      const settled = Math.floor(progress * text.length);
      setDisplay(
        text
          .split("")
          .map((char, i) => (char === " " || i < settled ? char : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]))
          .join(""),
      );
      if (progress >= 1) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 40);
    return () => window.clearInterval(timer);
  }, [inView, reduceMotion, text]);

  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

function ReadWord({ word, start, end, progress }: { word: string; start: number; end: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return <motion.span style={{ opacity }}>{word}</motion.span>;
}

/** Paragraph whose words brighten one by one as it scrolls up the screen (a "read along" effect). */
export function ReadFill({ text, className = "" }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const done = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "start 42%"] });
  const progress = reduceMotion ? done : scrollYProgress;
  const words = text.split(" ");
  return (
    <p ref={ref} aria-label={text} className={className}>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index}>
            <ReadWord word={word} start={(index / words.length) * 0.85} end={(index / words.length) * 0.85 + 0.15} progress={progress} />
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </p>
  );
}

const CINEMATIC_STEP = 0.11; // seconds between words

/**
 * Cinematic heading reveal. Words come in one by one, left to right: each fades in while rising about 30px
 * and sharpening from a blur. The `lead` phrase goes first, then `tail` and `accent`; once the accent words are
 * in, a lime (#B6FF3B) highlight draws under them from left to right.
 *
 * It renders inline text only (no forced line breaks), so the surrounding heading keeps its own typography and
 * wrapping. The whole phrase is exposed to screen readers through aria-label. Reduced motion shows the final state.
 */
export function CinematicHeading({ lead, tail, accent }: { lead: string; tail: string; accent: string }) {
  const reduceMotion = useReducedMotion();
  const leadWords = lead.split(" ");
  const tailWords = tail.split(" ");
  const accentWords = accent.split(" ");

  const tailStart = leadWords.length * CINEMATIC_STEP + 0.3; // a short beat after the first line
  const accentStart = tailStart + tailWords.length * CINEMATIC_STEP;
  const barStart = accentStart + accentWords.length * CINEMATIC_STEP + 0.1;

  const wordVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    shown: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  const renderWords = (words: string[], start: number, highlight = false) =>
    words.map((word, i) => (
      <Fragment key={`${start}-${i}`}>
        <span className="relative isolate inline-block">
          <motion.span variants={wordVariants} transition={{ duration: 0.85, delay: start + i * CINEMATIC_STEP, ease: EASE_EXPO }} className="inline-block">
            {word}
          </motion.span>
          {highlight ? (
            <motion.span
              aria-hidden="true"
              variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
              transition={{ duration: 0.7, delay: barStart + i * 0.28, ease: EASE_EXPO }}
              className="absolute inset-x-[-2px] bottom-[0.14em] -z-10 h-[0.42em] origin-left rounded-[2px] bg-[#B6FF3B]/60"
            />
          ) : null}
        </span>{" "}
      </Fragment>
    ));

  return (
    <motion.span
      aria-label={`${lead} ${tail} ${accent}`}
      initial={reduceMotion ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
      className="inline"
    >
      <span aria-hidden="true">
        {renderWords(leadWords, 0)}
        {renderWords(tailWords, tailStart)}
        {renderWords(accentWords, accentStart, true)}
      </span>
    </motion.span>
  );
}
