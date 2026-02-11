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
  revalidatePath("/cases");
  return { ok: true };
}
