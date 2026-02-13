"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrUpdateTrialSubscription } from "@/lib/billing";

export async function selectPlan(formData: FormData) {
  const planId = String(formData.get("planId") || "");
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, message: "יש להתחבר כדי לבחור תוכנית" };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return { ok: false, message: "המשתמש לא נמצא" };
  }

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) {
    return { ok: false, message: "תוכנית לא תקינה" };
  }

  await createOrUpdateTrialSubscription(user.id, plan.id);

  return { ok: true };
}
