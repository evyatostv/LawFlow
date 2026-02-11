"use server";

export async function createQuickItem(formData: FormData) {
  const type = String(formData.get("type") ?? "");
  const title = String(formData.get("title") ?? "");
  return { type, title, ok: true };
}
