import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immigration Explainers",
  description:
    "StatusClock explainers on H-1B, OPT, the visa bulletin, and USCIS processing times. Background reading — confirm current dates on USCIS.gov.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
