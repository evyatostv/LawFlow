import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_EXPIRY_HOURS = 24;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createEmailVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const hashed = hashToken(token);
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashed,
      expires,
    },
  });

  return token;
}

export async function consumeEmailVerificationToken(email: string, token: string) {
  const hashed = hashToken(token);
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: hashed } },
  });

  if (!record) return false;
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: hashed } },
    });
    return false;
  }

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: hashed } },
  });
  return true;
}
