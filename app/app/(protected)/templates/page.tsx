import TemplatesClient from "./TemplatesClient";
import { getTemplates } from "@/lib/queries";


export default async function TemplatesPage() {
  const templates = await getTemplates();
  return <TemplatesClient templates={templates} />;
}