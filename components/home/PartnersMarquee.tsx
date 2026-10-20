import type { Dict } from "@/lib/content";
import { CLIENT_LOGOS } from "@/lib/site";
import type { Ui } from "@/lib/ui";

// Logos scroll sideways in a slow, seamless loop. The track holds two copies so the loop joins with no gap.
// Hovering or focusing pauses it. Under reduced motion it becomes a plain scrollable row.
export function PartnersMarquee({ dict, ui }: { dict: Dict; ui: Ui }) {
  const p = dict.partners;

  return (
    <section id="partners" aria-labelledby="partners-title" className="border-y border-line bg-surface-2/40 py-8 sm:py-10">
      <div className="container-x text-center">
        <p className="eyebrow">{p.eyebrow}</p>
        <h2 id="partners-title" className="h3 mx-auto mt-2 max-w-2xl text-lg text-balance sm:text-xl">
          {p.title}
        </h2>
        <p className="micro mx-auto mt-2 max-w-xl text-muted">{p.subtitle}</p>
      </div>

      <div className="marquee mt-6" role="region" aria-label={ui.logoRail} tabIndex={0}>
        <ul className="marquee-track">
          {CLIENT_LOGOS.map((logo) => (
            <li key={`first-${logo.file}`} className="shrink-0">
              <LogoTile name={logo.name} file={logo.file} />
            </li>
          ))}
          {CLIENT_LOGOS.map((logo) => (
            <li key={`copy-${logo.file}`} className="shrink-0" aria-hidden="true">
              <LogoTile name={logo.name} file={logo.file} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LogoTile({ name, file }: { name: string; file: string }) {
  return (
    <span className="flex h-16 w-36 items-center justify-center rounded-xl border border-line bg-white p-2.5 shadow-sm">
      <img
        src={`/images/clients/${file}`}
        alt={name}
        width={480}
        height={480}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
