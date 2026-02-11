import CalendarClient from "./CalendarClient";
import { getEvents, getClients, getCases } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [events, clients, cases] = await Promise.all([getEvents(), getClients(), getCases()]);
  return (
    <CalendarClient
      events={events}
      clients={clients.map((c) => ({ id: c.id, name: c.name }))}
      cases={cases.map((c) => ({ id: c.id, caseNumber: c.caseNumber }))}
    />
  );
}
