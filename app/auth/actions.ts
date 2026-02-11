"use server";

import { z } from "zod";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
});

export async function sendOtp(formData: FormData) {
  const parsed = schema.safeParse({ email: String(formData.get("email") || "") });
  if (!parsed.success) {
    return { ok: false, message: "אימייל לא תקין" };
  }
  const { email } = parsed.data;
  const { code } = await createOtp(email.toLowerCase());
  await sendOtpEmail(email, code);
  return { ok: true };
}
