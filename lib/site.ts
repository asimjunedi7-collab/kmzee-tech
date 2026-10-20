// Site-wide constants. Values come from the live site (kmzee.tech) unless noted.

export const SITE_URL = "https://kmzee.tech";
export const SITE_NAME = "KMZee Technology";
export const HOLDING_URL = "https://kmzeeholding.com";
export const LEGAL_NAME = "KMZee Technology Private Limited";
export const FOUNDED = "2021";

// WhatsApp is the only contact channel (decision: 11 Oct 2026).
export const WHATSAPP_NUMBER = "966571126407";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_DISPLAY = "+966 57 112 6407";

// wa.me link with an optional pre-filled message. Used by the free-assessment CTA.
export function whatsappLink(message?: string) {
  return message ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}` : WHATSAPP_URL;
}

export const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/kmzee.tech" },
  { label: "Instagram", href: "https://www.instagram.com/kmzee.tech/" },
  { label: "X", href: "https://x.com/kmzee_tech" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/kmzee-tech/" },
];

// Countries the company serves, per the live site. Used for SEO schema.
export const COVERAGE = [
  { name: "Saudi Arabia", code: "SA" },
  { name: "India", code: "IN" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
];

export const LOCALE_PATHS = {
  en: "/",
  ar: "/ar/",
} as const;

// Client and partner logos. Duplicate logo files from the live site were removed.
export const CLIENT_LOGOS: { name: string; file: string }[] = [
  { name: "Khaled Cars", file: "kc-logo.webp" },
  { name: "KMZee Holding", file: "kmzee-holding.webp" },
  { name: "K2 Services", file: "k2-logo.webp" },
  { name: "KMZee Merch", file: "kmzee-merch.webp" },
  { name: "SS Enterprises", file: "ss-logo.webp" },
  { name: "IAMAcademy", file: "kmzee-academy.webp" },
  { name: "Elite Clean", file: "elite-clean.webp" },
  { name: "Bee", file: "bee_logo.png" },
  { name: "Mazadatcom", file: "mzdtkm.png" },
  { name: "Desert Solutions", file: "ds-logo.png" },
  { name: "First Line", file: "first-line.png" },
  { name: "Facilitiyfy", file: "facilitify-logo.png" },
  { name: "What's New", file: "whats-new-logo.png" },
  { name: "Daleel Cars", file: "daleel-cars.jpg" },
  { name: "AucSphere", file: "aucsphere.png" },
  { name: "Mawsool", file: "mawsool.png" },
  { name: "Colorful Orator", file: "colorful-orator.png" },
  { name: "Maheer", file: "maheer.webp" },
  { name: "InRide", file: "inride_new_logo.webp" },
  { name: "TIMPS", file: "tipms.webp" },
  { name: "Fixezee", file: "fixezee.webp" },
  { name: "Soumha", file: "soumha.jpg" },
  { name: "Unifier Games", file: "unifier-games.png" },
  { name: "Safqah", file: "safqah.png" },
  { name: "Defalcor", file: "defalcor.png" },
  { name: "Baariz", file: "baariz-new-logo.jpeg" },
  { name: "Ingl App", file: "ingl-app.png" },
  { name: "Smart Mobility", file: "sm-transport.webp" },
  { name: "Zodha App", file: "zodha-app.webp" },
  { name: "SwiftEx", file: "swiftex.jpg" },
];

type Tech = { name: string; image?: string };

// Technology stack. Items with an image show the logo, the rest show a text chip.
export const TECH_GROUPS: { key: "frontEnd" | "backEnd" | "dataServices" | "design"; items: Tech[] }[] = [
  {
    key: "frontEnd",
    items: [
      { name: "React", image: "react.webp" },
      { name: "Next.js", image: "next.webp" },
      { name: "Flutter", image: "flutter.webp" },
    ],
  },
  {
    key: "backEnd",
    items: [
      { name: "Node.js", image: "nodesvg.webp" },
      { name: "Django", image: "django.webp" },
      { name: "PHP" },
      { name: "Laravel" },
    ],
  },
  {
    key: "dataServices",
    items: [
      { name: "MongoDB", image: "mongodb.webp" },
      { name: "PostgreSQL", image: "postgres.webp" },
      { name: "MySQL", image: "mysql.webp" },
      { name: "Redis" },
      { name: "Firebase" },
      { name: "Supabase" },
    ],
  },
  {
    key: "design",
    items: [
      { name: "Figma", image: "figma.webp" },
      { name: "Adobe XD", image: "xd.webp" },
      { name: "Illustrator", image: "illustrator.webp" },
      { name: "Photoshop", image: "photoshop.webp" },
      { name: "After Effects", image: "after-effects.webp" },
      { name: "Premiere Pro", image: "premiere.webp" },
      { name: "InDesign", image: "indesign.webp" },
      { name: "Canva" },
    ],
  },
];
