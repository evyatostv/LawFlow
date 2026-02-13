import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DocumentDetailClient from "./DocumentDetailClient";


export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [document, clients, cases] = await Promise.all([
    prisma.document.findUnique({ where: { id: params.id } }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.case.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!document) notFound();

  return <DocumentDetailClient document={document} clients={clients} cases={cases} />;
}