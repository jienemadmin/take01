// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";


function getClientIp(req: any) {
  // ✅ Vercel/NextAuth 환경에서 최대한 안전하게 IP 추출
  const xf =
    req?.headers?.get?.("x-forwarded-for") ||
    req?.headers?.["x-forwarded-for"] ||
    req?.headers?.get?.("x-real-ip");

  if (!xf) return "unknown";
  return String(xf).split(",")[0].trim() || "unknown";
}

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

        // ✅ 로그인 rate limit: IP + email 기준
        const ip = getClientIp(req);
        const key = `${ip}:${email.toLowerCase()}`;

        const r = await loginLimiter.limit(key);

        // ✅ 디버깅용 (Vercel Logs에서 확인)
        console.log("LOGIN_RL", {
          ip,
          email,
          key,
          success: r.success,
          remaining: r.remaining,
          reset: r.reset,
        });

        if (!r.success) {
          // login page에서 res.error로 잡히는 에러 문자열
          throw new Error("RATE_LIMIT");
        }

        // ✅ 기존 로그인 로직
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

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
        token.sub = (user as any).id; // 표준
        (token as any).name = (user as any).name ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub as string;
        session.user.name = ((token as any).name ?? session.user.name) as any;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
