"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  clientId: z.string().min(1),
  caseNumber: z.string().min(2),
  court: z.string().min(2),
  opposingParty: z.string().min(2),
  status: z.enum(["OPEN", "PENDING", "CLOSED"]),
  description: z.string().optional(),
});

export async function createCase(formData: FormData) {
  const parsed = schema.safeParse({
    clientId: formData.get("clientId"),
    caseNumber: formData.get("caseNumber"),
    court: formData.get("court"),
    opposingParty: formData.get("opposingParty"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.case.create({
    data: {
      ...parsed.data,
    },
  });

  await logAudit("case.create", created.id);
  revalidatePath("/app/cases");
  return { ok: true };
}

const updateSchema = schema.extend({ id: z.string().min(1) });

export async function updateCase(formData: FormData) {
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    clientId: formData.get("clientId"),
    caseNumber: formData.get("caseNumber"),
    court: formData.get("court"),
    opposingParty: formData.get("opposingParty"),
    status: formData.get("status"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const updated = await prisma.case.update({
    where: { id: parsed.data.id },
    data: {
      clientId: parsed.data.clientId,
      caseNumber: parsed.data.caseNumber,
      court: parsed.data.court,
      opposingParty: parsed.data.opposingParty,
      status: parsed.data.status,
      description: parsed.data.description,
    },
  });

  await logAudit("case.update", updated.id);
  revalidatePath("/app/cases");
  revalidatePath(`/cases/${updated.id}`);
  return { ok: true };
}

export async function deleteCase(id: string) {
  try {
    const deleted = await prisma.case.delete({ where: { id } });
    await logAudit("case.delete", deleted.id);
    revalidatePath("/app/cases");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: "לא ניתן למחוק תיק עם נתונים משויכים" };
  }
}
