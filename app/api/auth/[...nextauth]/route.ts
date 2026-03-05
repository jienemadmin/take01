import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { loginLimiter } from "@/lib/ratelimit";

const nextAuthHandler = NextAuth(authOptions);

function getClientIp(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for");
  const xr = req.headers.get("x-real-ip");
  const ip = (xf ?? xr ?? "unknown").split(",")[0].trim();
  return ip || "unknown";
}

export async function GET(req: NextRequest) {
  return nextAuthHandler(req);
}

export async function POST(req: NextRequest) {
  // ✅ Credentials 로그인 요청만 레이트리밋
  // 이 경로로 들어옴: /api/auth/callback/credentials
  if (req.nextUrl.pathname.includes("/api/auth/callback/credentials")) {
    const ip = getClientIp(req);

    // body는 한 번만 읽을 수 있어서 clone에서 읽기
    const cloned = req.clone();
    const form = await cloned.formData();
    const emailRaw = String(form.get("email") ?? "");
    const email = emailRaw.trim().toLowerCase();

    const key = `${ip}:${email || "noemail"}`;
    const r = await loginLimiter.limit(key);

    // (디버그용) Vercel Logs에서 확인 가능
    console.log("LOGIN_RL", {
      ip,
      email,
      key,
      success: r.success,
      remaining: r.remaining,
      reset: r.reset,
    });

    if (!r.success) {
      // ✅ 진짜 429를 반환해야 프론트에서 확실히 감지됨
      return NextResponse.json(
        { error: "RATE_LIMIT", message: "Too many login attempts" },
        { status: 429 }
      );
    }
  }

  return nextAuthHandler(req);
}
