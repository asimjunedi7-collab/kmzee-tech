import type { LucideIcon } from "lucide-react";

export type Tone = "aqua" | "sunrise" | "coral" | "violet" | "mint" | "sea";

// A colorful icon tile. Its hover animation comes from the parent element, which must have the `group` class.
export function ColorIcon({ icon: Icon, tone, size = 20 }: { icon: LucideIcon; tone: Tone; size?: number }) {
  return (
    <span
      className={`icon-tile tone-${tone} transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110`}
    >
      <Icon size={size} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}
