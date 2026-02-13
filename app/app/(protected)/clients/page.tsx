import ClientsClient from "./ClientsClient";
import { getClients, getSettings } from "@/lib/queries";
import { getSortPreference } from "@/lib/preferences";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const [clients, settings] = await Promise.all([getClients(), getSettings()]);
  const initialSorting = getSortPreference(settings?.sortPreferences, "clients", [
    { id: "name", desc: false },
  ]);
  return <ClientsClient clients={clients} initialSorting={initialSorting} />;
}
