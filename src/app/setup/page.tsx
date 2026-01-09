"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REGIONS = ["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "galar", "paldea"];
const TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison","ground","flying",
  "psychic","bug","rock","ghost","dragon","dark","steel","fairy",
];

export default function SetupPage() {
  const router = useRouter();
  const [region, setRegion] = useState("kanto");
  const [types, setTypes] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/preferences");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setRegion(data.region ?? "kanto");
        setTypes(data.types ?? []);
      }
    })();
  }, [router]);

  function toggleType(t: string) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function saveAndGoNext() {
    setMsg(null);
    setSaving(true);

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, types }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Failed to save");
        return;
      }

      router.push("/");
    } catch {
      setMsg("Network error while saving preferences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Choose the area and Pokemon type you want
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Your choices will be saved and used to filter what you see next.
      </p>

      <section className="mt-6 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full max-w-xs rounded-xl border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-400"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <h2 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50">Types</h2>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {TYPES.map((t) => {
            const selected = types.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                className={[
                  "rounded-2xl border-2 px-4 py-3 text-sm font-medium capitalize shadow-sm transition",
                  "focus:outline-none focus:ring-2 focus:ring-slate-400/50 dark:focus:ring-slate-500/60",
                  selected
                    ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800 dark:border-slate-200 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    : "border-slate-300 bg-white text-slate-900 hover:border-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>

        {msg && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{msg}</p>}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={saveAndGoNext}
            disabled={saving}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={saveAndGoNext}
            disabled={saving}
            className="rounded-2xl border-2 border-slate-300 bg-transparent px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900"
          >
            {saving ? "Saving..." : "Next"}
          </button>
        </div>
      </section>
    </main>
  );
}
