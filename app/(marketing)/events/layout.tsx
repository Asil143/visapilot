import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming StatusClock webinars. Join the waitlist to hear when the first session is scheduled.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
