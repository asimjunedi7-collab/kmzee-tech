import type { Dict } from "@/lib/content";
import type { Locale } from "@/lib/seo";
import { COVERAGE, HOLDING_URL, LEGAL_NAME, SOCIALS } from "@/lib/site";
import type { Ui } from "@/lib/ui";

type Props = { locale: Locale; dict: Dict; ui: Ui };

export function SiteFooter({ locale, dict, ui }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-2/40">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href={locale === "en" ? "/" : "/ar/"} className="flex items-center gap-3 text-fg no-underline">
            <img src="/images/logo-128.webp" alt="" width={44} height={44} className="h-11 w-11" />
            <span className="text-lg font-bold">{dict.footer.brand}</span>
          </a>
          <p className="small mt-4 max-w-sm text-muted">
            {dict.footer.verticalOf}{" "}
            <a href={HOLDING_URL} className="font-semibold text-fg underline underline-offset-4 decoration-accent">
              KMZee Holding
            </a>
          </p>
        </div>

        <div>
          <p className="micro font-semibold uppercase tracking-[0.12em] text-muted">{ui.coverageLabel}</p>
          <ul className="mt-3 grid gap-2">
            {COVERAGE.map((country) => (
              <li key={country.code} className="small text-fg">
                {locale === "en" ? country.name : arabicCountry[country.code]}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="micro font-semibold uppercase tracking-[0.12em] text-muted">
            {locale === "en" ? "Follow" : "تابعنا"}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip no-underline press"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="micro text-muted">
            © {year} {LEGAL_NAME}. {ui.copyrightTail}
          </p>
          <a href="#top" className="micro font-semibold text-fg no-underline underline-offset-4 hover:underline">
            {ui.backToTop} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

const arabicCountry: Record<string, string> = {
  SA: "السعودية",
  IN: "الهند",
  GB: "بريطانيا",
  CA: "كندا",
};
