// Interface strings that are not part of the site copy (buttons, labels, prompts).
// Site copy lives in data/copy.json.

import type { Locale } from "./seo";

export type Ui = {
  skipToContent: string;
  openMenu: string;
  closeMenu: string;
  menu: string;
  theme: string;
  themeModes: { system: string; light: string; dark: string };
  whatsappFab: string;
  install: string;
  installLead: string;
  installCta: string;
  notNow: string;
  dismiss: string;
  iosTitle: string;
  iosStep1: string;
  iosStep2: string;
  updateReady: string;
  refresh: string;
  dragHint: string;
  previous: string;
  next: string;
  goToSlide: string;
  testimonials: string;
  logoRail: string;
  backToTop: string;
  coverageLabel: string;
  switchLanguage: string;
  switchLanguageTo: string;
  copyrightTail: string;
};

const en: Ui = {
  skipToContent: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menu: "Menu",
  theme: "Theme",
  themeModes: { system: "System", light: "Light", dark: "Dark" },
  whatsappFab: "Chat with us on WhatsApp",
  install: "Install app",
  installLead: "Add KMZee to your device for quick access.",
  installCta: "Install",
  notNow: "Not now",
  dismiss: "Dismiss",
  iosTitle: "Add KMZee to your Home Screen",
  iosStep1: "Tap the Share button in Safari.",
  iosStep2: "Choose “Add to Home Screen”.",
  updateReady: "A new version of this site is ready.",
  refresh: "Refresh",
  dragHint: "Drag or use the arrow keys to explore",
  previous: "Previous",
  next: "Next",
  goToSlide: "Go to testimonial",
  testimonials: "Client testimonials",
  logoRail: "Client and partner logos",
  backToTop: "Back to top",
  coverageLabel: "Coverage",
  switchLanguage: "Language",
  switchLanguageTo: "العربية",
  copyrightTail: "All rights reserved.",
};

const ar: Ui = {
  skipToContent: "تخطي إلى المحتوى",
  openMenu: "فتح القائمة",
  closeMenu: "إغلاق القائمة",
  menu: "القائمة",
  theme: "المظهر",
  themeModes: { system: "حسب الجهاز", light: "فاتح", dark: "داكن" },
  whatsappFab: "تواصل معنا عبر واتساب",
  install: "تثبيت التطبيق",
  installLead: "أضف KMZee إلى جهازك للوصول السريع.",
  installCta: "تثبيت",
  notNow: "ليس الآن",
  dismiss: "إغلاق",
  iosTitle: "أضف KMZee إلى الشاشة الرئيسية",
  iosStep1: "اضغط على زر المشاركة في Safari.",
  iosStep2: "اختر «إضافة إلى الشاشة الرئيسية».",
  updateReady: "يتوفر إصدار جديد من هذا الموقع.",
  refresh: "تحديث",
  dragHint: "اسحب أو استخدم أسهم لوحة المفاتيح للاستعراض",
  previous: "السابق",
  next: "التالي",
  goToSlide: "انتقل إلى الشهادة",
  testimonials: "آراء العملاء",
  logoRail: "شعارات العملاء والشركاء",
  backToTop: "العودة إلى الأعلى",
  coverageLabel: "نطاق الخدمة",
  switchLanguage: "اللغة",
  switchLanguageTo: "English",
  copyrightTail: "جميع الحقوق محفوظة.",
};

export const ui: Record<Locale, Ui> = { en, ar };
