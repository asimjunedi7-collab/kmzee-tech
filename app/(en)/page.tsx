import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
