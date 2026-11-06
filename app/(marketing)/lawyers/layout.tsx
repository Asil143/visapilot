import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find an immigration attorney",
  description: "Submit an inquiry and we will try to connect you with a licensed immigration attorney. StatusClock is not a law firm.",
};

export default function LawyersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
