"use client";

import { AnimatePresence, motion } from "motion/react";
import { Contrast, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { springDefault } from "@/lib/motion";
import type { Ui } from "@/lib/ui";

type Mode = "system" | "light" | "dark";
const ORDER: Mode[] = ["system", "light", "dark"];
const STORAGE_KEY = "kmzee-theme";

function readStoredMode(): Mode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage can be blocked. Fall back to the system setting.
  }
  return "system";
}

function applyMode(mode: Mode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
  try {
    if (mode === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors. The choice still applies for this page view.
  }
}

// Three-way choice: follow the system, or force light or dark.
export function ThemeToggle({ ui }: { ui: Ui }) {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    setMode(readStoredMode());
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    applyMode(next);
  }

  // Sun for light, moon for dark, and a half-filled circle for "follow the system".
  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Contrast;
  const label = `${ui.theme}: ${ui.themeModes[mode]}`;

  return (
    <button type="button" onClick={cycle} className="icon-btn" aria-label={label} title={label}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={springDefault}
          className="grid place-items-center"
        >
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
