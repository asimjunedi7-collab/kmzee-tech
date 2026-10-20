import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dict } from "@/lib/content";

export function Highlights({ dict }: { dict: Dict }) {
  const t = dict.transformation;

  return (
    <section id="transformation-highlights" aria-labelledby="highlights-title" className="band section">
      <div className="container-x">
        <SectionHeading id="highlights-title" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {t.highlights.map((item, i) => (
            <Reveal key={item.company} delay={(i % 2) * 0.08}>
              <article className="band-card card-interactive press flex h-full flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-sunrise px-3 py-1 text-sm font-bold text-deep">{item.company}</span>
                  <span className="micro text-band-muted">{item.duration}</span>
                </div>

                <h3 className="h3 mt-5 text-2xl">{item.title}</h3>

                <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6">
                  {item.metrics.map((metric, j) => (
                    <Reveal key={metric.label} delay={0.15 + j * 0.08}>
                      <div>
                        <dt className="micro text-band-muted">{metric.label}</dt>
                        <dd className="mt-1 text-xl font-bold leading-tight tabular-nums sm:text-2xl">
                          <CountUp text={metric.value} />
                        </dd>
                      </div>
                    </Reveal>
                  ))}
                </dl>

                <p className="micro mt-auto border-t border-band-line pt-5 text-band-muted">{item.scope}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="lead mx-auto mt-14 max-w-2xl text-center text-band-muted">{t.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
