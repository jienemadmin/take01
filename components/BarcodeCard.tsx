"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/Modal";

function renderBarcode(svgEl: SVGSVGElement, value: string) {
  // Lazy import so server build doesn't choke
  import("jsbarcode").then((m) => {
    const JsBarcode = (m as any).default ?? (m as any);
    JsBarcode(svgEl, value, {
      format: "CODE128",
      displayValue: true,
      fontSize: 14,
      margin: 8,
      height: 70,
    });
  });
}

export function BarcodeCard({
  barcodeValue,
  status,
}: {
  barcodeValue: string;
  status: "active" | "canceled" | "past_due";
}) {
  const [open, setOpen] = useState(false);
  const smallRef = useRef<SVGSVGElement | null>(null);
  const bigRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (smallRef.current) renderBarcode(smallRef.current, barcodeValue);
  }, [barcodeValue]);

  useEffect(() => {
    if (open && bigRef.current) renderBarcode(bigRef.current, barcodeValue);
  }, [open, barcodeValue]);

  const badge = useMemo(() => {
    if (status === "active") return "✅ active";
    if (status === "past_due") return "⚠️ past_due";
    return "❌ inactive";
  }, [status]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border bg-white p-4 shadow-sm active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">멤버십 바코드</div>
            <div className="mt-1 text-xs text-slate-500">{badge}</div>
          </div>
          <div className="text-xs text-slate-500">눌러서 확대</div>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border bg-white p-2">
          <svg ref={smallRef} className="w-full" />
        </div>
      </button>

      <Modal open={open} title="멤버십 바코드" onClose={() => setOpen(false)}>
        <div className="rounded-xl border bg-white p-2">
          <svg ref={bigRef} className="w-full" />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          리셉션/체크인에서 바코드를 보여주세요.
        </p>
      </Modal>
    </>
  );
}
