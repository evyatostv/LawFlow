"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { selectPlan } from "./actions";

type Plan = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  currency: string;
  interval: string;
  features: string[];
};

export default function ChoosePlanClient({ plans }: { plans: Plan[] }) {
  const [loading, setLoading] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSelect = async (planId: string) => {
    setLoading(planId);
    setMessage(null);
    const formData = new FormData();
    formData.append("planId", planId);
    const res = await selectPlan(formData);
    if (!res.ok) {
      setMessage(res.message ?? "שגיאה בבחירת תוכנית");
      setLoading(null);
      return;
    }
    window.location.href = "/app";
  };

  return (
    <div className="space-y-6">
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
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
            <Button
              className="mt-6 w-full"
              onClick={() => handleSelect(plan.id)}
              disabled={loading !== null}
            >
              {loading === plan.id ? "מפעילים ניסיון..." : "בחירת תוכנית"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
