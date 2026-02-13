import Link from "next/link";
import { isGhPages } from "@/lib/deploy";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


function getTrialRemaining(end: Date | null) {
  if (!end) return null;
  const diffMs = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default async function BillingPage({ searchParams }: { searchParams?: { reason?: string } }) {
  if (isGhPages()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <h2 className="text-2xl font-semibold text-ink">חיוב ומנוי</h2>
          <p className="mt-2 text-sm text-steel/70">עמוד זה זמין בגרסה המארחת בשרת.</p>
        </Card>
      </div>
    );
  }

  const { auth } = await import("@/lib/auth");
  const { getBillingSummary, TRIAL_DAYS } = await import("@/lib/billing");
  const { prisma } = await import("@/lib/prisma");

  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <h2 className="text-2xl font-semibold text-ink">יש להתחבר כדי לצפות בחיובים</h2>
          <Link href="/login" className="mt-4 inline-flex">
            <Button>התחברות</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const subscription = user ? await getBillingSummary(user.id) : null;
  const trialRemaining = getTrialRemaining(subscription?.trialEndAt ?? null);
  const trialExpired = subscription?.status === "trialing" && subscription.trialEndAt && subscription.trialEndAt < new Date();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-ink">חיוב ומנוי</h1>
        <p className="text-sm text-steel/70">ניהול מצב המנוי ואמצעי התשלום.</p>
      </div>

      {searchParams?.reason === "paywall" || subscription?.status === "expired" || trialExpired ? (
        <Card>
          <h2 className="text-xl font-semibold text-ink">הגישה הושהתה</h2>
          <p className="mt-2 text-sm text-steel/70">הניסיון הסתיים ללא חיוב מוצלח. חברו אמצעי תשלום כדי להמשיך.</p>
        </Card>
      ) : null}

      {subscription ? (
        <Card>
          <h2 className="text-xl font-semibold text-ink">סטטוס מנוי</h2>
          <div className="mt-4 grid gap-3 text-sm text-steel/80">
            <div>תוכנית: <span className="text-ink">{subscription.plan?.name}</span></div>
            <div>סטטוס: <span className="text-ink">{subscription.status}</span></div>
            <div>ניסיון: <span className="text-ink">{TRIAL_DAYS} ימים</span></div>
            {trialRemaining !== null ? (
              <div>יתרת ניסיון: <span className="text-ink">{trialRemaining} ימים</span></div>
            ) : null}
            <div>החיוב הבא: <span className="text-ink">{subscription.nextChargeAt ? subscription.nextChargeAt.toISOString().slice(0, 10) : "טרם נקבע"}</span></div>
          </div>
          <div className="mt-4">
            <Link href="/choose-plan">
              <Button variant="ghost">ניהול תוכנית</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card>
          <h2 className="text-xl font-semibold text-ink">אין מנוי פעיל</h2>
          <p className="mt-2 text-sm text-steel/70">כדי להמשיך לשימוש מלא יש לבחור תוכנית.</p>
          <Link href="/choose-plan" className="mt-4 inline-flex">
            <Button>בחירת תוכנית</Button>
          </Link>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold text-ink">אמצעי תשלום</h2>
        <p className="mt-2 text-sm text-steel/70">ניתן לחבר אמצעי תשלום כדי לאפשר חיוב אוטומטי בתום הניסיון.</p>
        <Button className="mt-4">חיבור אמצעי תשלום</Button>
      </Card>
    </div>
  );
}