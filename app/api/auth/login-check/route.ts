import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginUiLimiter } from "@/lib/ratelimit";

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  const xr = req.headers.get("x-real-ip");
  const ip = (xf ?? xr ?? "unknown").split(",")[0].trim();
  return ip || "unknown";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  const ip = getClientIp(req);
  const key = `${ip}:${email}`;

  const r = await loginUiLimiter.limit(key);

  console.log("LOGIN_CHECK_RL", {
    ip,
    email,
    key,
    success: r.success,
    remaining: r.remaining,
    reset: r.reset,
  });

  if (!r.success) {
    const retryAfter = Math.max(
      1,
      Math.ceil((r.reset - Date.now()) / 1000)
    );

    return NextResponse.json(
      {
        error: "RATE_LIMIT",
        message: "Too many login attempts",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 보안상 이메일 존재 여부는 숨기고 같은 에러 처리
  if (!user) {
    return NextResponse.json(
      { error: "INVALID_CREDENTIALS" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    return NextResponse.json(
      { error: "INVALID_CREDENTIALS" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { ok: true },
    { status: 200 }
  );
}
