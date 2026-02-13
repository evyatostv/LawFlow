import { isGhPages } from "@/lib/deploy";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ChoosePlanClient from "./ChoosePlanClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default async function ChoosePlanPage() {
  if (isGhPages()) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-ink">בחירת תוכנית</h1>
        <p className="text-steel/80">בחירת תוכנית זמינה בגרסה המארחת בשרת.</p>
        <Link href="/">
          <Button variant="ghost">חזרה לדף הבית</Button>
        </Link>
      </div>
    );
  }

  const { auth } = await import("@/lib/auth");
  const { getPlans } = await import("@/lib/plans");
  const { prisma } = await import("@/lib/prisma");
  const { getEntitlementForUser } = await import("@/lib/billing");
  const { redirect } = await import("next/navigation");

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

  const { default: ChoosePlanClient } = await import("./ChoosePlanClient");

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