"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Post = { id: string; title: string; content: string; createdAt: string };

export function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?mine=true", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">내 게시글</div>
        <div className="text-xs text-slate-500">최신순</div>
      </div>

      <div className="mt-3 space-y-2">
        {loading ? (
          <div className="text-xs text-slate-500">불러오는 중…</div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
            첫 게시글을 작성해보세요.
          </div>
        ) : (
          posts.map((p) => (
            <Link
              key={p.id}
              href={`/posts/${p.id}`}
              className="block rounded-xl border bg-slate-50 p-3 hover:bg-slate-100"
            >
              <div className="truncate text-sm font-semibold">{p.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-slate-600">{p.content}</div>
              <div className="mt-2 text-[11px] text-slate-500">
                {new Date(p.createdAt).toLocaleString()}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
