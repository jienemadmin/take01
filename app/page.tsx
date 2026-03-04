import { getServerSession } from "next-auth";

export default async function Home() {

  const session = await getServerSession();

  return (
    <main style={{padding:40}}>
      <h1>MemberPass MVP</h1>

      {session ? (
        <>
          <p>로그인됨: {session.user?.email}</p>
          <a href="/me">내정보</a>
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
