"use client";

import { AnimatePresence, motion } from "motion/react";
import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { springDrawer } from "@/lib/motion";
import type { Locale } from "@/lib/seo";
import { ui } from "@/lib/ui";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

const DISMISS_KEY = "kmzee-install-dismissed-at";
const DISMISS_DAYS = 14;

// Offers install once the visitor has scrolled past the hero. Chrome and Edge use the
// native prompt. iOS Safari has no prompt API, so it gets a two-step sheet instead.
export function InstallPrompt({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as NavigatorWithStandalone).standalone === true;
    if (standalone) return;

    let recentlyDismissed = false;
    try {
      const at = Number(localStorage.getItem(DISMISS_KEY));
      recentlyDismissed = at > 0 && Date.now() - at < DISMISS_DAYS * 86_400_000;
    } catch {
      // Storage is blocked. Show the prompt.
    }
    setDismissed(recentlyDismissed);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setDismissed(true);
    };
    const onScroll = () => {
      if (window.scrollY > 480) setScrolled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const canInstall = deferred !== null || isIos;
  const visible = canInstall && scrolled && !dismissed;

  async function install() {
    if (isIos) {
      setSheetOpen(true);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setDismissed(true);
    setDeferred(null);
  }

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Ignore storage errors. The prompt will simply return on the next visit.
    }
    setDismissed(true);
    setSheetOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="install-pill"
            role="region"
            aria-label={t.install}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={springDrawer}
            style={{ transformOrigin: "bottom start" }}
            className="card fixed bottom-4 start-4 z-40 flex max-w-[min(22rem,calc(100vw-6.5rem))] items-center gap-3 p-3 ps-4"
          >
            <Download size={20} strokeWidth={1.8} className="shrink-0 text-accent" aria-hidden="true" />
            <div className="min-w-0">
              <p className="micro font-semibold text-fg">{t.install}</p>
              <p className="micro text-muted">{t.installLead}</p>
            </div>
            <button type="button" onClick={install} className="btn btn-primary min-h-9 px-3.5 py-1.5 text-sm">
              {t.installCta}
            </button>
            <button type="button" onClick={dismiss} aria-label={t.dismiss} className="icon-btn h-9 w-9 shrink-0">
              <X size={16} aria-hidden="true" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {sheetOpen && isIos ? (
          <motion.div
            key="ios-sheet"
            role="dialog"
            aria-modal="false"
            aria-label={t.iosTitle}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={springDrawer}
            className="card fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="h3">{t.iosTitle}</h3>
              <button type="button" onClick={() => setSheetOpen(false)} aria-label={t.closeMenu} className="icon-btn h-9 w-9 shrink-0">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <ol className="small mt-4 grid gap-3">
              <li className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2">
                  <Share size={16} aria-hidden="true" />
                </span>
                {t.iosStep1}
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-bold">+</span>
                {t.iosStep2}
              </li>
            </ol>
            <button type="button" onClick={dismiss} className="btn btn-ghost mt-5 w-full min-h-11">
              {t.notNow}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
