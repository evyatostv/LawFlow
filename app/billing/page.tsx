import BillingClient from "./BillingClient";
import { getInvoices, getClients, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const [invoices, clients, settings] = await Promise.all([getInvoices(), getClients(), getSettings()]);
  const invoiceSettings = {
    invoicePrefix: settings?.invoicePrefix ?? "INV-",
    enableAllocationNumber: settings?.enableAllocationNumber ?? false,
    allocationThreshold: settings?.allocationThreshold ?? 0,
  };
  return (
    <BillingClient
      invoices={invoices}
      clients={clients.map((c) => ({ id: c.id, name: c.name }))}
      settings={invoiceSettings}
    />
  );
}
