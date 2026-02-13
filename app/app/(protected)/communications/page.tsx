import CommunicationsClient from "./CommunicationsClient";
import { getCommunications } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CommunicationsPage() {
  const communications = await getCommunications();
  return <CommunicationsClient communications={communications} />;
}
