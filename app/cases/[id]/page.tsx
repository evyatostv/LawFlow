import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CaseDetailClient from "./CaseDetailClient";

export const dynamic = "force-dynamic";

export default async function CasePage({ params }: { params: { id: string } }) {
  const caseItem = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      tasks: true,
      events: true,
      documents: true,
      notes: true,
      invoices: true,
    },
  });

  if (!caseItem) {
    notFound();
  }

  return <CaseDetailClient caseItem={caseItem} />;
}
