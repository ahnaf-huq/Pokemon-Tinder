const TYPE_TO_CATEGORY: Record<string, string> = {
  electric: "science",
  psychic: "science",
  steel: "dev",
  fighting: "sport",
  dark: "movie",
  fairy: "music",
  fire: "travel",
  water: "travel",
  ice: "travel",
  dragon: "movie",
  ghost: "movie",
  rock: "history",
  ground: "history",
  bug: "dev",
  grass: "food",
  normal: "random",
  poison: "random",
  flying: "random",
};

async function fetchJson<T>(url: string, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!res.ok) throw new Error(`Fetch failed (${res.status}): ${url}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export async function getChuckJokeForType(type: string): Promise<string> {
  const category = TYPE_TO_CATEGORY[type] ?? "random";

  try {
    if (category === "random") {
      const data = await fetchJson<{ value: string }>("https://api.chucknorris.io/jokes/random");
      return data.value;
    }

    const data = await fetchJson<{ value: string }>(
      `https://api.chucknorris.io/jokes/random?category=${encodeURIComponent(category)}`
    );
    return data.value;
  } catch {
    const data = await fetchJson<{ value: string }>("https://api.chucknorris.io/jokes/random");
    return data.value;
  }
}
