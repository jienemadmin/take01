import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginLimiter } from "@/lib/ratelimit";

/**
 * Vercel/Next 환경에서 IP를 최대한 안전하게 뽑기
 * - x-forwarded-for: "client, proxy1, proxy2" 형태일 수 있어서 첫번째만 사용
 * - 없으면 "unknown"
 */
function getClientIp(req: any) {
  try {
    // App Router(Request/NextRequest): req.headers.get(...)
    const xf1 =
      typeof req?.headers?.get === "function"
        ? req.headers.get("x-forwarded-for")
        : undefined;

    // Pages Router 스타일: req.headers["x-forwarded-for"]
    const xf2 =
      req?.headers && typeof req.headers === "object"
        ? (req.headers["x-forwarded-for"] as string | undefined)
        : undefined;

    const raw = (xf1 || xf2 || "").toString();
    const ip = raw.split(",")[0]?.trim();
    return ip || "unknown";
  } catch {
    return "unknown";
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // MVP는 JWT 유지 권장

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // ✅ 여기서 2번째 인자 req를 받아야 IP 기반 제한 가능
      async authorize(credentials, req) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) return null;

        // ✅ Rate Limit (IP + email 기준)
        const ip = getClientIp(req);
        const key = `login:${ip}:${email.toLowerCase()}`;

        const { success } = await loginLimiter.limit(key);

        // ✅ 제한 초과 시: NextAuth는 throw Error 메시지를 /login 에 전달 가능
        // (프론트에서 signIn 결과의 error를 보여주면 됨)
        if (!success) {
          throw new Error("RATE_LIMIT");
        }

        // ✅ 기존 로그인 로직
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name ?? null };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ✅ 정석: token.sub = user.id
        token.sub = (user as any).id;
        (token as any).name = (user as any).name ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // ✅ session.user.id 주입
        (session.user as any).id = token.sub;
        session.user.name = ((token as any).name ?? session.user.name) as any;
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
