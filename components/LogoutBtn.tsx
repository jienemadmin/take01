"use client";

import { signOut } from "next-auth/react";

export default function LogoutBtn() {
  return (
    <button
      className="mp-actionBtn"
      onClick={() => signOut({ callbackUrl: "/" })}
      type="button"
      aria-label="logout"
      style={{ padding: "10px 14px" }}
    >
      로그아웃
    </button>
  );
}
