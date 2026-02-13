import { mockGrowProvider } from "@/lib/payments/mockGrow";

export type CreateSubscriptionArgs = {
  userId: string;
  planId: string;
  trialStartAt: Date;
  trialEndAt: Date;
};

export type ProviderSubscription = {
  providerCustomerId: string;
  providerSubscriptionId: string;
  status: "trialing" | "active" | "past_due" | "canceled" | "expired";
  nextChargeAt: Date | null;
  lastChargeAt: Date | null;
};

export interface PaymentProvider {
  createSubscription: (payload: CreateSubscriptionArgs) => Promise<ProviderSubscription>;
}

export const paymentProvider: PaymentProvider = mockGrowProvider;
