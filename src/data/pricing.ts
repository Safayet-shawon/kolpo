// COST ESTIMATOR RATES.
//
// !!! PLACEHOLDER RATES !!!  The numbers below (BDT per sq ft) are illustrative defaults so the estimator works end to
// end. They are NOT KOLPO's real prices. Replace every `perSqft` with the studio's actual rates before relying on the
// estimator, and set PRICING_VERIFIED = true once you have. The UI always labels results "indicative, not a quotation".

export const PRICING_VERIFIED = false;
export const CURRENCY = "৳"; // Bangladeshi taka sign

export type ServiceKey = "architecture" | "interior" | "construction" | "all";

export interface Part {
  label: string;
  perSqft: number;
}

export interface EstimateOption {
  id: string;
  label: string;
  hint: string;
  /** Allowed area range in sq ft. */
  min: number;
  max: number;
  parts: Part[];
}

export interface EstimatorConfig {
  title: string;
  contactService: string; // value understood by the contact form
  options: EstimateOption[];
}

export const estimator: Record<ServiceKey, EstimatorConfig> = {
  architecture: {
    title: "What do you want designed?",
    contactService: "architecture",
    options: [
      { id: "home", label: "Home", hint: "House or villa", min: 300, max: 20000, parts: [{ label: "Architectural design", perSqft: 60 }] },
      { id: "building", label: "Building", hint: "Apartment or commercial", min: 2000, max: 500000, parts: [{ label: "Architectural design", perSqft: 50 }] },
      { id: "colony", label: "Colony", hint: "Masterplan community", min: 20000, max: 5000000, parts: [{ label: "Masterplan & design", perSqft: 35 }] },
    ],
  },
  interior: {
    title: "What do you want furnished?",
    contactService: "interior-design",
    options: [
      { id: "home", label: "Home", hint: "Apartment or house", min: 300, max: 20000, parts: [{ label: "Interior design & fit-out", perSqft: 1800 }] },
      { id: "office", label: "Office", hint: "Workspace", min: 300, max: 100000, parts: [{ label: "Interior design & fit-out", perSqft: 1500 }] },
      { id: "restaurant", label: "Restaurant", hint: "Cafe or dining", min: 300, max: 50000, parts: [{ label: "Interior design & fit-out", perSqft: 2200 }] },
    ],
  },
  construction: {
    title: "What do you want built?",
    contactService: "construction",
    options: [
      { id: "home", label: "Home", hint: "House or villa", min: 300, max: 20000, parts: [{ label: "Construction", perSqft: 3200 }] },
      { id: "building", label: "Building", hint: "Apartment or commercial", min: 2000, max: 500000, parts: [{ label: "Construction", perSqft: 2900 }] },
      { id: "colony", label: "Colony", hint: "Community development", min: 20000, max: 5000000, parts: [{ label: "Construction", perSqft: 2700 }] },
    ],
  },
  all: {
    title: "What do you want from us?",
    contactService: "multiple",
    options: [
      {
        id: "home",
        label: "Home",
        hint: "Design, interior, build",
        min: 300,
        max: 20000,
        parts: [
          { label: "Architectural design", perSqft: 60 },
          { label: "Interior design & fit-out", perSqft: 1800 },
          { label: "Construction", perSqft: 3200 },
        ],
      },
      {
        id: "building",
        label: "Building",
        hint: "Design, interior, build",
        min: 2000,
        max: 500000,
        parts: [
          { label: "Architectural design", perSqft: 50 },
          { label: "Interior design & fit-out", perSqft: 1500 },
          { label: "Construction", perSqft: 2900 },
        ],
      },
      {
        id: "colony",
        label: "Colony",
        hint: "Masterplan and build",
        min: 20000,
        max: 5000000,
        parts: [
          { label: "Masterplan & design", perSqft: 35 },
          { label: "Construction", perSqft: 2700 },
        ],
      },
    ],
  },
};

export function estimate(option: EstimateOption, sqft: number) {
  const lines = option.parts.map((p) => ({ label: p.label, perSqft: p.perSqft, amount: Math.round(p.perSqft * sqft) }));
  return { lines, total: lines.reduce((a, l) => a + l.amount, 0) };
}

/** Bangladeshi digit grouping: 1,50,000 (last three digits, then pairs). Done by hand so it does not depend on browser ICU data. */
export const groupBD = (n: number) => {
  const s = String(Math.round(n));
  if (s.length <= 3) return s;
  const head = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${head},${s.slice(-3)}`;
};
export const formatMoney = (n: number) => `${CURRENCY} ${groupBD(n)}`;
export const formatArea = (n: number) => groupBD(n);
