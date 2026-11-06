import type { Metadata } from "next";
import { LandingPage } from "@/components/layout/landing-page";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Understand your U.S. visa path",
  description: SITE_DESCRIPTION,
  alternates: { canonical: absoluteUrl() },
  openGraph: {
    title: `${SITE_NAME} — Understand your U.S. visa path`,
    description: SITE_DESCRIPTION,
    url: absoluteUrl(),
  },
};

export default function Home() {
  return (
    <>
      <LandingPage />
    </>
  );
}
