import ClientsClient from "./ClientsClient";
import { getClients } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsClient clients={clients} />;
}
