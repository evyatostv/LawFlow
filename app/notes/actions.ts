"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  body: z.string().min(2),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
});

export async function createNote(formData: FormData) {
  const parsed = schema.safeParse({
    body: formData.get("body"),
    clientId: formData.get("clientId") || undefined,
    caseId: formData.get("caseId") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.note.create({
    data: {
      body: parsed.data.body,
      clientId: parsed.data.clientId,
      caseId: parsed.data.caseId,
    },
  });

  await logAudit("note.create", created.id);
  if (parsed.data.caseId) revalidatePath(`/cases/${parsed.data.caseId}`);
  if (parsed.data.clientId) revalidatePath(`/clients/${parsed.data.clientId}`);
  return { ok: true };
}
