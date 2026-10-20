"use client";

import {
  Boxes,
  Car,
  Gavel,
  HardHat,
  Puzzle,
  ShoppingCart,
  Stethoscope,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/components/ui/ColorIcon";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

// One icon and color per platform, in the same order as the copy in data/copy.json.
const VISUALS: { icon: LucideIcon; tone: Tone }[] = [
  { icon: ShoppingCart, tone: "aqua" },
  { icon: Gavel, tone: "sunrise" },
  { icon: Car, tone: "coral" },
  { icon: Stethoscope, tone: "mint" },
  { icon: Boxes, tone: "violet" },
  { icon: HardHat, tone: "sea" },
  { icon: Truck, tone: "sunrise" },
  { icon: Puzzle, tone: "aqua" },
];

export function PlatformGrid({ platforms }: { platforms: { title: string; desc: string }[] }) {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {platforms.map((platform, i) => {
        const visual = VISUALS[i % VISUALS.length];
        return (
          <Reveal key={platform.title} delay={(i % 4) * 0.05} className="h-full">
            <TiltCard icon={visual.icon} tone={visual.tone} title={platform.title} desc={platform.desc} />
          </Reveal>
        );
      })}
    </div>
  );
}
