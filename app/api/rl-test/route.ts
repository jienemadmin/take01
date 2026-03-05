import { NextResponse } from "next/server";
import { loginLimiter } from "@/lib/ratelimit";

export async function GET() {
  const key = "debug:fixed-key";
  const result = await loginLimiter.limit(key);

  return NextResponse.json({
    key,
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  });
}
