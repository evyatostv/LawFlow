"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  url: z.string().optional(),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
});

export async function createDocument(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    url: formData.get("url") || undefined,
    clientId: formData.get("clientId") || undefined,
    caseId: formData.get("caseId") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.document.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      url: parsed.data.url,
      clientId: parsed.data.clientId,
      caseId: parsed.data.caseId,
    },
  });

  await logAudit("document.create", created.id);
  revalidatePath("/documents");
  return { ok: true };
}
