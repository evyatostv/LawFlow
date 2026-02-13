import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEntitlementForUser } from "@/lib/billing";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/login");
  }

  const entitlement = await getEntitlementForUser(user.id);
  if (entitlement.status !== "active") {
    redirect("/app/billing?reason=paywall");
  }

  return <>{children}</>;
}
