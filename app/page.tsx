import { getServerSession } from "next-auth";
import LogoutBtn from "@/components/LogoutBtn";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="card">
      <div className="card__inner">
        <div className="header">
          <div className="brand">
            <span style={{ fontSize: 18 }}>MemberPass</span>
            <span className="badge">MVP</span>
          </div>

          <div className="nav">
            {session ? (
              <>
                <Link href="/me">내정보</Link>
                <LogoutBtn />
              </>
            ) : (
              <>
                <Link href="/register">회원가입</Link>
                <Link href="/login">로그인</Link>
              </>
            )}
          </div>
        </div>

        <h1 className="h1">멤버십 로그인 시스템</h1>
        <p className="p">
          현재 단계: 회원가입 / 로그인 / 로그아웃 / 마이페이지 / 보호 API 완료 ✅
        </p>

        <div className="grid" style={{ marginTop: 18 }}>
          <section className="card" style={{ boxShadow: "none" }}>
            <div className="card__inner">
              <h2 style={{ margin: 0, fontSize: 18 }}>상태</h2>
              <div className="toast">
                {session ? (
                  <>로그인됨: <b>{session.user?.email}</b></>
                ) : (
                  <>로그인 필요: 회원가입 또는 로그인 해주세요.</>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                {session ? (
                  <>
                    <Link className="btn btn--ghost" href="/me">내정보 보기</Link>
                  </>
                ) : (
                  <>
                    <Link className="btn" href="/register">회원가입</Link>
                    <Link className="btn btn--ghost" href="/login">로그인</Link>
                  </>
                )}
              </div>
            </div>
          </section>

          <aside className="kv">
            <div className="kv__item">
              <div className="kv__k">Session API</div>
              <div className="kv__v">/api/auth/session</div>
            </div>
            <div className="kv__item">
              <div className="kv__k">Protected Page</div>
              <div className="kv__v">/me</div>
            </div>
            <div className="kv__item">
              <div className="kv__k">Protected API</div>
              <div className="kv__v">/api/me</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
