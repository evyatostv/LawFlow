import SettingsClient from "./SettingsClient";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  const initial = {
    firmName: settings?.firmName ?? "",
    vatNumber: settings?.vatNumber ?? "",
    firmAddress: settings?.firmAddress ?? "",
    firmPhone: settings?.firmPhone ?? "",
    firmEmail: settings?.firmEmail ?? "",
    logoUrl: settings?.logoUrl ?? "",
    signatureUrl: settings?.signatureUrl ?? "",
    invoicePrefix: settings?.invoicePrefix ?? "INV-",
    enableAllocationNumber: settings?.enableAllocationNumber ?? false,
    allocationThreshold: settings?.allocationThreshold ?? 0,
    notificationRules: settings?.notificationRules ?? "",
    backupSchedule: settings?.backupSchedule ?? "",
    sessionTimeoutMinutes: settings?.sessionTimeoutMinutes ?? 30,
    invoiceFooter: settings?.invoiceFooter ?? "",
    language: "he" as const,
  };

  return <SettingsClient initial={initial} />;
}
