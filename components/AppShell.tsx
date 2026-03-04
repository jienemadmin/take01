"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Tab({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "flex-1 py-3 text-center text-sm",
        active ? "text-slate-900 font-semibold" : "text-slate-500",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] pb-[calc(56px+var(--safe-bottom))]">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3" style={{ paddingTop: "calc(12px + var(--safe-top))" }}>
          <div className="font-bold">MemberPass</div>
          <div className="text-xs text-slate-500">MVP</div>
        </div>
      </header>

      <main className="pt-4">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/90 backdrop-blur" style={{ paddingBottom: "var(--safe-bottom)" }}>
        <div className="mx-auto flex max-w-md">
          <Tab href="/" label="홈" />
          <Tab href="/profile" label="내정보" />
        </div>
      </nav>
    </div>
  );
}
