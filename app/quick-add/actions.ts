"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  type: z.enum(["note", "task", "payment", "document"]),
  title: z.string().min(2),
  amount: z.coerce.number().optional(),
});

export async function createQuickAdd(formData: FormData) {
  const parsed = schema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    amount: formData.get("amount") || undefined,
  });

  if (!parsed.success) {
    return { ok: false };
  }

  if (parsed.data.type === "task") {
    const created = await prisma.task.create({
      data: {
        title: parsed.data.title,
        dueDate: new Date(),
        priority: "MEDIUM",
      },
    });
    await logAudit("task.create", created.id);
    revalidatePath("/tasks");
  }

  if (parsed.data.type === "note") {
    const created = await prisma.note.create({
      data: {
        body: parsed.data.title,
      },
    });
    await logAudit("note.create", created.id);
  }

  if (parsed.data.type === "payment") {
    const created = await prisma.payment.create({
      data: {
        amount: parsed.data.amount ?? 0,
        method: "אשראי",
        status: "PARTIAL",
      },
    });
    await logAudit("payment.create", created.id);
    revalidatePath("/billing");
  }

  if (parsed.data.type === "document") {
    const created = await prisma.document.create({
      data: {
        name: parsed.data.title,
        type: "PDF",
      },
    });
    await logAudit("document.create", created.id);
    revalidatePath("/documents");
  }

  return { ok: true };
}
