"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Card = {
  pokemonId: number;
  pokemonName: string;
  displayName: string;
  spriteUrl: string | null;
  types: string[];
  height: number;
  weight: number;
  ability: string;
  level: number;
  joke: string;
};

export default function HomePage() {
  const router = useRouter();
  const [card, setCard] = useState<Card | null>(null);
  const [status, setStatus] = useState<string>("Loading...");

  async function loadNext() {
    try {
      setStatus("Loading...");
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 12000);

      const res = await fetch("/api/pokemon/next", { signal: controller.signal });
      clearTimeout(t);

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setCard(null);
        setStatus(data.error ?? "No more results");
        return;
      }

      const data = (await res.json()) as Card;
      setCard(data);
      setStatus("");
    } catch {
      setCard(null);
      setStatus("Failed to load Pokémon (timeout or network error).");
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch("/api/me");
        const me = await meRes.json().catch(() => ({ user: null }));
        if (!me?.user) {
          router.push("/login");
          return;
        }
        await loadNext();
      } catch {
        setStatus("Failed to load session. Please refresh.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function swipe(decision: "LIKE" | "DISLIKE") {
    if (!card) return;

    await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pokemonId: card.pokemonId,
        decision,
        pokemonName: card.pokemonName,
        spriteUrl:
          card.spriteUrl ??
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png",
      }),
    });

    loadNext();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/setup")}
            className="rounded-2xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => router.push("/liked")}
            className="rounded-2xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900"
          >
            Liked
          </button>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Logout
        </button>
      </header>

      {status && (
        <p className="text-center text-sm text-slate-600 dark:text-slate-300">{status}</p>
      )}

      {card && (
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {card.displayName}
          </h1>

          <div className="mt-6 flex justify-center">
            {card.spriteUrl ? (
              <img
                src={card.spriteUrl}
                alt={card.pokemonName}
                width={220}
                height={220}
                className="select-none"
              />
            ) : (
              <div className="h-[220px] w-[220px] rounded-2xl border-2 border-slate-200 dark:border-slate-800" />
            )}
          </div>

          <div className="mt-6 text-center text-slate-900 dark:text-slate-50">
            <p className="text-base">
              <span className="font-semibold">Types:</span>{" "}
              <span className="text-slate-700 dark:text-slate-200">{card.types.join(", ")}</span>
            </p>
            <p className="mt-1 text-base">
              <span className="font-semibold">Height:</span>{" "}
              <span className="text-slate-700 dark:text-slate-200">{card.height}</span>
              <span className="mx-2 text-slate-400 dark:text-slate-600">|</span>
              <span className="font-semibold">Weight:</span>{" "}
              <span className="text-slate-700 dark:text-slate-200">{card.weight}</span>
            </p>
            <p className="mt-1 text-base">
              <span className="font-semibold">Skill:</span>{" "}
              <span className="text-slate-700 dark:text-slate-200">{card.ability}</span>
              <span className="mx-2 text-slate-400 dark:text-slate-600">|</span>
              <span className="font-semibold">Lvl:</span>{" "}
              <span className="text-slate-700 dark:text-slate-200">{card.level}</span>
            </p>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Chuck Norris says
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {card.joke}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => swipe("DISLIKE")}
              className="w-44 rounded-2xl border-2 border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900"
            >
              ✕ Dislike
            </button>
            <button
              type="button"
              onClick={() => swipe("LIKE")}
              className="w-44 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              ✓ Like
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
