"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { revealProps } from "@/lib/motion";

// Fades a block in with a small rise when it scrolls into view. Plays once.
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={revealProps.initial}
      whileInView={revealProps.whileInView}
      viewport={revealProps.viewport}
      transition={{ ...revealProps.transition, delay }}
    >
      {children}
    </motion.div>
  );
}
