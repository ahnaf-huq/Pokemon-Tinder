type RegionResponse = { pokedexes: { url: string }[] };
type PokedexResponse = {
  pokemon_entries: { pokemon_species: { url: string } }[];
};

export type PokemonDetails = {
  id: number;
  name: string;
  sprites: { front_default: string | null };
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  base_experience: number | null;
};

type TypeResponse = {
  pokemon: { pokemon: { url: string } }[];
};

const TTL_MS = 1000 * 60 * 60;

const detailsCache = new Map<number, { ts: number; data: PokemonDetails }>();
const regionCache = new Map<string, { ts: number; ids: number[] }>();
const typeCache = new Map<string, { ts: number; ids: number[] }>();

function idFromUrl(url: string): number | null {
  const m = url.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
}

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

// Region -> pokedex -> species URLs -> national ids (NOT entry_number)
export async function getRegionPokemonIds(region: string): Promise<number[]> {
  const now = Date.now();
  const cached = regionCache.get(region);
  if (cached && now - cached.ts < TTL_MS) return cached.ids;

  const regionData = await fetchJson<RegionResponse>(`https://pokeapi.co/api/v2/region/${region}`);
  const pokedexUrl = regionData.pokedexes?.[0]?.url;

  if (!pokedexUrl) {
    regionCache.set(region, { ts: now, ids: [] });
    return [];
  }

  const pokedex = await fetchJson<PokedexResponse>(pokedexUrl);
  const ids = pokedex.pokemon_entries
    .map((e) => idFromUrl(e.pokemon_species.url))
    .filter((x): x is number => x !== null);

  regionCache.set(region, { ts: now, ids });
  return ids;
}

export async function getPokemonDetails(id: number): Promise<PokemonDetails> {
  const now = Date.now();
  const hit = detailsCache.get(id);
  if (hit && now - hit.ts < TTL_MS) return hit.data;

  const data = await fetchJson<PokemonDetails>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  detailsCache.set(id, { ts: now, data });
  return data;
}

// Type -> list of pokemon ids
export async function getTypePokemonIds(type: string): Promise<number[]> {
  const now = Date.now();
  const cached = typeCache.get(type);
  if (cached && now - cached.ts < TTL_MS) return cached.ids;

  const data = await fetchJson<TypeResponse>(`https://pokeapi.co/api/v2/type/${type}`);

  const ids = data.pokemon
    .map((p) => {
      const m = p.pokemon.url.match(/\/pokemon\/(\d+)\//);
      return m ? Number(m[1]) : null;
    })
    .filter((x): x is number => x !== null);

  typeCache.set(type, { ts: now, ids });
  return ids;
}
