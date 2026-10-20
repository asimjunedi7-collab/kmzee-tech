"use client";

import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Dict } from "@/lib/content";
import { springDefault, springDrawer } from "@/lib/motion";
import type { Locale } from "@/lib/seo";
import { LOCALE_PATHS } from "@/lib/site";
import type { Ui } from "@/lib/ui";

const SECTION_IDS = ["products", "services", "clients", "team", "contact"] as const;

type Props = { locale: Locale; dict: Dict; ui: Ui };

export function SiteHeader({ locale, dict, ui }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const home = LOCALE_PATHS[locale];
  const other: Locale = locale === "en" ? "ar" : "en";
  const labels: Record<(typeof SECTION_IDS)[number], string> = {
    products: dict.nav.products,
    services: dict.nav.services,
    clients: dict.nav.portfolio,
    team: dict.nav.team,
    contact: dict.nav.contact,
  };

  // Highlight the section that is currently in the middle of the screen.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header glass">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <a href={home} className="flex min-w-0 items-center gap-2.5 text-fg no-underline">
          <img src="/images/logo-128.webp" alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
          <span className="hidden truncate text-[0.95rem] font-bold min-[380px]:block">{dict.hero.brand}</span>
        </a>

        <nav aria-label={locale === "en" ? "Primary" : "القائمة الرئيسية"} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`${home}#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`relative block rounded-full px-3.5 py-2 text-[0.95rem] font-medium no-underline transition-colors ${
                    active === id ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {active === id ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-surface-2"
                      transition={springDefault}
                    />
                  ) : null}
                  <span className="relative">{labels[id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={LOCALE_PATHS[other]}
            hrefLang={other}
            lang={other}
            className="micro hidden h-10 items-center rounded-full border border-line px-4 font-semibold text-fg no-underline transition-colors hover:border-accent sm:inline-flex"
          >
            {ui.switchLanguageTo}
          </a>
          <ThemeToggle ui={ui} />
          <a href={`${home}#contact`} className="btn btn-primary hidden min-h-10 px-4 py-2 text-[0.95rem] md:inline-flex">
            {dict.hero.ctaContact}
          </a>
          <button
            type="button"
            className="icon-btn lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? ui.closeMenu : ui.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={springDrawer}
            style={{ transformOrigin: "top" }}
            className="card absolute inset-x-4 top-full mt-2 p-3 lg:hidden"
          >
            <nav aria-label={locale === "en" ? "Mobile" : "قائمة الجوال"}>
              <ul className="grid gap-1">
                {SECTION_IDS.map((id) => (
                  <li key={id}>
                    <a
                      href={`${home}#${id}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[1.0625rem] font-semibold text-fg no-underline hover:bg-surface-2 press"
                    >
                      {labels[id]}
                    </a>
                  </li>
                ))}
                <li className="mt-1 flex gap-2 sm:hidden">
                  <a
                    href={LOCALE_PATHS[other]}
                    hrefLang={other}
                    lang={other}
                    className="btn btn-ghost w-full min-h-11"
                  >
                    {ui.switchLanguageTo}
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
