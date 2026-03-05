import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function MePage() {

  const session = await getServerSession();

  if(!session){
    redirect("/login");
  }

  return (
    <main style={{padding:40}}>
      <h1>마이페이지</h1>

      <p>이메일: {session.user?.email}</p>
      <p>이름: {session.user?.name}</p>
      <p>ID: {session.user?.id}</p>

    </main>
  );
}
