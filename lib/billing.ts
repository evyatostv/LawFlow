import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";
import { paymentProvider } from "@/lib/payments/provider";

export const TRIAL_DAYS = 7;

export async function createOrUpdateTrialSubscription(userId: string, planId: string) {
  const existing = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["trialing", "active", "past_due"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const updated = await prisma.subscription.update({
      where: { id: existing.id },
      data: { planId },
    });
    await trackEvent("plan_selected", updated.id);
    return updated;
  }

  const now = new Date();
  const trialEndAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const providerPayload = await paymentProvider.createSubscription({
    userId,
    planId,
    trialStartAt: now,
    trialEndAt,
  });

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId,
      status: "trialing",
      trialStartAt: now,
      trialEndAt,
      currentPeriodStartAt: now,
      currentPeriodEndAt: trialEndAt,
      nextChargeAt: trialEndAt,
      provider: "grow",
      providerCustomerId: providerPayload.providerCustomerId,
      providerSubscriptionId: providerPayload.providerSubscriptionId,
      lastChargeAt: providerPayload.lastChargeAt,
    },
  });

  await prisma.licenseEntitlement.upsert({
    where: { userId },
    update: {
      subscriptionId: subscription.id,
      status: "active",
      expiresAt: trialEndAt,
    },
    create: {
      userId,
      subscriptionId: subscription.id,
      status: "active",
      expiresAt: trialEndAt,
    },
  });

  await trackEvent("plan_selected", subscription.id);
  await trackEvent("trial_started", subscription.id);

  return subscription;
}

export async function getEntitlementForUser(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) return { status: "none" as const, subscription: null };

  if (subscription.status === "trialing") {
    if (subscription.trialEndAt && subscription.trialEndAt < new Date()) {
      return { status: "inactive" as const, subscription };
    }
    return { status: "active" as const, subscription };
  }

  if (subscription.status === "active") {
    return { status: "active" as const, subscription };
  }

  return { status: "inactive" as const, subscription };
}

export async function getBillingSummary(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { plan: true },
  });

  return subscription;
}

export async function expireTrials() {
  const now = new Date();
  const expired = await prisma.subscription.findMany({
    where: {
      status: "trialing",
      trialEndAt: { lt: now },
      lastChargeAt: null,
    },
  });

  for (const subscription of expired) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "expired" },
    });

    await prisma.licenseEntitlement.updateMany({
      where: { subscriptionId: subscription.id },
      data: { status: "inactive", expiresAt: subscription.trialEndAt ?? now },
    });

    await trackEvent("trial_expired", subscription.id);
  }

  return expired.length;
}

export async function activateSubscription(subscriptionId: string) {
  const subscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: "active", currentPeriodStartAt: new Date() },
  });
  await prisma.licenseEntitlement.updateMany({
    where: { subscriptionId },
    data: { status: "active", expiresAt: subscription.currentPeriodEndAt },
  });
  await trackEvent("subscription_activated", subscriptionId);
  return subscription;
}
