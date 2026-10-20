import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { Dict } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

const TONES = ["mint", "sunrise", "aqua"] as const;

// Lead magnet: a free project assessment. The button opens WhatsApp with a pre-filled message.
export function Lead({ dict }: { dict: Dict }) {
  const l = dict.lead;

  return (
    <section id="assessment" aria-labelledby="lead-title" className="section pt-0">
      <div className="container-x">
        <Reveal>
          <div className="band relative overflow-hidden rounded-[1.75rem] p-7 sm:p-12 lg:p-14">
            <div aria-hidden="true" className="anim-shimmer pointer-events-none absolute inset-0 opacity-60" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="eyebrow">{l.eyebrow}</p>
                <h2 id="lead-title" className="h2 mt-4 text-band-fg">
                  {l.title}
                </h2>
                <p className="lead mt-5">{l.subtitle}</p>
                <a
                  href={whatsappLink(l.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn press mt-8 bg-sunrise text-deep hover:brightness-95"
                >
                  {l.cta}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>

              <ul className="grid gap-3">
                {l.points.map((point, i) => (
                  <li key={point} className="band-card flex items-center gap-4 p-5">
                    <span className={`icon-tile tone-${TONES[i % TONES.length]}`}>
                      <Check size={20} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-band-fg">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
