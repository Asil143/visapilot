import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immigration glossary",
  description: "Plain-language definitions of USCIS, OPT, H-1B, and green card terms.",
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
