import { getServerSession } from "next-auth";
import LogoutBtn from "@/components/LogoutBtn";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="mp-bg">
      <div className="mp-wrap">
        <div className="mp-card">
          <div className="mp-top">
            <div className="mp-brand">
              <div className="mp-brand__title">MemberPass</div>
              <span className="mp-badge">MVP</span>
            </div>
            <div className="mp-actions">
              {!session ? (
                <>
                  <a className="mp-actionBtn" href="/register">회원가입</a>
                  <a className="mp-actionBtn" href="/login">로그인</a>
                </>
              ) : (
                <a className="mp-actionBtn" href="/me">내정보</a>
              )}
            </div>
          </div>

          <h1 className="mp-h1">MemberPass MVP</h1>
          <p className="mp-sub">회원가입 / 로그인 / 로그아웃 / 마이페이지 기반 MVP</p>

          {session ? (
            <>
              <p style={{ marginTop: 8, color: "rgba(255,255,255,.85)" }}>
                로그인됨: <b>{session.user?.email}</b>
              </p>
              <div style={{ marginTop: 14 }}>
                <LogoutBtn />
              </div>
            </>
          ) : (
            <div style={{ marginTop: 14 }}>
              <a className="mp-footBtn" href="/register">회원가입 하러가기</a>
              <a className="mp-footBtn" href="/login">로그인 하러가기</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
