import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact StatusClock for product questions, bugs, and account help. We do not provide legal advice.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
