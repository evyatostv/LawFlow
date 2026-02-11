import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const OTP_TTL_MINUTES = 10;

function hashToken(email: string, code: string) {
  const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret";
  return crypto
    .createHash("sha256")
    .update(`${email}:${code}:${secret}`)
    .digest("hex");
}

export function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(email: string) {
  const code = generateOtpCode();
  const tokenHash = hashToken(email, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.otpToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
    },
  });

  return { code, expiresAt };
}

export async function verifyOtp(email: string, code: string) {
  const tokenHash = hashToken(email, code);
  const token = await prisma.otpToken.findFirst({
    where: {
      email,
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!token) return false;

  await prisma.otpToken.update({
    where: { id: token.id },
    data: { usedAt: new Date() },
  });

  return true;
}
