import SettingsClient from "./SettingsClient";
import { getSettings } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  const auditLogs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  const adminEmailEnv = process.env.ADMIN_EMAIL ?? "admin@lawflow.co.il";
  const initial = {
    firmName: settings?.firmName ?? "",
    vatNumber: settings?.vatNumber ?? "",
    firmAddress: settings?.firmAddress ?? "",
    firmPhone: settings?.firmPhone ?? "",
    firmEmail: settings?.firmEmail ?? "",
    logoUrl: settings?.logoUrl ?? "",
    signatureUrl: settings?.signatureUrl ?? "",
    invoicePrefix: settings?.invoicePrefix ?? "INV-",
    invoiceNumberResetYearly: settings?.invoiceNumberResetYearly ?? true,
    enableAllocationNumber: settings?.enableAllocationNumber ?? false,
    allocationThreshold: settings?.allocationThreshold ?? 0,
    notificationRules: settings?.notificationRules ?? "",
    backupSchedule: settings?.backupSchedule ?? "",
    sessionTimeoutMinutes: settings?.sessionTimeoutMinutes ?? 30,
    invoiceFooter: settings?.invoiceFooter ?? "",
    language: (settings?.language as "he" | "en") ?? "he",
    adminEmail: settings?.adminEmail ?? adminEmailEnv,
  };

  return <SettingsClient initial={initial} auditLogs={auditLogs} adminEmailEnv={adminEmailEnv} />;
}
