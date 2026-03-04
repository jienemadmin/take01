import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  // JWT 전략 (MVP에 적합)
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // NextAuth가 사용할 최소 필드 (id는 필수)
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
      // 로그인 직후 user가 들어옴
      if (user) {
        // ✅ NextAuth 표준: token.sub에 user.id 저장 (정석)
        token.sub = (user as any).id;

        // 필요하면 커스텀 필드도 유지
        (token as any).id = (user as any).id;
        (token as any).name = (user as any).name ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // ✅ 정석: token.sub에서 id 꺼내서 session.user.id에 주입
        (session.user as any).id = token.sub ?? (token as any).id;

        // name도 token 기준으로 덮어쓰기(없으면 기존 유지)
        session.user.name = ((token as any).name ?? session.user.name) as any;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
