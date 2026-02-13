export type PlanConfig = {
  id: string;
  name: string;
  description: string;
  priceCents: number | null;
  currency: string;
  interval: "month" | "year";
  features: string[];
  sortOrder: number;
};

const parsePrice = (value: string | undefined) => {
  if (!value) return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

export const planConfigs: PlanConfig[] = [
  {
    id: "basic",
    name: process.env.PLAN_BASIC_NAME ?? "Basic",
    description: process.env.PLAN_BASIC_DESC ?? "למשרדים בתחילת הדרך.",
    priceCents: parsePrice(process.env.PLAN_BASIC_PRICE_CENTS),
    currency: process.env.PLAN_CURRENCY ?? "ILS",
    interval: (process.env.PLAN_INTERVAL as "month" | "year") ?? "month",
    features: ["תיקים ומשימות", "מסמכים ותבניות", "דוחות בסיסיים"],
    sortOrder: 1,
  },
  {
    id: "advanced",
    name: process.env.PLAN_ADVANCED_NAME ?? "Advanced",
    description: process.env.PLAN_ADVANCED_DESC ?? "למשרדים בצמיחה מהירה.",
    priceCents: parsePrice(process.env.PLAN_ADVANCED_PRICE_CENTS),
    currency: process.env.PLAN_CURRENCY ?? "ILS",
    interval: (process.env.PLAN_INTERVAL as "month" | "year") ?? "month",
    features: ["אוטומציות מתקדמות", "ניהול חיובים", "תמיכה מועדפת"],
    sortOrder: 2,
  },
  {
    id: "pro",
    name: process.env.PLAN_PRO_NAME ?? "Pro",
    description: process.env.PLAN_PRO_DESC ?? "למשרדים עם צוותים מרובים.",
    priceCents: parsePrice(process.env.PLAN_PRO_PRICE_CENTS),
    currency: process.env.PLAN_CURRENCY ?? "ILS",
    interval: (process.env.PLAN_INTERVAL as "month" | "year") ?? "month",
    features: ["ניהול צוותים", "דוחות מתקדמים", "אבטחה מורחבת"],
    sortOrder: 3,
  },
];
