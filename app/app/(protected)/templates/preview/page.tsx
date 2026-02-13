import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { applyTemplateVariables, buildTemplateContext } from "@/lib/templates";
import { PrintTrigger } from "@/components/PrintTrigger";

export const dynamic = "force-dynamic";

export default async function TemplatePreviewPage({
  searchParams,
}: {
  searchParams: { templateId?: string; clientId?: string; caseId?: string; export?: string };
}) {
  const templateId = searchParams.templateId;
  if (!templateId) notFound();

  const [template, client, caseItem, settings] = await Promise.all([
    prisma.template.findUnique({ where: { id: templateId } }),
    searchParams.clientId ? prisma.client.findUnique({ where: { id: searchParams.clientId } }) : null,
    searchParams.caseId ? prisma.case.findUnique({ where: { id: searchParams.caseId } }) : null,
    prisma.settings.findFirst(),
  ]);

  if (!template) notFound();

  const context = buildTemplateContext({ client, caseItem, settings });
  const html = applyTemplateVariables(template.body, context);
  const autoPrint = searchParams.export === "1";

  return (
    <html lang="he" dir="rtl">
      <body className="bg-white font-body text-ink">
        <PrintTrigger autoPrint={autoPrint} />
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="mb-6 text-sm text-steel/70">
            <h1 className="text-2xl font-semibold text-ink">{template.name}</h1>
            <p>תצוגה מקדימה עם החלפת משתנים</p>
          </div>
          <div
            className="prose max-w-none rounded-2xl border border-steel/10 bg-white p-6 text-right leading-7"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </body>
    </html>
  );
}
