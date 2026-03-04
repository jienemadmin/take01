"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

const res = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password, name, gender }),
});

let data: any = null;
try { data = await res.json(); } catch {}

if (!res.ok) {
  alert(data?.error || data?.message || `회원가입 실패 (${res.status})`);
  return;
}

alert(data?.message || "회원가입 완료");

  return (
    <main style={{ padding: 40 }}>
      <h1>회원가입</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">가입하기</button>
      </form>
    </main>
  );
}
