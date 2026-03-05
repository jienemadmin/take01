"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Gender = "M" | "F" | "Other";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("Other");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, gender, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "회원가입에 실패했어요. 입력값을 확인해주세요.");
        setLoading(false);
        return;
      }

      setSuccess("회원가입 완료! 자동으로 로그인할게요.");

      // ✅ 회원가입 직후 자동 로그인
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (!loginRes?.ok) {
        // 자동 로그인 실패하면 로그인 페이지로 안내
        router.push("/login");
        return;
      }

      router.push(loginRes.url ?? "/");
    } catch (err) {
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
            <span className="badge">Register</span>
          </div>
          <div className="nav">
            <Link href="/">홈</Link>
            <Link href="/login">로그인</Link>
          </div>
        </div>

        <h1 className="h1">회원가입</h1>
        <p className="p">계정을 만들고 멤버십 기능을 사용하세요.</p>

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
            <div className="label">이름</div>
            <input
              className="input"
              type="text"
              autoComplete="name"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="row">
            <div className="label">성별</div>
            <select
              className="input"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
            >
              <option value="Other">기타 / 선택안함</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>

          <div className="row">
            <div className="label">비밀번호</div>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상 권장"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className="toast" style={{ borderColor: "rgba(255,92,122,.35)" }}>{error}</div>}
          {success && <div className="toast" style={{ borderColor: "rgba(51,214,255,.35)" }}>{success}</div>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>

          <div className="toast">
            이미 계정이 있나요? <Link href="/login"><b>로그인</b></Link>
          </div>
        </form>
      </div>
    </main>
  );
}
