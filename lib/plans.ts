export const PLAN_CATALOG = {
  h1b: { name: "H-1B Season Pack", price: 29 },
  opt: { name: "OPT / STEM OPT Pack", price: 19 },
  rfe: { name: "RFE Response Pack", price: 39 },
  greencard: { name: "Green Card Prep Pack", price: 49 },
  "all-access": { name: "All-Access Plan", price: 99 },
} as const;

export type PlanId = keyof typeof PLAN_CATALOG;

export function getPlan(id: string) {
  return PLAN_CATALOG[id as PlanId] ?? null;
}
