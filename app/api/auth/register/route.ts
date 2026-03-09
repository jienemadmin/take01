import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerLimiter } from "@/lib/ratelimit";
import { randomUUID } from "crypto";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  gender: z.enum(["M", "F", "Other"]).default("Other"),
});

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  const xr = req.headers.get("x-real-ip");
  const ip = (xf ?? xr ?? "unknown").split(",")[0].trim();
  return ip || "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // 1) 회원가입 시도 자체 제한 (IP 기준)
  const rl = await registerLimiter.limit(ip);

  if (!rl.success) {
    const retryAfter = Math.max(
      1,
      Math.ceil((rl.reset - Date.now()) / 1000)
    );

    await prisma.securityLog.create({
      data: {
        type: "REGISTER_RATE_LIMIT",
        ip,
        detail: `retryAfter=${retryAfter}`,
      },
    });

    return NextResponse.json(
      {
        error: "RATE_LIMIT",
        message: "Too many register attempts",
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

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    await prisma.securityLog.create({
      data: {
        type: "REGISTER_FAIL",
        ip,
        detail: "invalid_payload",
      },
    });

    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  const { email, password, name, gender } = parsed.data;

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    await prisma.securityLog.create({
      data: {
        type: "REGISTER_FAIL",
        email,
        ip,
        detail: "email_already_exists",
      },
    });

    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      gender: gender as any,
      membership: {
        create: {
          status: "canceled",
          barcodeValue: `MEMBER-${randomUUID().slice(0, 8).toUpperCase()}`,
        },
      },
    },
    select: { id: true, email: true },
  });

  await prisma.securityLog.create({
    data: {
      type: "REGISTER_SUCCESS",
      email: user.email,
      ip,
      userId: user.id,
    },
  });

  return NextResponse.json({
    ok: true,
    userId: user.id,
  });
}
