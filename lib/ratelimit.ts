import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

// 회원가입은 기존 ratelimit 유지
export const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 m"),
  analytics: true,
  prefix: "rl:register",
});

// 로그인 실패 횟수 전용 키
function loginFailKey(ip: string, email: string) {
  return `rl:login:fail:${ip}:${email.toLowerCase()}`;
}

// 현재 실패 횟수 조회
export async function getLoginFailCount(ip: string, email: string) {
  const key = loginFailKey(ip, email);
  const count = await redis.get<number>(key);
  return Number(count ?? 0);
}

// 로그인 실패 1회 증가 + TTL 15분 설정
export async function increaseLoginFailCount(ip: string, email: string) {
  const key = loginFailKey(ip, email);

  const count = await redis.incr(key);

  // 첫 실패일 때만 만료시간 설정
  if (count === 1) {
    await redis.expire(key, 60 * 15);
  }

  const ttl = await redis.ttl(key);

  return {
    count,
    retryAfter: ttl > 0 ? ttl : 60 * 15,
  };
}

// 로그인 성공 시 실패 카운트 초기화
export async function clearLoginFailCount(ip: string, email: string) {
  const key = loginFailKey(ip, email);
  await redis.del(key);
}
