import { isGhPages } from "@/lib/deploy";

function StaticAppNotice() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-steel/10 bg-white/80 p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-ink">המערכת זמינה בגרסה המארחת בשרת</h1>
        <p className="mt-2 text-sm text-steel/70">
          גרסת GitHub Pages מציגה את אתר השיווק בלבד. כדי להשתמש במערכת, עברו לגרסה בענן.
        </p>
      </div>
    </div>
  );
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (isGhPages()) {
    return <StaticAppNotice />;
  }

  const { redirect } = await import("next/navigation");
  const { auth } = await import("@/lib/auth");
  const { prisma } = await import("@/lib/prisma");
  const { getEntitlementForUser } = await import("@/lib/billing");

  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { email: email as string } });
  if (!user) {
    redirect("/login");
  }

  const entitlement = await getEntitlementForUser(user.id);
  if (entitlement.status !== "active") {
    redirect("/app/billing?reason=paywall");
  }

  return <>{children}</>;
}
