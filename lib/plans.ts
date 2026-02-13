import { prisma } from "@/lib/prisma";
import { planConfigs } from "@/lib/plan-config";
import type { PlanConfig } from "@/lib/plan-config";

export function formatPlanPrice(plan: PlanConfig) {
  if (plan.priceCents == null) return "מחיר מותאם";
  const amount = (plan.priceCents / 100).toLocaleString("he-IL", {
    style: "currency",
    currency: plan.currency,
    minimumFractionDigits: 0,
  });
  return `${amount} / ${plan.interval === "month" ? "חודש" : "שנה"}`;
}

export { planConfigs };

export async function ensurePlans() {
  await Promise.all(
    planConfigs.map((plan) =>
      prisma.plan.upsert({
        where: { slug: plan.id },
        update: {
          name: plan.name,
          description: plan.description,
          priceCents: plan.priceCents,
          currency: plan.currency,
          interval: plan.interval,
          features: plan.features,
          isActive: true,
          sortOrder: plan.sortOrder,
        },
        create: {
          slug: plan.id,
          name: plan.name,
          description: plan.description,
          priceCents: plan.priceCents,
          currency: plan.currency,
          interval: plan.interval,
          features: plan.features,
          isActive: true,
          sortOrder: plan.sortOrder,
        },
      })
    )
  );
}

export async function getPlans() {
  await ensurePlans();
  return prisma.plan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
}
