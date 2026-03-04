"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";

type Lodging = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  thumbnailUrl: string;
  distanceMeters?: number;
};

const FALLBACK = { lat: 37.566535, lng: 126.9779692 }; // Seoul City Hall

export function NearestLodgingMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const center = pos ?? FALLBACK;

  const nearest = useMemo(() => lodgings[0], [lodgings]);

  async function loadLodgings(lat: number, lng: number) {
    const res = await fetch(`/api/lodgings?lat=${lat}&lng=${lng}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load lodgings");
    const data = (await res.json()) as { lodgings: Lodging[] };
    setLodgings(data.lodgings);
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 기기에서 위치 기능을 사용할 수 없어요.");
      setPos(FALLBACK);
      loadLodgings(FALLBACK.lat, FALLBACK.lng).catch(() => {});
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const lat = p.coords.latitude;
        const lng = p.coords.longitude;
        setPos({ lat, lng });
        loadLodgings(lat, lng).catch((e) => setError(e.message));
      },
      () => {
        setError("위치 권한이 필요합니다.");
        setPos(FALLBACK);
        loadLodgings(FALLBACK.lat, FALLBACK.lng).catch(() => {});
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) {
      setError("Mapbox 토큰이 설정되지 않았어요. (.env.local 확인)");
      return;
    }
    if (!containerRef.current) return;

    let cancelled = false;

    (async () => {
      const m = await import("mapbox-gl");
      const mapbox = m.default as unknown as typeof mapboxgl;
      (mapbox as any).accessToken = token;

      if (cancelled) return;

      const map = new mapbox.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [center.lng, center.lat],
        zoom: 12,
      });

      mapRef.current = map;

      map.addControl(new mapbox.NavigationControl(), "top-right");

      map.on("load", () => {
        // user marker
        new mapbox.Marker({ color: "#111827" })
          .setLngLat([center.lng, center.lat])
          .addTo(map);

        lodgings.forEach((l) => {
          new mapbox.Marker({ color: l.id === nearest?.id ? "#0ea5e9" : "#94a3b8" })
            .setLngLat([l.lng, l.lat])
            .setPopup(new mapbox.Popup({ offset: 24 }).setText(l.name))
            .addTo(map);
        });
      });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token, center.lat, center.lng, lodgings, nearest?.id]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">내 주변 숙소</div>
          <div className="mt-1 text-xs text-slate-500">
            {error ? (
              <span>{error} {error.includes("권한") && " (기본 위치로 표시)"} </span>
            ) : (
              <span>가장 가까운 숙소를 표시합니다.</span>
            )}
          </div>
        </div>
        <button
          className="rounded-lg border px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
          onClick={() => {
            setError(null);
            navigator.geolocation.getCurrentPosition(
              (p) => {
                const lat = p.coords.latitude;
                const lng = p.coords.longitude;
                setPos({ lat, lng });
                loadLodgings(lat, lng).catch((e) => setError(e.message));
              },
              () => setError("위치 권한이 필요합니다."),
              { enableHighAccuracy: true, timeout: 8000 }
            );
          }}
        >
          재시도
        </button>
      </div>

      <div className="mt-3 h-56 overflow-hidden rounded-xl border">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {nearest ? (
        <div className="mt-3 flex gap-3 rounded-xl border bg-slate-50 p-3">
          <img
            src={nearest.thumbnailUrl}
            alt=""
            className="h-14 w-14 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{nearest.name}</div>
            <div className="mt-1 truncate text-xs text-slate-600">{nearest.address}</div>
            <div className="mt-1 text-xs text-slate-500">
              {(nearest.distanceMeters ?? 0) >= 1000
                ? `${((nearest.distanceMeters ?? 0) / 1000).toFixed(1)}km`
                : `${Math.round(nearest.distanceMeters ?? 0)}m`} · 가장 가까움
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 text-xs text-slate-500">숙소 데이터가 없어요.</div>
      )}
    </div>
  );
}
