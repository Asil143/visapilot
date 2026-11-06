import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about StatusClock checklists, the AI assistant, payments, and whether this is legal advice.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
