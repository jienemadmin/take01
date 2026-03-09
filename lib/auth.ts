// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
  const email = credentials?.email?.trim();
  const password = credentials?.password;

  if (!email || !password) return null;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  const xf =
    req?.headers?.get?.("x-forwarded-for") ||
    req?.headers?.["x-forwarded-for"] ||
    req?.headers?.get?.("x-real-ip");

  const ip = xf ? String(xf).split(",")[0].trim() : null;

  await prisma.securityLog.create({
    data: {
      type: "LOGIN_SUCCESS",
      email: user.email,
      ip,
      userId: user.id,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
  };
},
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id;
        (token as any).name = (user as any).name ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        session.user.name = ((token as any).name ?? session.user.name) as any;
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
