import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dict } from "@/lib/content";
import type { Ui } from "@/lib/ui";
import { PlatformGrid } from "./PlatformGrid";
import { ProductTabs } from "./ProductTabs";

export function Products({ dict, ui }: { dict: Dict; ui: Ui }) {
  const p = dict.products;

  return (
    <section id="products" aria-labelledby="products-title" className="section">
      <div className="container-x">
        <SectionHeading id="products-title" title={p.title} subtitle={p.subtitle} />

        <PlatformGrid platforms={p.platforms} />

        <Reveal>
          <div className="card mt-10 p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
              <div>
                <h3 className="h2 text-3xl">{p.marketTitle}</h3>
                <p className="lead mt-4">{p.marketDesc}</p>
              </div>
              <ProductTabs
                label={p.marketTitle}
                tabs={p.tabs}
                whiteLabel={p.whiteLabelBenefits}
                franchise={p.franchise}
                ui={ui}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="band band-card mt-6 grid gap-4 p-6 sm:p-8 md:grid-cols-[1fr_1.4fr] md:items-center">
            <h3 className="h3 text-2xl">{p.partnerTitle}</h3>
            <p className="small text-band-muted">{p.partnerDesc}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
