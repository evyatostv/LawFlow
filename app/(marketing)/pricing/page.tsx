import Link from "next/link";
import { getPlans } from "@/lib/plans";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-ink">בחרו תוכנית שמתאימה לקצב שלכם</h1>
        <p className="text-steel/80">כל תוכנית כוללת ניסיון חינם של 7 ימים והאפשרות לחבר תשלום מאוחר יותר.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="flex h-full flex-col rounded-3xl border border-steel/10 bg-white/80 p-6 shadow-soft">
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">{plan.name}</h2>
                <p className="text-sm text-steel/70">{plan.description}</p>
              </div>
              <div className="text-2xl font-semibold text-ink">
                {plan.priceCents == null
                  ? "מחיר מותאם"
                  : new Intl.NumberFormat("he-IL", {
                      style: "currency",
                      currency: plan.currency,
                      maximumFractionDigits: 0,
                    }).format(plan.priceCents / 100)}
                {plan.priceCents == null ? null : (
                  <span className="text-sm font-normal text-steel/70"> / {plan.interval === "month" ? "חודש" : "שנה"}</span>
                )}
              </div>
              <ul className="space-y-2 text-sm text-steel/80">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <Link href="/signup" className="mt-6">
              <Button className="w-full">התחילו ניסיון חינם</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
