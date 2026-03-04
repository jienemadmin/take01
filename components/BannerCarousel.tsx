"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
};

export function BannerCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetch("/api/banners", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setBanners(d.banners ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!embla) return;
    const timer = setInterval(() => embla.scrollNext(), 4500);
    return () => clearInterval(timer);
  }, [embla]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold">이벤트</div>
      <div className="mt-3 overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((b) => (
            <a
              key={b.id}
              href={b.linkUrl}
              className="mr-3 min-w-0 flex-[0_0_85%] rounded-xl border bg-slate-50"
              target={b.linkUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              <img src={b.imageUrl} alt={b.title} className="h-36 w-full rounded-t-xl object-cover" />
              <div className="p-3">
                <div className="truncate text-sm font-semibold">{b.title}</div>
                <div className="mt-1 text-xs text-slate-500">눌러서 자세히 보기</div>
              </div>
            </a>
          ))}
          {banners.length === 0 && (
            <div className="flex-[0_0_100%] rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
              진행 중인 이벤트가 없어요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
