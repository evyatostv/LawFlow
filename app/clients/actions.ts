"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  name: z.string().min(2),
  israeliId: z.string().min(5),
  phone: z.string().min(5),
  email: z.string().email(),
  address: z.string().min(2),
  tags: z.array(z.string()).optional(),
});

export async function createClient(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    israeliId: formData.get("israeliId"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.client.create({
    data: {
      ...parsed.data,
      tags: parsed.data.tags ?? [],
    },
  });

  await logAudit("client.create", created.id);
  revalidatePath("/clients");
  return { ok: true };
}
