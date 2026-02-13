import BillingClient from "./BillingClient";
import { getInvoices, getClients, getSettings } from "@/lib/queries";
import { getSortPreference } from "@/lib/preferences";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const [invoices, clients, settings] = await Promise.all([getInvoices(), getClients(), getSettings()]);
  const invoiceSettings = {
    invoicePrefix: settings?.invoicePrefix ?? "INV-",
    enableAllocationNumber: settings?.enableAllocationNumber ?? false,
    allocationThreshold: settings?.allocationThreshold ?? 0,
  };
  const initialSorting = getSortPreference(settings?.sortPreferences, "invoices", [
    { id: "dueDate", desc: true },
  ]);
  const clientOptions = clients.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }));
  return (
    <BillingClient
      invoices={invoices}
      clients={clientOptions}
      settings={invoiceSettings}
      initialSorting={initialSorting}
    />
  );
}
