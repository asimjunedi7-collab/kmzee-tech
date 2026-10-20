import copy from "@/data/copy.json";
import sections from "@/data/copy-sections.json";
import type { Locale } from "./seo";

// Site copy: data/copy.json (from the live site) plus data/copy-sections.json (newer sections).
// Both files share the "team" key, so it is merged one level down to keep the roles and the rocket text.
export type Dict = typeof copy.en & typeof sections.en;

const en = {
  ...copy.en,
  ...sections.en,
  team: { ...copy.en.team, ...sections.en.team },
};

const ar = {
  ...(copy.ar as typeof copy.en),
  ...(sections.ar as typeof sections.en),
  team: { ...copy.ar.team, ...sections.ar.team },
};

export const dictionaries: Record<Locale, Dict> = { en, ar } as Record<Locale, Dict>;
