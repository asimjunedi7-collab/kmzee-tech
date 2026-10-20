import { DragRail } from "@/components/ui/DragRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dict } from "@/lib/content";
import { CLIENT_LOGOS } from "@/lib/site";
import type { Ui } from "@/lib/ui";

type Props = { dict: Dict; rtl: boolean; ui: Ui };

export function Portfolio({ dict, rtl, ui }: Props) {
  const p = dict.portfolio;

  return (
    <section id="clients" aria-labelledby="portfolio-title" className="section">
      <div className="container-x">
        <SectionHeading id="portfolio-title" title={p.title} subtitle={p.subtitle} />
        <p className="micro mt-6 text-muted">{ui.dragHint}</p>
      </div>

      <div className="container-x mt-8">
        <DragRail label={ui.logoRail} rtl={rtl}>
          {CLIENT_LOGOS.map((logo) => (
            <figure key={logo.file} className="m-0 w-44 sm:w-52">
              <div className="h-28 rounded-2xl border border-line bg-white p-4 shadow-sm sm:h-32">
                <img
                  src={`/images/clients/${logo.file}`}
                  alt={logo.name}
                  width={480}
                  height={480}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-contain"
                />
              </div>
              <figcaption className="micro mt-3 text-center text-muted">{logo.name}</figcaption>
            </figure>
          ))}
        </DragRail>
      </div>
    </section>
  );
}
