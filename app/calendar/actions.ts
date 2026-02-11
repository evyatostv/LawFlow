"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  title: z.string().min(2),
  startAt: z.string().min(8),
  endAt: z.string().min(8),
  type: z.string().min(2),
  location: z.string().optional(),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
});

export async function createEvent(formData: FormData) {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    type: formData.get("type"),
    location: formData.get("location") || undefined,
    clientId: formData.get("clientId") || undefined,
    caseId: formData.get("caseId") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.event.create({
    data: {
      title: parsed.data.title,
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
      type: parsed.data.type,
      location: parsed.data.location,
      clientId: parsed.data.clientId,
      caseId: parsed.data.caseId,
    },
  });

  await logAudit("event.create", created.id);
  revalidatePath("/calendar");
  return { ok: true };
}
