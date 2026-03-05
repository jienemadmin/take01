import AuthShell from "@/components/AuthShell";
import LogoutBtn from "@/components/LogoutBtn";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MePage() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  const id = (session.user as any)?.id;

  return (
    <AuthShell
      badge="Me"
      title="내 계정"
      subtitle="로그인 세션이 유지되는지 확인하는 보호 페이지입니다."
      right={
        <>
          <a className="mp-actionBtn" href="/">홈</a>
          <LogoutBtn />
        </>
      }
    >
      <div style={{ marginTop: 10 }}>
        <div className="mp-alert" style={{ borderColor: "rgba(255,255,255,.14)", background: "rgba(255,255,255,.06)" }}>
          <div style={{ display: "grid", gap: 8 }}>
            <div><b>이메일</b>: {session.user?.email}</div>
            <div><b>이름</b>: {session.user?.name}</div>
            <div><b>ID</b>: {id}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        <a className="mp-footBtn" href="/api/auth/session" target="_blank">
          세션 JSON 보기 (/api/auth/session)
        </a>
        <a className="mp-footBtn" href="/api/me" target="_blank">
          보호 API 테스트 (/api/me)
        </a>
      </div>
    </AuthShell>
  );
}
