import CaseDetailClient from "./CaseDetailClient";
import { cases } from "@/lib/data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return cases.map((caseItem) => ({ id: caseItem.id }));
}

export default function CasePage() {
  return <CaseDetailClient />;
}
