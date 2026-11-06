export const SITE_NAME = "StatusClock";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://statusclock.com"
).replace(/\/$/, "");

export const SITE_DESCRIPTION =
  "A clearer way to understand U.S. visa pathways, prepare for deadlines, and keep your immigration journey organized.";

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@statusclock.com";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}
