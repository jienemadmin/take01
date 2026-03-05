import { getServerSession } from "next-auth";
import LogoutBtn from "@/components/LogoutBtn";

export default async function Home() {

  const session = await getServerSession();

  return (
    <main style={{padding:40}}>
      <h1>MemberPass MVP</h1>

      {session ? (
        <>
          <p>로그인됨: {session.user?.email}</p>

          <a href="/me">내정보</a>
          <br/><br/>

          <LogoutBtn />
        </>
      ) : (
        <>
          <a href="/register">회원가입</a>
          <br/>
          <a href="/login">로그인</a>
        </>
      )}

    </main>
  );
}
