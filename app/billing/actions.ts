"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  number: z.string().min(2),
  clientId: z.string().min(1),
  caseId: z.string().optional(),
  total: z.coerce.number().min(0),
  status: z.enum(["PAID", "UNPAID", "PARTIAL"]),
  dueDate: z.string().min(8),
  allocationNumber: z.string().optional(),
});

export async function createInvoice(formData: FormData) {
  const parsed = schema.safeParse({
    number: formData.get("number"),
    clientId: formData.get("clientId"),
    caseId: formData.get("caseId") || undefined,
    total: formData.get("total"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    allocationNumber: formData.get("allocationNumber") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const vatRate = 0.17;
  const subtotal = parsed.data.total / (1 + vatRate);
  const vatAmount = parsed.data.total - subtotal;

  const created = await prisma.invoice.create({
    data: {
      number: parsed.data.number,
      clientId: parsed.data.clientId,
      caseId: parsed.data.caseId,
      issueDate: new Date(),
      dueDate: new Date(parsed.data.dueDate),
      subtotal,
      vatRate,
      vatAmount,
      total: parsed.data.total,
      status: parsed.data.status,
      allocationNumber: parsed.data.allocationNumber,
    },
  });

  await logAudit("invoice.create", created.id);
  revalidatePath("/billing");
  return { ok: true };
}
