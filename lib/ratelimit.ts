// lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// 로그인: 10번 / 15분 (IP+email 기준)
export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "rl:login",
});

// 회원가입: 5번 / 30분 (IP 기준)
export const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 m"),
  prefix: "rl:register",
});
