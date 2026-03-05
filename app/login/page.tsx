"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function mapNextAuthError(err?: string | null) {
  if (!err) return null;
  if (err === "CredentialsSignin") return "로그인 실패: 이메일/비밀번호를 확인하세요.";
  return "로그인 실패: 다시 시도해주세요.";
}

function LoginInner() {
  const sp = useSearchParams();
  const callbackUrl = useMemo(() => sp.get("callbackUrl") || "/", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ✅ 혹시 URL에 ?error= 가 붙는 케이스도 표시
  useEffect(() => {
    const e = sp.get("error");
    const msg = mapNextAuthError(e);
    if (msg) setErr(msg);
  }, [sp]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      // ✅ 디버그 원하면 잠깐 켜서 res 확인
      // console.log("signIn res:", res);

      // ✅ 429 (rate limit)
      if (res?.status === 429) {
        setErr("로그인 시도 횟수를 초과했어요. 잠시 후 다시 시도해주세요.");
        return;
      }

      // ✅ 401/에러 (비번 틀림 등)
      if (!res || res.error || res.status === 401) {
        // NextAuth에서 보통 res.error가 "CredentialsSignin"으로 옴
        setErr(mapNextAuthError(res?.error) ?? "로그인 실패: 이메일/비밀번호를 확인하세요.");
        return;
      }

      // 성공
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
