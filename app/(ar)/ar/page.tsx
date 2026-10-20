import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("ar");

export default function Page() {
  return <HomePage locale="ar" />;
}
