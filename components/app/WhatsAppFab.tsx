"use client";

import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { springMomentum } from "@/lib/motion";
import type { Locale } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/site";
import { ui } from "@/lib/ui";

// WhatsApp is the only contact channel, so the floating button stays in reach on every screen.
export function WhatsAppFab({ locale }: { locale: Locale }) {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ui[locale].whatsappFab}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springMomentum, delay: 1.2 }}
      className="press fixed bottom-4 end-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-on-primary shadow-lg"
    >
      <MessageCircle size={24} strokeWidth={1.8} aria-hidden="true" />
    </motion.a>
  );
}
