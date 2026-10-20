import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { dictionaries } from "@/lib/content";
import type { Locale } from "@/lib/seo";
import { ui } from "@/lib/ui";
import { About } from "./About";
import { Contact } from "./Contact";
import { Highlights } from "./Highlights";
import { Hero } from "./Hero";
import { Lead } from "./Lead";
import { PartnersMarquee } from "./PartnersMarquee";
import { Portfolio } from "./Portfolio";
import { Products } from "./Products";
import { Services } from "./Services";
import { Team } from "./Team";
import { TechStack } from "./TechStack";
import { Voices } from "./Voices";

// One page, two languages. The sections are identical for both; only the copy and direction change.
export function HomePage({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const t = ui[locale];
  const rtl = locale === "ar";

  return (
    <>
      <a href="#main" className="skip-link">
        {t.skipToContent}
      </a>
      <SiteHeader locale={locale} dict={dict} ui={t} />
      <main id="main">
        <Hero dict={dict} />
        <PartnersMarquee dict={dict} ui={t} />
        <About dict={dict} />
        <Services dict={dict} />
        <Highlights dict={dict} />
        <Products dict={dict} ui={t} />
        <TechStack dict={dict} />
        <Team dict={dict} />
        <Portfolio dict={dict} rtl={rtl} ui={t} />
        <Voices dict={dict} rtl={rtl} ui={t} />
        <Lead dict={dict} />
        <Contact dict={dict} />
      </main>
      <SiteFooter locale={locale} dict={dict} ui={t} />
    </>
  );
}
