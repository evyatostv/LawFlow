import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const code = String(credentials?.code || "").trim();
        if (!email || !code) return null;

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        if (adminEmail && email !== adminEmail) return null;

        const ok = await verifyOtp(email, code);
        if (!ok) return null;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return existing;

        const created = await prisma.user.create({ data: { email } });
        return created;
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
});
