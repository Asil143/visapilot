import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visa Path Finder",
  description:
    "Answer a few questions to find the U.S. visa and immigration pathways worth researching next.",
};

export default function VisaFinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
