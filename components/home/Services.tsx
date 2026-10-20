import { BarChart3, Check, Code2, Megaphone, Palette, Settings2, Target } from "lucide-react";
import { ColorIcon, type Tone } from "@/components/ui/ColorIcon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dict } from "@/lib/content";

// Each card gets its own icon and color. The order matches the cards in data/copy.json.
const capabilityIcons = [Code2, Palette, Megaphone];
const capabilityTones: Tone[] = ["aqua", "coral", "sunrise"];
const businessIcons = [Target, Settings2, BarChart3];
const businessTones: Tone[] = ["mint", "violet", "sea"];

export function Services({ dict }: { dict: Dict }) {
  const s = dict.services;
  const b = dict.business;

  return (
    <section id="services" aria-labelledby="services-title" className="section pt-0">
      <div className="container-x">
        <SectionHeading id="services-title" title={s.title} subtitle={s.subtitle} />

        <p className="eyebrow mt-16">{s.capabilitiesLabel}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {s.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.07}>
              <article className="card card-interactive group press h-full p-6 sm:p-7">
                <div className="flex items-center gap-4">
                  <ColorIcon icon={capabilityIcons[i]} tone={capabilityTones[i]} />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold tracking-[0.14em] text-accent">{card.title}</h3>
                    <p className="micro mt-0.5 text-muted">{card.subtitle}</p>
                  </div>
                </div>
                <ul className="mt-5 grid gap-3">
                  {card.items.map((item) => (
                    <li key={item} className="small flex items-start gap-3">
                      <Check size={16} strokeWidth={2.2} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="eyebrow mt-16">{b.label}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {b.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.07}>
              <article className="card card-interactive group press h-full p-6 sm:p-7">
                <div className="flex items-center gap-4">
                  <ColorIcon icon={businessIcons[i]} tone={businessTones[i]} />
                  <h3 className="h3">{card.title}</h3>
                </div>
                <ul className="mt-5 grid gap-3">
                  {card.items.map((item) => (
                    <li key={item} className="small flex items-start gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
