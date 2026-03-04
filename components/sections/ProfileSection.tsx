"use client";

import { useEffect, useMemo, useState } from "react";
import { BarcodeCard } from "@/components/BarcodeCard";

type Me = {
  user: { name: string; email: string; gender: "M" | "F" | "Other" };
  membership: { status: "active" | "canceled" | "past_due"; barcodeValue: string } | null;
};

const avatarFor = (gender: Me["user"]["gender"]) => {
  if (gender === "M") return "/avatars/male.svg";
  if (gender === "F") return "/avatars/female.svg";
  return "/avatars/neutral.svg";
};

export function ProfileSection() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMe(d))
      .finally(() => setLoading(false));
  }, []);

  const status = me?.membership?.status ?? "canceled";
  const barcodeValue = me?.membership?.barcodeValue ?? "MEMBER-000000";

  const needsPay = status !== "active";

  const subtitle = useMemo(() => {
    if (loading) return "불러오는 중…";
    if (!me) return "세션 정보를 불러오지 못했어요.";
    return me.user.email;
  }, [loading, me]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={me ? avatarFor(me.user.gender) : "/avatars/neutral.svg"}
          alt="avatar"
          className="h-12 w-12 rounded-full border object-cover"
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{me?.user.name ?? "—"}</div>
          <div className="truncate text-xs text-slate-500">{subtitle}</div>
        </div>
        <div className="ml-auto text-xs text-slate-500">
          {status === "active" ? "✅ 멤버십" : status === "past_due" ? "⚠️ 결제 필요" : "❌ 미가입"}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <BarcodeCard barcodeValue={barcodeValue} status={status} />

        {needsPay && (
          <button
            disabled={billingLoading}
            onClick={async () => {
              setBillingLoading(true);
              try {
                const r = await fetch("/api/billing/checkout", { method: "POST" });
                const d = await r.json();
                if (d?.url) window.location.href = d.url;
              } finally {
                setBillingLoading(false);
              }
            }}
            className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {billingLoading ? "결제 페이지 여는 중…" : "멤버십 활성화(구독 결제)"}
          </button>
        )}
      </div>
    </div>
  );
}
