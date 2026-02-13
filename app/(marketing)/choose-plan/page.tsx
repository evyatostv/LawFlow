import { auth } from "@/lib/auth";
import { getPlans } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { getEntitlementForUser } from "@/lib/billing";
import { redirect } from "next/navigation";
import ChoosePlanClient from "./ChoosePlanClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ChoosePlanPage() {
  const session = await auth();
  const plans = await getPlans();

  if (!session?.user?.email) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-ink">בחרו תוכנית כדי להתחיל</h1>
        <p className="text-steel/80">כדי לבחור תוכנית יש להתחבר לחשבון שיצרתם.</p>
        <Link href="/login">
          <Button>התחברות</Button>
        </Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (user) {
    const entitlement = await getEntitlementForUser(user.id);
    if (entitlement.status === "active") {
      redirect("/app");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-ink">בחירת תוכנית</h1>
        <p className="text-steel/80">7 ימי ניסיון חינם. ניתן לחבר תשלום מאוחר יותר.</p>
      </div>
      <ChoosePlanClient plans={plans} />
    </div>
  );
}
