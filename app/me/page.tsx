import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MePage() {
  const session = await getServerSession(authOptions);

  return (
    <main style={{ padding: 40 }}>
      <h1>마이페이: /me</h1>
      <p>이메일: {session?.user?.email}</p>
      <p>이름: {session?.user?.name}</p>
      <p>ID: {(session?.user as any)?.id}</p>
    </main>
  );
}
