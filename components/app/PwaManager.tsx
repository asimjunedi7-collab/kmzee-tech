"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { springDrawer } from "@/lib/motion";
import type { Locale } from "@/lib/seo";
import { ui } from "@/lib/ui";

// Registers the service worker in production builds and offers a refresh when a new
// version is waiting. The new version only takes over when the visitor asks for it.
export function PwaManager({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;

    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        if (registration.waiting && navigator.serviceWorker.controller) setWaiting(registration.waiting);
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) setWaiting(worker);
          });
        });
      })
      .catch(() => {
        // Registration can fail on plain http. The site still works without offline support.
      });

    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  return (
    <AnimatePresence>
      {waiting ? (
        <motion.div
          key="update"
          role="status"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={springDrawer}
          className="card fixed inset-x-4 top-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 p-3 ps-4"
        >
          <p className="micro font-semibold text-fg">{t.updateReady}</p>
          <button
            type="button"
            onClick={() => waiting.postMessage({ type: "SKIP_WAITING" })}
            className="btn btn-primary min-h-9 px-3.5 py-1.5 text-sm"
          >
            {t.refresh}
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
