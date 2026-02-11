"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  body: z.string().min(2),
});

export async function createTemplate(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.template.create({
    data: parsed.data,
  });

  await logAudit("template.create", created.id);
  revalidatePath("/templates");
  return { ok: true };
}
