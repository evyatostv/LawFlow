import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventDetailClient from "./EventDetailClient";


export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, clients, cases] = await Promise.all([
    prisma.event.findUnique({ where: { id: params.id } }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.case.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  if (!event) notFound();

  return <EventDetailClient event={event} clients={clients} cases={cases} />;
}