import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClientDetailClient from "./ClientDetailClient";

export const dynamic = "force-dynamic";

export default async function ClientPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      cases: true,
      tasks: true,
      documents: true,
      invoices: true,
      notes: true,
      payments: true,
    },
  });

  if (!client) {
    notFound();
  }

  return <ClientDetailClient client={client} />;
}
