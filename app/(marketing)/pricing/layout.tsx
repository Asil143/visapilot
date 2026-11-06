import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free checklists plus one-time event packs and an All-Access plan for F-1, OPT, H-1B, RFE, and green card.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
