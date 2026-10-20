import { InstallPrompt } from "./InstallPrompt";
import { PwaManager } from "./PwaManager";
import { WhatsAppFab } from "./WhatsAppFab";
import type { Locale } from "@/lib/seo";

// Client-only widgets that sit above the page: WhatsApp, install prompt, and update handling.
export function AppWidgets({ locale }: { locale: Locale }) {
  return (
    <>
      <WhatsAppFab locale={locale} />
      <InstallPrompt locale={locale} />
      <PwaManager locale={locale} />
    </>
  );
}
