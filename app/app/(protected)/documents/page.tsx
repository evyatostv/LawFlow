import DocumentsClient from "./DocumentsClient";
import { getDocuments, getClients, getCases, getTemplates, getSettings } from "@/lib/queries";
import { getSortPreference } from "@/lib/preferences";


export default async function DocumentsPage() {
  const [documents, clients, cases, templates, settings] = await Promise.all([
    getDocuments(),
    getClients(),
    getCases(),
    getTemplates(),
    getSettings(),
  ]);
  const initialSorting = getSortPreference(settings?.sortPreferences, "documents", [
    { id: "updatedAt", desc: true },
  ]);
  return (
    <DocumentsClient
      documents={documents}
      clients={clients.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
      cases={cases.map((c: { id: string; caseNumber: string }) => ({ id: c.id, caseNumber: c.caseNumber }))}
      templates={templates}
      initialSorting={initialSorting}
    />
  );
}