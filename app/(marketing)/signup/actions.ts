"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createEmailVerificationToken } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";
import { getBaseUrl } from "@/lib/url";
import { trackEvent } from "@/lib/analytics";

export async function registerAccount(formData: FormData) {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !username || !password) {
    return { ok: false, message: "נא למלא את כל השדות" };
  }
  if (password.length < 8) {
    return { ok: false, message: "הסיסמה חייבת להכיל לפחות 8 תווים" };
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return { ok: false, message: "האימייל כבר רשום" };
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    return { ok: false, message: "שם המשתמש כבר תפוס" };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
    },
  });

  try {
    const token = await createEmailVerificationToken(email);
    const baseUrl = getBaseUrl();
    const link = `${baseUrl}/verify-email?email=${encodeURIComponent(email)}&token=${token}`;
    await sendVerificationEmail(email, link);
    await trackEvent("signup_complete", user.id, email);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "ההרשמה בוצעה אך לא הצלחנו לשלוח אימייל אימות" };
  }
}
