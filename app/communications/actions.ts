"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  type: z.enum(["CALL", "EMAIL", "WHATSAPP", "MEETING"]),
  summary: z.string().min(2),
  timestamp: z.string().min(8),
});

export async function createCommunication(formData: FormData) {
  const parsed = schema.safeParse({
    type: formData.get("type"),
    summary: formData.get("summary"),
    timestamp: formData.get("timestamp"),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.communicationLog.create({
    data: {
      type: parsed.data.type,
      summary: parsed.data.summary,
      timestamp: new Date(parsed.data.timestamp),
      attachments: [],
    },
  });

  await logAudit("communication.create", created.id);
  revalidatePath("/communications");
  return { ok: true };
}
