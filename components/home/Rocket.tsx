"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

// Stars in the sky. Coordinates are in the SVG viewBox (400 x 360).
const STARS = [
  { x: 40, y: 40, r: 2, color: "var(--tone-sea)", delay: 0 },
  { x: 92, y: 110, r: 1.6, color: "var(--tone-mint)", delay: 0.6 },
  { x: 330, y: 56, r: 2.4, color: "var(--tone-sunrise)", delay: 1.2 },
  { x: 360, y: 150, r: 1.8, color: "var(--tone-aqua)", delay: 0.3 },
  { x: 70, y: 210, r: 1.6, color: "var(--tone-coral)", delay: 1.8 },
  { x: 310, y: 240, r: 2, color: "var(--tone-sea)", delay: 0.9 },
  { x: 180, y: 30, r: 1.4, color: "var(--tone-violet)", delay: 1.5 },
  { x: 250, y: 120, r: 1.5, color: "var(--tone-mint)", delay: 2.1 },
];

// A colorful rocket that takes off from the pad when it scrolls into view, then loops.
// Under reduced motion it stays on the pad.
export function Rocket({ label }: { label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const lift = useMotionValue(0);
  const fade = useMotionValue(1);
  const puff = useMotionValue(0);
  const puffScale = useTransform(puff, [0, 1], [0.5, 2.2]);
  const puffOpacity = useTransform(puff, [0, 0.25, 1], [0, 0.8, 0]);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let active = true;
    const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    async function loop() {
      while (active) {
        lift.set(0);
        fade.set(1);
        puff.set(0);
        await wait(500);
        if (!active) break;
        // Accelerate off the pad, then fade out at the top before the next launch.
        const launch = animate(lift, -330, { duration: 2.6, ease: [0.55, 0, 0.9, 0.5] });
        animate(puff, 1, { duration: 1.4, ease: "easeOut" });
        await launch;
        if (!active) break;
        await animate(fade, 0, { duration: 0.35 });
        await wait(1400);
      }
    }

    loop();
    return () => {
      active = false;
    };
  }, [inView, reduceMotion, lift, fade, puff]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 360"
      role="img"
      aria-label={label}
      className="mx-auto block h-auto w-full max-w-sm"
    >
      {STARS.map((star, i) => (
        <circle
          key={i}
          cx={star.x}
          cy={star.y}
          r={star.r}
          className="anim-twinkle"
          style={{ fill: star.color, animationDelay: `${star.delay}s` }}
        />
      ))}

      {/* Launch pad and exhaust puffs */}
      <rect x="110" y="322" width="180" height="12" rx="6" style={{ fill: "var(--tone-sea)" }} opacity="0.55" />
      <motion.g style={{ opacity: puffOpacity, scale: puffScale, transformOrigin: "200px 324px" }}>
        <circle cx="168" cy="318" r="9" style={{ fill: "var(--tone-mint)" }} />
        <circle cx="200" cy="316" r="12" style={{ fill: "var(--tone-sunrise)" }} />
        <circle cx="232" cy="318" r="9" style={{ fill: "var(--tone-coral)" }} />
      </motion.g>

      {/* Rocket */}
      <motion.g style={{ y: lift, opacity: fade }}>
        <g className="anim-flicker">
          <path d="M176 282 C178 312 190 332 200 346 C210 332 222 312 224 282 Z" style={{ fill: "var(--tone-sunrise)" }} />
          <path d="M187 282 C189 298 194 310 200 318 C206 310 211 298 213 282 Z" style={{ fill: "var(--tone-coral)" }} />
        </g>
        <path
          d="M200 40 C238 78 246 126 246 176 L246 268 L154 268 L154 176 C154 126 162 78 200 40 Z"
          style={{ fill: "var(--tone-aqua)" }}
        />
        <path
          d="M200 40 C226 66 236 92 240 118 L160 118 C164 92 174 66 200 40 Z"
          style={{ fill: "var(--tone-coral)" }}
        />
        <rect x="154" y="222" width="92" height="9" style={{ fill: "var(--tone-violet)" }} />
        <circle cx="200" cy="158" r="22" style={{ fill: "#0c343d", stroke: "var(--tone-mint)", strokeWidth: 6 }} />
        <circle cx="193" cy="151" r="5" style={{ fill: "#f0feff" }} opacity="0.7" />
        <path d="M154 206 L118 262 L118 282 L154 268 Z" style={{ fill: "var(--tone-sunrise)" }} />
        <path d="M246 206 L282 262 L282 282 L246 268 Z" style={{ fill: "var(--tone-sunrise)" }} />
        <rect x="180" y="266" width="40" height="12" rx="4" style={{ fill: "#0c343d" }} />
      </motion.g>
    </svg>
  );
}
