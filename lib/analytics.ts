import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function trackEvent(action: string, targetId?: string, actorOverride?: string) {
  const session = await auth();
  const actor = actorOverride ?? session?.user?.email ?? "system";
  await prisma.auditLog.create({
    data: {
      action,
      actor,
      targetId,
    },
  });
}
