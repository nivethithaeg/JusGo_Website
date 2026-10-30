// Shared motion tokens. Pure data only, safe to import from server or client code.

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.28,
  base: 0.7,
  headline: 0.95,
  flip: 1.1,
} as const;

export const STAGGER = {
  headline: 0.11,
  flip: 0.16,
} as const;

/** Delays (s) for the hero entrance sequence that follows the headline. */
export const HERO_DELAY = {
  subtitle: 0.45,
  cta: 0.55,
} as const;

export const SPRING = {
  /** CTA buttons: slight overshoot. */
  cta: { type: "spring", stiffness: 220, damping: 14 },
  /** Live activity feed rows sliding in. */
  feed: { type: "spring", stiffness: 260, damping: 22 },
  /** Cards lifting on hover. */
  card: { type: "spring", stiffness: 300, damping: 22 },
  /** Flipping numbers. */
  flip: { type: "spring", stiffness: 300, damping: 22 },
} as const;

/** Elastic horizontal shake (x: -14 to 0), e.g. for an invalid form submit. */
export const SHAKE = {
  x: [0, -14, 11, -8, 5, -2, 0],
  transition: { duration: 0.5, ease: "easeOut" },
} as const;
