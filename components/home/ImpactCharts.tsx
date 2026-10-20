"use client";

import { motion } from "motion/react";
import impact from "@/data/impact.json";
import { CountUp } from "@/components/ui/CountUp";
import type { Dict } from "@/lib/content";

// Chart values come from data/impact.json. The 2M+ total is confirmed. Other values are placeholders.
const CX = 100;
const CY = 100;
const R = 78;
const GAP = 0.04; // gap between slices, in radians
const TONES = ["aqua", "sunrise", "coral", "violet"] as const;

function arc(start: number, end: number) {
  const x0 = CX + R * Math.cos(start);
  const y0 = CY + R * Math.sin(start);
  const x1 = CX + R * Math.cos(end);
  const y1 = CY + R * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
}

const total = impact.accomplished.reduce((sum, item) => sum + item.value, 0);
let cursor = -Math.PI / 2;
const slices = impact.accomplished.map((item, i) => {
  const span = (item.value / total) * Math.PI * 2;
  const start = cursor + GAP / 2;
  const end = cursor + span - GAP / 2;
  cursor += span;
  return {
    id: item.id,
    tone: TONES[i % TONES.length],
    d: arc(start, end),
    pct: Math.round((item.value / total) * 100),
  };
});

const maxSar = Math.max(...impact.earnedByYear.map((item) => item.sar));

function formatSar(value: number) {
  return value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : `${Math.round(value / 1000)}K`;
}

// Donut chart of where the work has delivered. The arcs draw in when the card comes into view.
export function AccomplishedCard({ dict }: { dict: Dict }) {
  const t = dict.impact;

  return (
    <div className="card p-6 sm:p-8">
      <p className="micro font-semibold uppercase tracking-[0.12em] text-muted">{t.eyebrow}</p>
      <h3 className="h3 mt-2 text-xl">{t.accomplishedTitle}</h3>

      <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row">
        <svg viewBox="0 0 200 200" className="h-48 w-48 shrink-0" aria-hidden="true">
          <circle cx={CX} cy={CY} r={R} fill="none" strokeWidth={24} style={{ stroke: "var(--line)" }} />
          {slices.map((slice, i) => (
            <motion.path
              key={slice.id}
              d={slice.d}
              fill="none"
              strokeWidth={24}
              strokeLinecap="round"
              style={{ stroke: `var(--tone-${slice.tone})` }}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.1, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>

        <ul className="grid w-full gap-3">
          {slices.map((slice) => (
            <li key={slice.id} className="flex items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: `var(--tone-${slice.tone})` }}
                aria-hidden="true"
              />
              <span className="small flex-1">{t.categories[slice.id as keyof typeof t.categories]}</span>
              <span className="font-bold tabular-nums">
                <CountUp text={`${slice.pct}%`} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Bar chart of revenue by year. The bars grow up when the card comes into view.
export function EarnedCard({ dict }: { dict: Dict }) {
  const t = dict.impact;

  return (
    <div className="card p-6 sm:p-8">
      <p className="micro font-semibold uppercase tracking-[0.12em] text-muted">{t.earnedTitle}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-accent sm:text-4xl">{t.earnedTotal}</p>
      <p className="micro mt-3 text-muted">{t.barTitle}</p>

      <div className="mt-8 flex h-56 items-end gap-3 sm:gap-4">
        {impact.earnedByYear.map((item, i) => (
          <div key={item.year} className="flex h-full flex-1 flex-col items-center">
            <span className="micro font-bold tabular-nums">
              <CountUp text={formatSar(item.sar)} />
            </span>
            <div className="mt-2 flex w-full flex-1 items-end">
              <motion.div
                className="w-full rounded-t-xl"
                style={{ background: "linear-gradient(180deg, var(--tone-aqua), var(--accent))" }}
                initial={{ height: 0 }}
                whileInView={{ height: `${(item.sar / maxSar) * 100}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="micro mt-2 text-muted">{item.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
