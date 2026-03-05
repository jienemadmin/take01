"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "Other">("Other");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOkMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          gender,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error || `회원가입 실패 (${res.status})`);
        return;
      }

      setOkMsg("회원가입 완료! 이제 로그인 해주세요.");
      setEmail("");
      setName("");
      setPassword("");
      setGender("Other");
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
              <span className="mp-badge">Register</span>
            </div>
            <div className="mp-actions">
              <a className="mp-actionBtn" href="/">홈</a>
              <a className="mp-actionBtn" href="/login">로그인</a>
            </div>
          </div>

          <h1 className="mp-h1">회원가입</h1>
          <p className="mp-sub">계정을 만들고 멤버십 기능을 사용하세요.</p>

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
              />
            </div>

            <div className="mp-field">
              <label className="mp-label">이름</label>
              <input
                className="mp-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                type="text"
                required
              />
            </div>

            <div className="mp-field">
              <label className="mp-label">성별</label>
              <select
                className="mp-select"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              >
                <option value="Other">기타 / 선택안함</option>
                <option value="M">남</option>
                <option value="F">여</option>
              </select>
            </div>

            <div className="mp-field">
              <label className="mp-label">비밀번호</label>
              <input
                className="mp-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 권장"
                type="password"
                minLength={6}
                required
              />
            </div>

            {err && <div className="mp-alert">{err}</div>}
            {okMsg && <div className="mp-alert" style={{ borderColor: "rgba(60,255,190,.35)", background: "rgba(60,255,190,.10)" }}>{okMsg}</div>}

            <button className="mp-primary" disabled={loading}>
              {loading ? "처리중..." : "회원가입"}
            </button>
          </form>

          <a className="mp-footBtn" href="/login">
            이미 계정이 있나요? 로그인
          </a>
        </div>
      </div>
    </div>
  );
}
