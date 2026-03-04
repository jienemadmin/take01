"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // ✅ 세션만 만들고, 우리가 처리
    });

    if (!res?.ok) {
      alert(res?.error || "로그인 실패");
      return;
    }

    // ✅ 세션이 만들어졌으니 원하는 페이지로 이동
    alert(`로그인 성공! ${email}`);
    router.push("/"); // or /dashboard
  };

  // 로딩 중 표시(선택)
  if (status === "loading") return <main style={{ padding: 40 }}>Loading...</main>;

  // 이미 로그인 상태면 보여줄 화면
  if (session?.user) {
    return (
      <main style={{ padding: 40 }}>
        <h1>로그인됨</h1>
        <p>
          {session.user.email} / {session.user.name}
        </p>
        <button
          onClick={async () => {
            await signOut({ redirect: false });
            alert("로그아웃 완료");
          }}
        >
          로그아웃
        </button>
      </main>
    );
  }

  // 로그인 폼
  return (
    <main style={{ padding: 40 }}>
      <h1>로그인</h1>
      <form onSubmit={onSubmit}>
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

        <button type="submit">로그인</button>
      </form>
    </main>
  );
}
