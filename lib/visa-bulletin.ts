// Shared Visa Bulletin data — update this file when DOS publishes a new month.
export const BULLETIN_MONTH = "November 2026";
export const BULLETIN_SOURCE = "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html";

export interface BulletinRow {
  category: string;
  chargeability: string;
  china: string;
  india: string;
  mexico: string;
  philippines: string;
}

export const FINAL_ACTION: BulletinRow[] = [
  { category: "EB-1", chargeability: "C", china: "01AUG23", india: "01FEB23", mexico: "C", philippines: "C" },
  { category: "EB-2", chargeability: "01APR25", china: "01OCT21", india: "01NOV13", mexico: "01APR25", philippines: "01APR25" },
  { category: "EB-3 Skilled/Prof", chargeability: "15JUN24", china: "22JAN22", india: "22JAN14", mexico: "15JUN24", philippines: "15AUG23" },
  { category: "EB-3 Other", chargeability: "01JUN22", china: "01OCT19", india: "22JAN14", mexico: "01JUN22", philippines: "01JAN22" },
  { category: "EB-4", chargeability: "15DEC22", china: "15DEC22", india: "15DEC22", mexico: "15DEC22", philippines: "15DEC22" },
  { category: "Certain Religious Workers", chargeability: "15DEC22", china: "15DEC22", india: "15DEC22", mexico: "15DEC22", philippines: "15DEC22" },
  { category: "EB-5 Unreserved", chargeability: "C", china: "01DEC16", india: "01DEC23", mexico: "C", philippines: "C" },
  { category: "EB-5 Rural", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
  { category: "EB-5 High Unemployment", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
  { category: "EB-5 Infrastructure", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
];

export const DATES_FOR_FILING: BulletinRow[] = [
  { category: "EB-1", chargeability: "C", china: "01JUL24", india: "01JUL24", mexico: "C", philippines: "C" },
  { category: "EB-2", chargeability: "15MAR26", china: "01JAN23", india: "15JAN15", mexico: "15MAR26", philippines: "15MAR26" },
  { category: "EB-3 Skilled/Prof", chargeability: "01AUG24", china: "01APR24", india: "15JAN15", mexico: "01AUG24", philippines: "01JAN24" },
  { category: "EB-3 Other", chargeability: "01JUL22", china: "01OCT20", india: "15JAN15", mexico: "01JUL22", philippines: "01JUN22" },
  { category: "EB-4", chargeability: "01JAN25", china: "01JAN25", india: "01JAN25", mexico: "01JAN25", philippines: "01JAN25" },
  { category: "Certain Religious Workers", chargeability: "01JAN25", china: "01JAN25", india: "01JAN25", mexico: "01JAN25", philippines: "01JAN25" },
  { category: "EB-5 Unreserved", chargeability: "C", china: "01MAR21", india: "01MAY24", mexico: "C", philippines: "C" },
  { category: "EB-5 Rural", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
  { category: "EB-5 High Unemployment", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
  { category: "EB-5 Infrastructure", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
];

export const HISTORY = [
  { month: "Nov 2026", eb2India: "01NOV13", eb3India: "22JAN14", eb2China: "01OCT21", eb3China: "22JAN22" },
  { month: "Oct 2026", eb2India: "01NOV13", eb3India: "01JAN14", eb2China: "01OCT21", eb3China: "08JAN22" },
  { month: "Sep 2026", eb2India: "U", eb3India: "01JAN14", eb2China: "01SEP21", eb3China: "01JAN22" },
  { month: "Jun 2026", eb2India: "01APR12", eb3India: "01JUN12", eb2China: "01JAN19", eb3China: "01JUL19" },
  { month: "May 2026", eb2India: "01MAR12", eb3India: "01MAY12", eb2China: "01DEC18", eb3China: "01MAY19" },
  { month: "Apr 2026", eb2India: "01FEB12", eb3India: "01APR12", eb2China: "01NOV18", eb3China: "01MAR19" },
  { month: "Mar 2026", eb2India: "01JAN12", eb3India: "01MAR12", eb2China: "01OCT18", eb3China: "01MAR19" },
];

export const COUNTRY_COLS = [
  { key: "chargeability" as const, label: "All others" },
  { key: "china" as const, label: "China" },
  { key: "india" as const, label: "India" },
  { key: "mexico" as const, label: "Mexico" },
  { key: "philippines" as const, label: "Philippines" },
];

const MONTH_INDEX: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

/** Parse DOS bulletin dates like 01NOV13. C/U return null. */
export function parseDate(value: string): Date | null {
  if (!value || value === "C" || value === "U") return null;
  const match = value.match(/^(\d{2})([A-Z]{3})(\d{2})$/);
  if (!match) return null;
  const month = MONTH_INDEX[match[2]];
  if (month === undefined) return null;
  const year = Number(match[3]);
  return new Date(year >= 50 ? 1900 + year : 2000 + year, month, Number(match[1]));
}

export function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

/** Rough months of priority-date movement per bulletin month, from HISTORY. */
export function getMovementSpeed(category: string, country: string): number | null {
  const key =
    country === "india" && category.startsWith("EB-2") ? "eb2India" :
    country === "india" && category.startsWith("EB-3") ? "eb3India" :
    country === "china" && category.startsWith("EB-2") ? "eb2China" :
    country === "china" && category.startsWith("EB-3") ? "eb3China" :
    null;
  if (!key) return 1;

  const dates = HISTORY
    .map((row) => parseDate(row[key]))
    .filter((d): d is Date => d !== null);
  if (dates.length < 2) return null;
  const newest = dates[0];
  const oldest = dates[dates.length - 1];
  const span = monthsBetween(oldest, newest);
  const bulletins = Math.max(1, HISTORY.length - 1);
  return Math.max(0, span / bulletins);
}
