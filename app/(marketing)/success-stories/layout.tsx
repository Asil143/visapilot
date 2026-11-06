import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success stories",
  description: "Share your immigration journey with StatusClock. We are still collecting verified stories.",
};

export default function SuccessStoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
