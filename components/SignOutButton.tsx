"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="w-full rounded-xl border bg-slate-50 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      로그아웃
    </button>
  );
}
