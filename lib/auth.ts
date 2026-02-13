import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { consumeEmailVerificationToken } from "@/lib/verification";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "email-verify",
      name: "Email Verify",
      credentials: {
        email: { label: "Email", type: "email" },
        token: { label: "Token", type: "text" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const token = String(credentials?.token || "").trim();
        if (!email || !token) return null;

        const ok = await consumeEmailVerificationToken(email, token);
        if (!ok) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        if (!user.emailVerified) {
          await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
        }

        return user;
      },
    }),
    Credentials({
      name: "Email Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (!existing || !existing.passwordHash) return null;
        if (!existing.emailVerified) return null;

        const ok = await verifyPassword(password, existing.passwordHash);
        if (!ok) return null;

        return existing;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
