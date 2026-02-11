import CasesClient from "./CasesClient";
import { getCases, getClients } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const [cases, clients] = await Promise.all([getCases(), getClients()]);
  return (
    <CasesClient
      cases={cases}
      clients={clients.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
    />
  );
}
