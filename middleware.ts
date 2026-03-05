// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ✅ Edge에서 바로 사용 가능
const redis = Redis.fromEnv();

// ✅ 로그인: 10번 / 15분 (IP 기준)  ← email까지 섞고 싶지만 middleware에서 body 파싱이 까다로워서 IP로 정석 처리
const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "rl:login",
});

function getClientIp(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  if (!xf) return "unknown";
  return xf.split(",")[0].trim();
}

export async function middleware(req: NextRequest) {
  // ✅ Credentials 콜백(로그인 시도)만 rate limit
  if (req.nextUrl.pathname === "/api/auth/callback/credentials") {
    const ip = getClientIp(req);
    const r = await loginLimiter.limit(ip);

    // 디버그 로그(원하면 제거)
    console.log("LOGIN_RL_MW", { ip, success: r.success, remaining: r.remaining, reset: r.reset });

    if (!r.success) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/me/:path*",                 // 마이페이지 보호(기존 유지)
    "/api/me/:path*",             // 보호 API(기존 유지)
    "/api/auth/callback/credentials", // ✅ 로그인 시도 제한
  ],
};
