import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InvoiceDetailClient from "./InvoiceDetailClient";


export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [invoice, clients, cases, settings] = await Promise.all([
    prisma.invoice.findUnique({ where: { id: params.id }, include: { lines: true } }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.case.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.settings.findFirst(),
  ]);

  if (!invoice) notFound();

  const allocationRequired =
    (settings?.enableAllocationNumber ?? false) &&
    invoice.total >= (settings?.allocationThreshold ?? 0);

  return <InvoiceDetailClient invoice={invoice} clients={clients} cases={cases} allocationRequired={allocationRequired} />;
}