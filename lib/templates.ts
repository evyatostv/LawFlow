type TemplateContext = Record<string, string>;

export function buildTemplateContext({
  client,
  caseItem,
  settings,
}: {
  client?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    israeliId?: string | null;
  } | null;
  caseItem?: {
    caseNumber?: string | null;
    court?: string | null;
    opposingParty?: string | null;
    status?: string | null;
  } | null;
  settings?: {
    firmName?: string | null;
    vatNumber?: string | null;
    firmAddress?: string | null;
    firmPhone?: string | null;
    firmEmail?: string | null;
  } | null;
}) {
  const now = new Date();
  return {
    "client.name": client?.name ?? "",
    "client.email": client?.email ?? "",
    "client.phone": client?.phone ?? "",
    "client.address": client?.address ?? "",
    "client.israeliId": client?.israeliId ?? "",
    "case.caseNumber": caseItem?.caseNumber ?? "",
    "case.court": caseItem?.court ?? "",
    "case.opposingParty": caseItem?.opposingParty ?? "",
    "case.status": caseItem?.status ?? "",
    "firm.name": settings?.firmName ?? "",
    "firm.vatNumber": settings?.vatNumber ?? "",
    "firm.address": settings?.firmAddress ?? "",
    "firm.phone": settings?.firmPhone ?? "",
    "firm.email": settings?.firmEmail ?? "",
    "today.date": now.toISOString().slice(0, 10),
    "today.datetime": now.toISOString().slice(0, 16).replace("T", " "),
  };
}

export function applyTemplateVariables(body: string, context: TemplateContext) {
  return body.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => {
    const normalized = String(key).trim();
    return context[normalized] ?? "";
  });
}
