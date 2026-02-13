"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  title: z.string().min(2),
  dueDate: z.string().min(8),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  repeat: z.string().optional(),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
});

export async function createTask(formData: FormData) {
  const parsed = schema.safeParse({
    title: formData.get("title"),
    dueDate: formData.get("dueDate"),
    priority: formData.get("priority"),
    repeat: formData.get("repeat") || undefined,
    clientId: formData.get("clientId") || undefined,
    caseId: formData.get("caseId") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.task.create({
    data: {
      title: parsed.data.title,
      dueDate: new Date(parsed.data.dueDate),
      priority: parsed.data.priority,
      repeat: parsed.data.repeat || undefined,
      clientId: parsed.data.clientId || undefined,
      caseId: parsed.data.caseId || undefined,
    },
  });

  await logAudit("task.create", created.id);
  revalidatePath("/app/tasks");
  return { ok: true };
}
