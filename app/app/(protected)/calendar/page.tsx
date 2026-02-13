import CalendarClient from "./CalendarClient";
import { getEvents, getClients, getCases, getSettings } from "@/lib/queries";
import { getSortPreference } from "@/lib/preferences";


export default async function CalendarPage() {
  const [events, clients, cases, settings] = await Promise.all([
    getEvents(),
    getClients(),
    getCases(),
    getSettings(),
  ]);
  const initialSorting = getSortPreference(settings?.sortPreferences, "events", [
    { id: "startAt", desc: false },
  ]);
  return (
    <CalendarClient
      events={events}
      clients={clients.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
      cases={cases.map((c: { id: string; caseNumber: string }) => ({ id: c.id, caseNumber: c.caseNumber }))}
      recentLocations={(settings?.recentLocations as string[] | undefined) ?? []}
      initialSorting={initialSorting}
    />
  );
}