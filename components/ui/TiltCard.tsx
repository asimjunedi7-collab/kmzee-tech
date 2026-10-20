"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent } from "react";
import { springDefault, springMomentum } from "@/lib/motion";
import type { Tone } from "./ColorIcon";

type Props = { icon: LucideIcon; tone: Tone; title: string; desc: string };

// A colorful card with pointer tilt, a soft light that follows the cursor, a hover lift
// for the icon, and a press effect on tap.
export function TiltCard({ icon: Icon, tone, title, desc }: Props) {
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  // The card leans toward the pointer. The spring settles without overshoot.
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 240, damping: 30 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 240, damping: 30 });

  const spot = useTransform(
    [px, py],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, color-mix(in srgb, var(--tone-${tone}) 40%, transparent), transparent 62%)`
  );

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.article
      ref={ref}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      transition={springDefault}
      className="card card-interactive group relative h-full overflow-hidden p-5 sm:p-6"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spot }}
      />
      <motion.span
        variants={{
          rest: { rotate: 0, scale: 1 },
          hover: { rotate: -8, scale: 1.12 },
          tap: { scale: 0.94 },
        }}
        transition={springMomentum}
        className={`icon-tile tone-${tone} relative`}
      >
        <Icon size={20} strokeWidth={2} aria-hidden="true" />
      </motion.span>
      <h3 className="h3 relative mt-5 text-[1.0625rem]">{title}</h3>
      <p className="micro relative mt-2 text-muted">{desc}</p>
    </motion.article>
  );
}
