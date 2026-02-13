import crypto from "crypto";

export type MockGrowSubscriptionPayload = {
  userId: string;
  planId: string;
  trialStartAt: Date;
  trialEndAt: Date;
};

export const mockGrowProvider = {
  async createSubscription(payload: MockGrowSubscriptionPayload) {
    const suffix = crypto.randomBytes(6).toString("hex");
    return {
      providerCustomerId: `mock_cus_${payload.userId}_${suffix}`,
      providerSubscriptionId: `mock_sub_${payload.planId}_${suffix}`,
      status: "trialing" as const,
      nextChargeAt: payload.trialEndAt,
      lastChargeAt: null as Date | null,
    };
  },
};
