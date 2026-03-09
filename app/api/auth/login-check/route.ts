import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  getLoginFailCount,
  increaseLoginFailCount,
  clearLoginFailCount,
} from "@/lib/ratelimit";

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

  // 1) 현재 실패 횟수 먼저 확인
  const failCount = await getLoginFailCount(ip, email);

  if (failCount >= 10) {
    return NextResponse.json(
      {
        error: "RATE_LIMIT",
        message: "Too many failed login attempts",
        retryAfter: 900, // 대략 15분
      },
      {
        status: 429,
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 2) 계정 없음 → 실패 카운트 증가
  if (!user) {
    const result = await increaseLoginFailCount(ip, email);

    await prisma.securityLog.create({
      data: {
        type: "LOGIN_FAIL",
        email,
        ip,
        detail: "user_not_found",
      },
    });

    return NextResponse.json(
      { error: "INVALID_CREDENTIALS" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  // 3) 비밀번호 틀림 → 실패 카운트 증가
  if (!ok) {
    const result = await increaseLoginFailCount(ip, email);

    await prisma.securityLog.create({
      data: {
        type: "LOGIN_FAIL",
        email,
        ip,
        detail: "wrong_password",
      },
    });

    return NextResponse.json(
      { error: "INVALID_CREDENTIALS" },
      { status: 401 }
    );
  }

  // 4) 성공 → 실패 카운트 초기화
  await clearLoginFailCount(ip, email);

  return NextResponse.json(
    { ok: true },
    { status: 200 }
  );
}
