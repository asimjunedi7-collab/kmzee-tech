"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Matches numbers such as 85, 10,193 or 6.8 inside a metric string.
const NUMBER = /(\d[\d,]*(?:\.\d+)?)/;

type Part = { text: string; number?: { value: number; decimals: number; grouped: boolean } };

function parse(text: string): Part[] {
  return text.split(NUMBER).map((chunk, i) => {
    // split() keeps the captured numbers at odd indexes
    if (i % 2 === 0) return { text: chunk };
    return {
      text: chunk,
      number: {
        value: Number(chunk.replace(/,/g, "")),
        decimals: chunk.includes(".") ? chunk.split(".")[1].length : 0,
        grouped: chunk.includes(","),
      },
    };
  });
}

function format(value: number, decimals: number, grouped: boolean) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
}

// Counts the numbers in a metric up from zero once it scrolls into view. Only the numbers
// move: "41% → 12%" counts both figures and keeps the arrow and the percent sign.
// The final text is rendered on the server, so crawlers and no-JS visitors see the real figures.
export function CountUp({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState<number | null>(null);
  const parts = parse(text);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    setProgress(0);
    const controls = animate(0, 1, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => setProgress(value),
    });
    return () => controls.stop();
  }, [inView, reduceMotion]);

  const shown =
    progress === null
      ? text
      : parts
          .map((part) =>
            part.number
              ? format(part.number.value * progress, part.number.decimals, part.number.grouped)
              : part.text
          )
          .join("");

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}
