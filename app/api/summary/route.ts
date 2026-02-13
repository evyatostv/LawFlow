import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  const today = new Date();
  const start = new Date(today.toISOString().slice(0, 10));
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const dueToday = await prisma.task.count({
    where: {
      dueDate: { gte: start, lt: end },
    },
  });
  const unpaid = await prisma.invoice.count({
    where: { status: { in: ["UNPAID", "PARTIAL"] } },
  });

  return NextResponse.json({ dueToday, unpaid });
}