import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/layout/providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});
const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-editorial",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Never Miss an Immigration Deadline`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "F-1 visa checklist",
    "OPT unemployment tracker",
    "STEM OPT I-983",
    "H-1B cap season",
    "USCIS deadline tracker",
    "green card visa bulletin",
    "international students",
  ],
  openGraph: {
    title: `${SITE_NAME} — Never Miss an Immigration Deadline`,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Never Miss an Immigration Deadline`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${sans.variable} ${editorial.variable} h-full`}
        data-scroll-behavior="smooth"
        suppressHydrationWarning
        style={{ colorScheme: "light" }}
      >
        <body className="min-h-full font-sans antialiased">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-slate-950 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
