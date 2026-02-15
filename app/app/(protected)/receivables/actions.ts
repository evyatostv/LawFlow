"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  clientId: z.string().min(1),
  caseId: z.string().optional(),
  total: z.coerce.number().min(0),
  status: z.enum(["PAID", "UNPAID", "PARTIAL"]),
  dueDate: z.string().min(8),
  allocationNumber: z.string().optional(),
  description: z.string().min(2),
});

function formatInvoiceNumber(prefix: string, year: number, current: number) {
  return `${prefix}-${year}-${String(current).padStart(6, "0")}`;
}

export async function createInvoice(formData: FormData) {
  const parsed = schema.safeParse({
    clientId: formData.get("clientId"),
    caseId: formData.get("caseId") || undefined,
    total: formData.get("total"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    allocationNumber: formData.get("allocationNumber") || undefined,
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const vatRate = 0.17;
  const subtotal = parsed.data.total / (1 + vatRate);
  const vatAmount = parsed.data.total - subtotal;
  const year = new Date().getFullYear();

  const settings = await prisma.settings.findFirst();
  const prefix = settings?.invoicePrefix || "LF";
  const counterYear = settings?.invoiceNumberResetYearly === false ? 0 : year;

  const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const counter = await tx.invoiceCounter.upsert({
      where: { year_prefix: { year: counterYear, prefix } },
      update: { current: { increment: 1 } },
      create: { year: counterYear, prefix, current: 1 },
    });

    const number = formatInvoiceNumber(prefix, year, counter.current);

    const invoice = await tx.invoice.create({
      data: {
        number,
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

    await tx.invoiceLine.create({
      data: {
        invoiceId: invoice.id,
        description: parsed.data.description,
        quantity: 1,
        unitPrice: parsed.data.total,
        total: parsed.data.total,
      },
    });

    return invoice;
  });

  await logAudit("invoice.create", created.id);
  revalidatePath("/app/receivables");
  return { ok: true };
}

const updateSchema = schema.extend({
  id: z.string().min(1),
});

export async function updateInvoice(formData: FormData) {
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    clientId: formData.get("clientId"),
    caseId: formData.get("caseId") || undefined,
    total: formData.get("total"),
    status: formData.get("status"),
    dueDate: formData.get("dueDate"),
    allocationNumber: formData.get("allocationNumber") || undefined,
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const vatRate = 0.17;
  const subtotal = parsed.data.total / (1 + vatRate);
  const vatAmount = parsed.data.total - subtotal;

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const invoice = await tx.invoice.update({
      where: { id: parsed.data.id },
      data: {
        clientId: parsed.data.clientId,
        caseId: parsed.data.caseId,
        dueDate: new Date(parsed.data.dueDate),
        subtotal,
        vatRate,
        vatAmount,
        total: parsed.data.total,
        status: parsed.data.status,
        allocationNumber: parsed.data.allocationNumber,
      },
    });

    const existingLine = await tx.invoiceLine.findFirst({ where: { invoiceId: invoice.id } });
    if (existingLine) {
      await tx.invoiceLine.update({
        where: { id: existingLine.id },
        data: {
          description: parsed.data.description,
          quantity: 1,
          unitPrice: parsed.data.total,
          total: parsed.data.total,
        },
      });
    } else {
      await tx.invoiceLine.create({
        data: {
          invoiceId: invoice.id,
          description: parsed.data.description,
          quantity: 1,
          unitPrice: parsed.data.total,
          total: parsed.data.total,
        },
      });
    }
    return invoice;
  });

  await logAudit("invoice.update", updated.id);
  revalidatePath("/app/receivables");
  revalidatePath(`/app/invoices/${updated.id}`);
  return { ok: true };
}

export async function deleteInvoice(id: string) {
  try {
    const deleted = await prisma.invoice.delete({ where: { id } });
    await logAudit("invoice.delete", deleted.id);
    revalidatePath("/app/receivables");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: "לא ניתן למחוק חשבונית עם קבלות/תשלומים" };
  }
}
