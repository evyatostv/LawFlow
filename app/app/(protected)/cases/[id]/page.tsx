import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CaseDetailClient from "./CaseDetailClient";


export default async function CasePage({ params }: { params: { id: string } }) {
  const [caseItem, clients] = await Promise.all([
    prisma.case.findUnique({
      where: { id: params.id },
      include: {
        tasks: true,
        events: true,
        documents: true,
        notes: true,
        invoices: true,
      },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!caseItem) {
    notFound();
  }

  return <CaseDetailClient caseItem={caseItem} clients={clients} />;
}