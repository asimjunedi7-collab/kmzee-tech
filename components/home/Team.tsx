import { Reveal } from "@/components/ui/Reveal";
import type { Dict } from "@/lib/content";
import { WHATSAPP_URL } from "@/lib/site";
import { Rocket } from "./Rocket";
import { RoleGrid } from "./RoleGrid";

export function Team({ dict }: { dict: Dict }) {
  const t = dict.team;

  return (
    <section id="team" aria-labelledby="team-title" className="section">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="team-title" className="h2">
              {t.title}
            </h2>
            <p className="lead mt-5">{t.subtitle}</p>
            <p className="small mt-6 text-muted">{t.closing}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
              {dict.contact.whatsappCta}
            </a>
          </div>

          <Reveal delay={0.08}>
            <div className="band band-card relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8">
              <p className="micro font-semibold uppercase tracking-[0.12em] text-band-muted">
                {dict.team.rocketLabel}
              </p>
              <p className="h3 mt-2 text-band-fg">{dict.team.rocketTitle}</p>
              <div className="mt-6">
                <Rocket label={dict.team.rocketTitle} />
              </div>
            </div>
          </Reveal>
        </div>

        <RoleGrid roles={t.roles} />
      </div>
    </section>
  );
}
