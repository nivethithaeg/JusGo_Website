"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type MouseEvent, type ReactNode, useState } from "react";
import { DURATION, EASE, EASE_EXPO, SPRING, STAGGER } from "@/lib/motion";
import { useTilt } from "@/lib/useTilt";
import { CardArt, type CardArtKind } from "@/components/motion/CardArt";
import { type BallKind, BallGlyph, CricketStrike, type Motif, SportsMotif, STRIKE_MS, type Strike } from "@/components/motion/SportsMotif";

/** Soft lime spot that follows the pointer. Put inside a `relative` element that has `.tilt`. */
export function TiltGlow() {
  return <span aria-hidden="true" className="tilt-glow" />;
}

const FLIP_SPORTS: BallKind[] = ["football", "basketball", "tennis"];
const TRAIL = [0, 1, 2]; // lead ball + two fading ghosts behind it

/**
 * A ball that arcs across the card (left to right, with spin) while the card flips in. Runs from the parent's variants.
 * The layer is clipped to the card so the moving layers never widen the page.
 */
function FlipBall({ kind, delay, className }: { kind: BallKind; delay: number; className: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 z-30 overflow-hidden ${className}`}>
      {TRAIL.map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 block"
          variants={{
            hidden: { x: "-16%", y: "64%", opacity: 0 },
            shown: {
              x: ["-16%", "22%", "50%", "84%", "120%"],
              y: ["64%", "14%", "2%", "14%", "64%"],
              opacity: i === 0 ? [0, 1, 1, 1, 0] : [0, 0.32 / i, 0.32 / i, 0.32 / i, 0],
              transition: { duration: 1.15, delay: delay + 0.05 + i * 0.07, ease: "linear" },
            },
          }}
        >
          <motion.span
            className="absolute left-0 top-0 block"
            style={{ scale: 1 - i * 0.18 }}
            variants={{ hidden: { rotate: 0 }, shown: { rotate: 720, transition: { duration: 1.15, delay: delay + 0.05 + i * 0.07, ease: "linear" } } }}
          >
            <BallGlyph kind={kind} />
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}

/**
 * Flips in from the left edge when it enters view, while a sports ball (football, basketball, tennis ball or
 * cricket ball, by index) flies across it. `index` staggers siblings. Reduced motion shows the card as is.
 */
export function FlipIn({
  children,
  index = 0,
  className = "",
  sport,
  ballClassName = "text-[#B6FF3B]",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  sport?: BallKind;
  ballClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const delay = index * STAGGER.flip;
  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
      className={`relative ${className}`}
    >
      <motion.div
        variants={{ hidden: { rotateY: -95, rotateX: 12, opacity: 0 }, shown: { rotateY: 0, rotateX: 0, opacity: 1 } }}
        transition={{ duration: DURATION.flip, delay, ease: EASE_EXPO }}
        style={{ transformPerspective: 900, transformOrigin: "left center" }}
        className="h-full"
      >
        {children}
      </motion.div>
      <FlipBall kind={sport ?? FLIP_SPORTS[index % FLIP_SPORTS.length]} delay={delay} className={`motion-reduce:hidden ${ballClassName}`} />
    </motion.div>
  );
}

/** Slides in from the left (with a fade) when it enters view. For list rows. */
export function SlideIn({ children, index = 0, className = "" }: { children: ReactNode; index?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: -36 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Clickable card: lifts on hover (y:-4), presses on tap (0.98) and tilts with a
 * light spot under a mouse. Hover/tap live on the outer layer, the tilt on the inner
 * <article>, so the transforms never fight.
 */
export function InteractiveCard({
  children,
  className = "",
  tilt,
  id,
  motif,
  motifClassName,
  art,
  strikeClassName = "text-[#B6FF3B]",
}: {
  children: ReactNode;
  className?: string;
  tilt: number;
  id?: string;
  /** Sports scene drawn in the card corner; replays on hover. */
  motif?: Motif;
  motifClassName?: string;
  /** Pitch / court line art behind the content; zooms on hover. */
  art?: CardArtKind;
  /** Colour of the click-to-strike cricket animation. */
  strikeClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>(tilt);
  const [hovered, setHovered] = useState(false);
  const [strikes, setStrikes] = useState<Strike[]>([]);

  const strike = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const id = Date.now() + Math.random();
    // The ball always flies right and up, off the card.
    const next: Strike = { id, x, y, dx: box.width - x + 60, dy: -(20 + Math.random() * 90) };
    setStrikes((current) => [...current.slice(-3), next]);
    window.setTimeout(() => setStrikes((current) => current.filter((item) => item.id !== id)), STRIKE_MS);
  };
  return (
    <motion.div
      ref={ref}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={strike}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={reduceMotion ? { duration: 0 } : SPRING.card}
      className="h-full"
    >
      <article id={id} className={`card-shine group tilt relative ${className}`}>
        {art ? <CardArt kind={art} /> : null}
        <span aria-hidden="true" className="stadium-border" />
        {children}
        {motif ? <SportsMotif kind={motif} active={hovered} className={motifClassName} /> : null}
        <TiltGlow />
        <span aria-hidden="true" className={`pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit] ${strikeClassName}`}>
          {strikes.map(({ id, ...rest }) => (
            <CricketStrike key={id} {...rest} />
          ))}
        </span>
      </article>
    </motion.div>
  );
}

/** Description / CTA that slides up after the card has appeared. `order` staggers lines within a card. */
export function CardRise({ children, order = 0, className = "" }: { children: ReactNode; order?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 140, damping: 20, delay: 0.35 + order * 0.12 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
