import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dict } from "@/lib/content";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/site";

// WhatsApp is the only contact channel for now. Phone numbers and email are left out by decision.
export function Contact({ dict }: { dict: Dict }) {
  const c = dict.contact;
  const countries = [c.countries.saudiArabia, c.countries.india, c.countries.unitedKingdom, c.countries.canada];

  return (
    <section id="contact" aria-labelledby="contact-title" className="section pt-0">
      <div className="container-x">
        <div className="card grid gap-12 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col">
            <SectionHeading id="contact-title" title={c.title} subtitle={c.subtitle} />

            <Reveal delay={0.12}>
              <div className="band band-card mt-10 p-7 sm:p-9">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sunrise text-deep">
                  <MessageCircle size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="h3 mt-6 text-2xl">{c.whatsappTitle}</h3>
                <p className="small mt-2 text-band-muted">{c.whatsappDesc}</p>
                <p dir="ltr" className="mt-6 text-2xl font-bold tabular-nums tracking-tight">
                  {WHATSAPP_DISPLAY}
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn press mt-7 bg-sunrise text-deep hover:brightness-95"
                >
                  {c.whatsappCta}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col">
            <Reveal delay={0.08}>
              <div className="frame">
                <img
                  src="/images/contact-map-2.png"
                  alt={c.mapAlt}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>

            <p className="micro mt-6 text-center text-muted">{c.availability}</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {countries.map((country) => (
                <li key={country} className="chip">
                  {country}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
