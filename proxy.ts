import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Invert the previous allowlist: unknown pages must stay public so Next.js
// can render not-found.tsx instead of a Clerk sign-in wall. Guest tools
// (dashboard, checklists, AI UI) stay public; APIs enforce auth themselves.
const isProtectedRoute = createRouteMatcher([
  "/settings(.*)",
  "/onboarding(.*)",
  "/admin(.*)",
  "/api/admin(.*)",
  "/api/chat(.*)",
  "/api/documents(.*)",
  "/api/profile(.*)",
  "/api/reminders(.*)",
  "/api/deadlines(.*)",
  "/api/forms(.*)",
  "/api/rfe-analyze(.*)",
  "/api/user(.*)",
  "/api/visa-cases(.*)",
  "/api/cases/check-status(.*)",
  "/api/cases/live-status(.*)",
  "/api/opt-tracker(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
