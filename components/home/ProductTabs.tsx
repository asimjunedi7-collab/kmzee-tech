"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type KeyboardEvent } from "react";
import type { Dict } from "@/lib/content";
import { springDefault } from "@/lib/motion";
import type { Ui } from "@/lib/ui";

type Tab = "whiteLabel" | "franchise";
const TABS: Tab[] = ["whiteLabel", "franchise"];

type Props = {
  label: string;
  tabs: Dict["products"]["tabs"];
  whiteLabel: Dict["products"]["whiteLabelBenefits"];
  franchise: Dict["products"]["franchise"];
  ui: Ui;
};

// Switches between the two partnership models. A spring-driven pill slides between the tabs.
export function ProductTabs({ label, tabs, whiteLabel, franchise }: Props) {
  const [active, setActive] = useState<Tab>("whiteLabel");
  const id = useId();

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const current = TABS.indexOf(active);
    setActive(TABS[(current + direction + TABS.length) % TABS.length]);
  }

  const labels: Record<Tab, string> = { whiteLabel: tabs.whiteLabel, franchise: tabs.franchise };

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="inline-flex max-w-full rounded-full border border-line bg-surface-2 p-1"
      >
        {TABS.map((tab) => {
          const selected = active === tab;
          return (
            <button
              key={tab}
              id={`${id}-${tab}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab)}
              className={`relative rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors press ${
                selected ? "text-on-primary" : "text-muted hover:text-fg"
              }`}
            >
              {selected ? (
                <motion.span
                  layoutId={`${id}-pill`}
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={springDefault}
                />
              ) : null}
              <span className="relative">{labels[tab]}</span>
            </button>
          );
        })}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${active}-tab`} className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          {active === "whiteLabel" ? (
            <motion.ul
              key="whiteLabel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springDefault}
              className="grid gap-3 sm:grid-cols-2"
            >
              {whiteLabel.map((benefit) => (
                <li key={benefit.title} className="rounded-2xl bg-surface-2 p-4">
                  <p className="font-bold">{benefit.title}</p>
                  <p className="micro mt-1 text-muted">{benefit.desc}</p>
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.ul
              key="franchise"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springDefault}
              className="grid gap-3"
            >
              <li className="px-1 pb-1 text-lg font-bold">{franchise.title}</li>
              {franchise.items.map((item) => (
                <li key={item.title} className="rounded-2xl bg-surface-2 p-4">
                  <p className="font-bold">{item.title}</p>
                  <p className="micro mt-1 text-muted">{item.desc}</p>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
