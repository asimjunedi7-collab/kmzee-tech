import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dict } from "@/lib/content";
import { TECH_GROUPS } from "@/lib/site";

export function TechStack({ dict }: { dict: Dict }) {
  const t = dict.techStack;
  const labels: Record<(typeof TECH_GROUPS)[number]["key"], string> = {
    frontEnd: t.frontEnd,
    backEnd: t.backEnd,
    dataServices: t.dataServices,
    design: t.designLabel,
  };

  return (
    <section id="tech" aria-labelledby="tech-title" className="section pt-0">
      <div className="container-x">
        <SectionHeading id="tech-title" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {TECH_GROUPS.map((group, i) => (
            <Reveal key={group.key} delay={(i % 2) * 0.07}>
              <article className="card card-interactive h-full p-6 sm:p-7">
                <h3 className="micro font-semibold uppercase tracking-[0.12em] text-muted">{labels[group.key]}</h3>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.name} className="chip">
                      {item.image ? (
                        <img
                          src={`/images/tech/${item.image}`}
                          alt=""
                          width={20}
                          height={20}
                          loading="lazy"
                          className="h-5 w-5 object-contain"
                        />
                      ) : null}
                      {item.name}
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
