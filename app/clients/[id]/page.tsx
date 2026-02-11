import ClientDetailClient from "./ClientDetailClient";
import { clients } from "@/lib/data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return clients.map((client) => ({ id: client.id }));
}

export default function ClientPage() {
  return <ClientDetailClient />;
}
