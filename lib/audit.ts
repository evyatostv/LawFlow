import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function logAudit(action: string, targetId?: string) {
  const session = await auth();
  const actor = session?.user?.email ?? "system";
  await prisma.auditLog.create({
    data: {
      action,
      actor,
      targetId,
    },
  });
}
