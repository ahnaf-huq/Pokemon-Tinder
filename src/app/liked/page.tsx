"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Liked = { pokemonId: number; pokemonName: string; spriteUrl: string; createdAt: string };

export default function LikedPage() {
  const router = useRouter();
  const [liked, setLiked] = useState<Liked[]>([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/liked");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json().catch(() => ({ liked: [] }));
      setLiked(data.liked ?? []);
      setStatus("");
    })();
  }, [router]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="rounded-2xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900"
        >
          ← Back
        </button>

        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Liked</h1>

        <div />
      </div>

      {status && <p className="text-center text-sm text-slate-600 dark:text-slate-300">{status}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        {liked.map((p) => (
          <div
            key={p.pokemonId}
            className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-center">
              <p className="font-semibold capitalize text-slate-900 dark:text-slate-50">
                {p.pokemonName}
              </p>
              <img src={p.spriteUrl} alt={p.pokemonName} width={120} height={120} className="mx-auto mt-3" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
