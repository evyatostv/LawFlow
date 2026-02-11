const OTP_TTL_MINUTES = 10;

async function hashToken(email: string, code: string) {
  const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret";
  const data = new TextEncoder().encode(`${email}:${code}:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(email: string) {
  const code = generateOtpCode();
  const tokenHash = await hashToken(email, code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  const { prisma } = await import("@/lib/prisma");

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
  const tokenHash = await hashToken(email, code);
  const { prisma } = await import("@/lib/prisma");

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
