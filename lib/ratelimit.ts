import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

/* =========================
   회원가입: IP 기준 전체 시도 제한
   성공/실패 상관없이 자원 소모라서 전체 시도를 제한하는 게 정석
   ========================= */
export const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 m"),
  analytics: true,
  prefix: "rl:register",
});

/* =========================
   로그인: 실패 횟수만 카운트
   성공 시 초기화
   ========================= */
function loginFailKey(ip: string, email: string) {
  return `rl:login:fail:${ip}:${email.toLowerCase()}`;
}

export async function getLoginFailCount(ip: string, email: string) {
  const key = loginFailKey(ip, email);
  const count = await redis.get<number>(key);
  return Number(count ?? 0);
}

export async function increaseLoginFailCount(ip: string, email: string) {
  const key = loginFailKey(ip, email);

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60 * 15);
  }

  const ttl = await redis.ttl(key);

  return {
    count,
    retryAfter: ttl > 0 ? ttl : 60 * 15,
  };
}

export async function clearLoginFailCount(ip: string, email: string) {
  const key = loginFailKey(ip, email);
  await redis.del(key);
}
