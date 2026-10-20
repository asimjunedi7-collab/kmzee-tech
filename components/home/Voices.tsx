"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DragRail } from "@/components/ui/DragRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dict } from "@/lib/content";
import { springDefault, springMomentum } from "@/lib/motion";
import type { Ui } from "@/lib/ui";

type Props = { dict: Dict; rtl: boolean; ui: Ui };

// Testimonials carousel. The current quote is in focus and the others fade back.
// It can be dragged, used with the arrow keys, or driven by the dots.
export function Voices({ dict, rtl, ui }: Props) {
  const v = dict.voices;
  const count = v.items.length;
  const [index, setIndex] = useState(0);

  // Arrows point in the direction of travel, so they flip in RTL.
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <section id="voices" aria-labelledby="voices-title" className="section pt-0">
      <div className="container-x">
        <SectionHeading id="voices-title" title={v.title} subtitle={v.subtitle} />

        <div className="mt-10">
          <DragRail label={ui.testimonials} snap count={count} index={index} onIndexChange={setIndex} rtl={rtl}>
            {v.items.map((item, i) => {
              const active = i === index;
              return (
                <motion.figure
                  key={item.name}
                  animate={active ? "active" : "idle"}
                  variants={{
                    active: { opacity: 1, scale: 1 },
                    idle: { opacity: 0.5, scale: 0.96 },
                  }}
                  transition={springDefault}
                  className="card m-0 mx-auto h-full max-w-2xl p-5 sm:p-8"
                >
                  <motion.span
                    animate={active ? { rotate: 0, scale: 1 } : { rotate: -12, scale: 0.8 }}
                    transition={springMomentum}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-accent"
                  >
                    <Quote size={18} strokeWidth={1.8} aria-hidden="true" />
                  </motion.span>
                  <blockquote className="mt-4 text-pretty text-[0.95rem] leading-relaxed text-fg sm:text-lg">
                    {item.review}
                  </blockquote>
                  <figcaption className="mt-5 flex flex-col gap-0.5">
                    <span className="text-sm font-bold">{item.name}</span>
                    <span className="micro text-muted">{item.position}</span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </DragRail>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {v.items.map((item, i) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${ui.goToSlide} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className="h-2 rounded-full transition-[width,background-color] duration-300 ease-out"
                style={{
                  width: i === index ? 24 : 8,
                  background: i === index ? "var(--accent)" : "var(--line)",
                }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="icon-btn h-9 w-9 disabled:opacity-40"
              aria-label={ui.previous}
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              <PrevIcon size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-btn h-9 w-9 disabled:opacity-40"
              aria-label={ui.next}
              disabled={index === count - 1}
              onClick={() => setIndex((i) => Math.min(count - 1, i + 1))}
            >
              <NextIcon size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
