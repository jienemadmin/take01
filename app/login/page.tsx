"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = sp.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!res?.ok) {
        setError(res?.error || "로그인에 실패했어요. 이메일/비밀번호를 확인해주세요.");
        setLoading(false);
        return;
      }

      router.push(res.url ?? callbackUrl);
    } catch {
      setError("예기치 못한 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      setLoading(false);
    }
  };

  return (
    <main className="card">
      <div className="card__inner">
        <div className="header">
          <div className="brand">
            <span style={{ fontSize: 18 }}>MemberPass</span>
            <span className="badge">Login</span>
          </div>
          <div className="nav">
            <Link href="/">홈</Link>
            <Link href="/register">회원가입</Link>
          </div>
        </div>

        <h1 className="h1">로그인</h1>
        <p className="p">계정으로 로그인해서 멤버십 기능을 사용하세요.</p>

        <form className="form" onSubmit={onSubmit}>
          <div className="row">
            <div className="label">이메일</div>
            <input
              className="input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="row">
            <div className="label">비밀번호</div>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="toast" style={{ borderColor: "rgba(255,92,122,.35)" }}>
              {error}
            </div>
          )}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="toast">
            계정이 없나요?{" "}
            <Link href="/register">
              <b>회원가입</b>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  // ✅ useSearchParams()는 Suspense 아래에서만 안전
  return (
    <Suspense
      fallback={
        <main className="card">
          <div className="card__inner">
            <h1 className="h1">로그인</h1>
            <p className="p">로딩 중...</p>
          </div>
        </main>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
