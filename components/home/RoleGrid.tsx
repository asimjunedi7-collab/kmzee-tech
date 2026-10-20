"use client";

import {
  BarChart3,
  Briefcase,
  Cloud,
  Code2,
  Palette,
  Server,
  Smartphone,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/components/ui/ColorIcon";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

// One icon and color per role, in the same order as the roles in data/copy.json.
const VISUALS: { icon: LucideIcon; tone: Tone }[] = [
  { icon: Briefcase, tone: "aqua" },
  { icon: Code2, tone: "sunrise" },
  { icon: Smartphone, tone: "coral" },
  { icon: Server, tone: "violet" },
  { icon: Palette, tone: "mint" },
  { icon: BarChart3, tone: "sea" },
  { icon: Cloud, tone: "aqua" },
  { icon: Target, tone: "sunrise" },
];

export function RoleGrid({ roles }: { roles: { title: string; desc: string }[] }) {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {roles.map((role, i) => {
        const visual = VISUALS[i % VISUALS.length];
        return (
          <Reveal key={role.title} delay={(i % 4) * 0.05} className="h-full">
            <TiltCard icon={visual.icon} tone={visual.tone} title={role.title} desc={role.desc} />
          </Reveal>
        );
      })}
    </div>
  );
}
