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
  tags: z.string().optional(),
});

export async function createClient(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    israeliId: formData.get("israeliId"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    tags: String(formData.get("tags") || ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const created = await prisma.client.create({
    data: {
      ...parsed.data,
      tags: (parsed.data.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    },
  });

  await logAudit("client.create", created.id);
  revalidatePath("/app/clients");
  return { ok: true };
}

const updateSchema = schema.extend({ id: z.string().min(1) });

export async function updateClient(formData: FormData) {
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    israeliId: formData.get("israeliId"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    tags: formData.get("tags"),
  });

  if (!parsed.success) {
    return { ok: false, message: "נתונים לא תקינים" };
  }

  const updated = await prisma.client.update({
    where: { id: parsed.data.id },
    data: {
      name: parsed.data.name,
      israeliId: parsed.data.israeliId,
      phone: parsed.data.phone,
      email: parsed.data.email,
      address: parsed.data.address,
      tags: (parsed.data.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
    },
  });

  await logAudit("client.update", updated.id);
  revalidatePath("/app/clients");
  revalidatePath(`/clients/${updated.id}`);
  return { ok: true };
}

export async function deleteClient(id: string) {
  try {
    const deleted = await prisma.client.delete({ where: { id } });
    await logAudit("client.delete", deleted.id);
    revalidatePath("/app/clients");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: "לא ניתן למחוק לקוח עם נתונים משויכים" };
  }
}
