"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  firmName: z.string().min(2),
  vatNumber: z.string().min(5),
  firmAddress: z.string().optional(),
  firmPhone: z.string().optional(),
  firmEmail: z.string().optional(),
  logoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
  invoicePrefix: z.string().min(2),
  invoiceNumberResetYearly: z.boolean(),
  enableAllocationNumber: z.boolean(),
  allocationThreshold: z.coerce.number().min(0),
  notificationRules: z.string().min(2),
  backupSchedule: z.string().min(2),
  sessionTimeoutMinutes: z.coerce.number().min(5),
  invoiceFooter: z.string().optional(),
  language: z.enum(["he", "en"]),
  adminEmail: z.string().email().optional(),
});

export async function updateSettings(formData: FormData) {
  const parsed = schema.safeParse({
    firmName: formData.get("firmName"),
    vatNumber: formData.get("vatNumber"),
    firmAddress: formData.get("firmAddress") || undefined,
    firmPhone: formData.get("firmPhone") || undefined,
    firmEmail: formData.get("firmEmail") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    signatureUrl: formData.get("signatureUrl") || undefined,
    invoicePrefix: formData.get("invoicePrefix"),
    invoiceNumberResetYearly: formData.get("invoiceNumberResetYearly") === "on",
    enableAllocationNumber: formData.get("enableAllocationNumber") === "on",
    allocationThreshold: formData.get("allocationThreshold"),
    notificationRules: formData.get("notificationRules"),
    backupSchedule: formData.get("backupSchedule"),
    sessionTimeoutMinutes: formData.get("sessionTimeoutMinutes"),
    invoiceFooter: formData.get("invoiceFooter") || undefined,
    language: (formData.get("language") as "he" | "en") ?? "he",
    adminEmail: (formData.get("adminEmail") as string) || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const existing = await prisma.settings.findFirst();
  if (existing) {
    const updated = await prisma.settings.update({
      where: { id: existing.id },
      data: parsed.data,
    });
    await logAudit("settings.update", updated.id);
  } else {
    const created = await prisma.settings.create({
      data: parsed.data,
    });
    await logAudit("settings.create", created.id);
  }

  revalidatePath("/app/settings");
  return { ok: true };
}
