import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "H-1B employer lookup",
  description: "Sample H-1B sponsorship snapshot for well-known employers. Illustrative data, not an E-Verify database.",
};

export default function EmployerLookupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
