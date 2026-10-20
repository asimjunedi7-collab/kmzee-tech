import type { Transition } from "motion/react";

// Spring presets from the apple-design guidance.
// bounce 0 = critically damped (no overshoot). Use it for default UI motion.
// A little bounce is reserved for motion that follows a flick or throw.
export const springDefault: Transition = { type: "spring", bounce: 0, duration: 0.4 };
export const springSettle: Transition = { type: "spring", bounce: 0, duration: 0.7 };
export const springMomentum: Transition = { type: "spring", bounce: 0.2, duration: 0.45 };
export const springDrawer: Transition = { type: "spring", bounce: 0.2, duration: 0.3 };

// Scroll-style deceleration rate. 0.998 is the normal feel. 0.99 is snappier.
export const DECELERATION = 0.998;

// Projected travel for a release velocity in px/s. Apple's exponential-decay form.
export function project(velocity: number, deceleration = DECELERATION): number {
  return ((velocity / 1000) * deceleration) / (1 - deceleration);
}

// Rubber-band resistance past a boundary. The further past, the less it follows.
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  const magnitude = Math.abs(overshoot);
  return (Math.sign(overshoot) * (magnitude * dimension * constant)) / (dimension + constant * magnitude);
}

// Shared reveal used across sections. Opacity and a 12px rise, critically damped.
export const revealProps = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: springDefault,
} as const;
