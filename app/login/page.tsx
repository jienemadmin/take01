"use client";

import { Suspense, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginInner() {
  const sp = useSearchParams();
  const callbackUrl = useMemo(() => sp.get("callbackUrl") || "/", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      // 1) 먼저 로그인 가능 여부 체크
      const precheck = await fetch("/api/auth/login-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const preData = await precheck.json().catch(() => ({}));

      // 2) 시도 초과
      if (precheck.status === 429) {
        const retryAfter = preData?.retryAfter;
        setErr(
          retryAfter
            ? `로그인 시도 횟수를 초과했어요. 약 ${retryAfter}초 후 다시 시도해주세요.`
            : "로그인 시도 횟수를 초과했어요. 잠시 후 다시 시도해주세요."
        );
        return;
      }

      // 3) 이메일/비밀번호 틀림
      if (precheck.status === 401) {
        setErr("로그인 실패: 이메일/비밀번호를 확인하세요.");
        return;
      }

      // 4) 기타 오류
      if (!precheck.ok) {
        setErr("로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
        return;
      }

      // 5) 여기까지 왔으면 실제 세션 생성
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!res || res.error || res.status === 401) {
        setErr("로그인 실패: 이메일/비밀번호를 확인하세요.");
        return;
      }

      window.location.href = res.url || callbackUrl;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mp-bg">
      <div className="mp-wrap">
        <div className="mp-card">
          <div className="mp-top">
            <div className="mp-brand">
              <div className="mp-brand__title">MemberPass</div>
              <span className="mp-badge">Login</span>
            </div>
            <div className="mp-actions">
              <a className="mp-actionBtn" href="/">홈</a>
              <a className="mp-actionBtn" href="/register">회원가입</a>
            </div>
          </div>

          <h1 className="mp-h1">로그인</h1>
          <p className="mp-sub">계정으로 로그인해서 계속 진행하세요.</p>

          <form onSubmit={onSubmit}>
            <div className="mp-field">
              <label className="mp-label">이메일</label>
              <input
                className="mp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                required
                autoComplete="email"
              />
            </div>

            <div className="mp-field">
              <label className="mp-label">비밀번호</label>
              <input
                className="mp-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>

            {err && <div className="mp-alert">{err}</div>}

            <button className="mp-primary" disabled={loading}>
              {loading ? "처리중..." : "로그인"}
            </button>
          </form>

          <a className="mp-footBtn" href="/register">
            아직 계정이 없나요? 회원가입
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mp-bg">
          <div className="mp-wrap">
            <div className="mp-card">로딩중...</div>
          </div>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
