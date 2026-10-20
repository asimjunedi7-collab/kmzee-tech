import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dict } from "@/lib/content";
import { HOLDING_URL } from "@/lib/site";
import { AccomplishedCard, EarnedCard } from "./ImpactCharts";

// Three orbits turning around a core. The rings are decorative.
const RINGS = [
  { inset: "4%", spin: "anim-orbit", tone: "sunrise" },
  { inset: "16%", spin: "anim-orbit-rev", tone: "aqua" },
  { inset: "28%", spin: "anim-orbit", tone: "coral" },
] as const;

// The right-hand column reads top to bottom: "Since 2021", then the pie chart, then the bar chart.
// The heading and text on the left stay in view while the charts scroll.
export function About({ dict }: { dict: Dict }) {
  const a = dict.about;

  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container-x">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <SectionHeading id="about-title" eyebrow={a.introBrand} title={a.title} subtitle={a.subtitle} />
            <Reveal delay={0.12}>
              <div className="mt-8 space-y-5">
                <p className="small text-fg">
                  {a.introBrand} {a.introBeforeHolding}{" "}
                  <a
                    href={HOLDING_URL}
                    className="font-semibold text-fg underline underline-offset-4 decoration-accent"
                  >
                    {a.holdingName}
                  </a>{" "}
                  {a.introAfterHolding}
                </p>
                <p className="small text-muted">{a.paragraph2}</p>
                <p className="small font-semibold text-fg">{a.result}</p>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            <Reveal delay={0.08}>
              <SinceCard label={a.sinceLabel} value={a.sinceValue} caption={a.sinceText} />
            </Reveal>
            <Reveal>
              <AccomplishedCard dict={dict} />
            </Reveal>
            <Reveal>
              <EarnedCard dict={dict} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// "Since 2021": an animated orbit beside the year and the company's one-line description.
function SinceCard({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="card grid items-center gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
      <div className="relative mx-auto aspect-square w-40 overflow-x-clip sm:w-44" aria-hidden="true">
        {RINGS.map((ring) => (
          <div
            key={ring.inset}
            className={`absolute rounded-full border border-dashed border-line ${ring.spin}`}
            style={{ inset: ring.inset }}
          >
            <span
              className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md"
              style={{ background: `var(--tone-${ring.tone})` }}
            />
          </div>
        ))}
        <span className="absolute inset-[40%] rounded-full bg-accent shadow-lg" />
      </div>

      <div>
        <p className="micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <p className="mt-1 text-4xl font-bold leading-none tracking-tight sm:text-5xl">{value}</p>
        <p className="small mt-3 text-muted">{caption}</p>
      </div>
    </div>
  );
}
