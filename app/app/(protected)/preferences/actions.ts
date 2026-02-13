"use server";

import type { SortingState } from "@tanstack/react-table";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateSortPreferenceObject } from "@/lib/preferences";

export async function updateSortPreference(listKey: string, sorting: SortingState) {
  const settings = await prisma.settings.findFirst();
  if (!settings) return { ok: false };
  const next = updateSortPreferenceObject(settings.sortPreferences, listKey, sorting);
  await prisma.settings.update({
    where: { id: settings.id },
    data: { sortPreferences: next as unknown as Prisma.InputJsonValue },
  });
  return { ok: true };
}
