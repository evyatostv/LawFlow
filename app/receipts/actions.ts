"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  invoiceId: z.string().min(1),
  amount: z.coerce.number().min(0.01),
  method: z.string().min(2),
});

function formatReceiptNumber(prefix: string, year: number, current: number) {
  return `${prefix}-${year}-${String(current).padStart(6, "0")}`;
}

export async function createReceipt(formData: FormData) {
  const parsed = schema.safeParse({
    invoiceId: formData.get("invoiceId"),
    amount: formData.get("amount"),
    method: formData.get("method"),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: parsed.data.invoiceId },
    include: { receipts: true },
  });

  if (!invoice) {
    return { ok: false, message: "חשבונית לא נמצאה" };
  }

  const year = new Date().getFullYear();
  const settings = await prisma.settings.findFirst();
  const prefix = `${settings?.invoicePrefix || "LF"}-R`;

  const receipt = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const counter = await tx.invoiceCounter.upsert({
      where: { year_prefix: { year, prefix } },
      update: { current: { increment: 1 } },
      create: { year, prefix, current: 1 },
    });

    const number = formatReceiptNumber(prefix, year, counter.current);

    const created = await tx.receipt.create({
      data: {
        invoiceId: invoice.id,
        number,
        amount: parsed.data.amount,
        method: parsed.data.method,
      },
    });

    await tx.payment.create({
      data: {
        amount: parsed.data.amount,
        method: parsed.data.method,
        status: "PAID",
        paidAt: new Date(),
        clientId: invoice.clientId,
        caseId: invoice.caseId ?? undefined,
        invoiceId: invoice.id,
        receiptId: created.id,
      },
    });

    const totalPaid =
      invoice.receipts.reduce((sum: number, r: any) => sum + r.amount, 0) + parsed.data.amount;
    const nextStatus = totalPaid >= invoice.total ? "PAID" : "PARTIAL";

    await tx.invoice.update({
      where: { id: invoice.id },
      data: { status: nextStatus },
    });

    return created;
  });

  await logAudit("receipt.create", receipt.id);
  revalidatePath("/billing");
  revalidatePath(`/invoices/${invoice.id}/print`);
  return { ok: true, receiptId: receipt.id };
}
