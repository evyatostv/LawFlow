import { prisma } from "@/lib/prisma";

export async function getClients() {
  return prisma.client.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getClient(id: string) {
  return prisma.client.findUnique({ where: { id } });
}

export async function getCases() {
  return prisma.case.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getCase(id: string) {
  return prisma.case.findUnique({ where: { id } });
}

export async function getTasks() {
  return prisma.task.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getEvents() {
  return prisma.event.findMany({ orderBy: { startAt: "asc" } });
}

export async function getInvoices() {
  return prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { receipts: true, client: true, lines: true },
  });
}

export async function getDocuments() {
  return prisma.document.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getCommunications() {
  return prisma.communicationLog.findMany({ orderBy: { timestamp: "desc" } });
}

export async function getSettings() {
  return prisma.settings.findFirst();
}

export async function getTemplates() {
  return prisma.template.findMany({ orderBy: { createdAt: "desc" } });
}
