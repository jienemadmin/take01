"use client";

import { signOut } from "next-auth/react";

export default function LogoutBtn() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{ padding: 10, border: "1px solid #ccc" }}
    >
      로그아웃
    </button>
  );
}
