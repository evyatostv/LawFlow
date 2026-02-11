import DocumentsClient from "./DocumentsClient";
import { getDocuments, getClients, getCases, getTemplates } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const [documents, clients, cases, templates] = await Promise.all([
    getDocuments(),
    getClients(),
    getCases(),
    getTemplates(),
  ]);
  return (
    <DocumentsClient
      documents={documents}
      clients={clients.map((c) => ({ id: c.id, name: c.name }))}
      cases={cases.map((c) => ({ id: c.id, caseNumber: c.caseNumber }))}
      templates={templates}
    />
  );
}
