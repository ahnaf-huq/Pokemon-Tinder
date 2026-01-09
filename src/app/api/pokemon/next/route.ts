import { NextResponse } from "next/server";
import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRegionPokemonIds, getPokemonDetails, getTypePokemonIds } from "@/lib/pokeapi";
import { randomHumanName } from "@/lib/names";
import { getChuckJokeForType } from "@/lib/chuck";

function levelFromId(id: number) {
  return (id % 100) + 1;
}

export async function GET() {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pref = await prisma.preference.findUnique({ where: { userId } });
  if (!pref) return NextResponse.json({ error: "Set preferences first" }, { status: 400 });

  const selectedTypes = JSON.parse(pref.typesJson) as string[];

  const regionIds = await getRegionPokemonIds(pref.region);
  if (regionIds.length === 0) {
    return NextResponse.json({ error: "No Pokémon found for region" }, { status: 404 });
  }

  const swiped = await prisma.swipe.findMany({
    where: { userId },
    select: { pokemonId: true },
  });
  const swipedSet = new Set(swiped.map((s) => s.pokemonId));
  const regionSet = new Set(regionIds);

  let candidateIds: number[] = [];

  if (selectedTypes.length > 0) {
    const pools = await Promise.all(selectedTypes.map((t) => getTypePokemonIds(t)));
    const merged = new Set<number>();

    for (const ids of pools) {
      for (const id of ids) {
        if (!regionSet.has(id)) continue;
        if (swipedSet.has(id)) continue;
        merged.add(id);
      }
    }

    candidateIds = Array.from(merged);
    if (candidateIds.length === 0) {
      return NextResponse.json({ error: "No matches for selected types in this region" }, { status: 404 });
    }
  } else {
    candidateIds = regionIds.filter((id) => !swipedSet.has(id));
    if (candidateIds.length === 0) {
      return NextResponse.json({ error: "No more Pokémon to show" }, { status: 404 });
    }
  }

  const id = candidateIds[Math.floor(Math.random() * candidateIds.length)];
  const details = await getPokemonDetails(id);

  const types = details.types.map((t) => t.type.name);
  const primaryType = types[0] ?? "normal";
  const joke = await getChuckJokeForType(primaryType);

  return NextResponse.json({
    pokemonId: details.id,
    pokemonName: details.name,
    displayName: `${randomHumanName()} the ${details.name}`,
    spriteUrl: details.sprites.front_default,
    types,
    height: details.height,
    weight: details.weight,
    ability: details.abilities?.[0]?.ability?.name ?? "unknown",
    level: levelFromId(details.id),
    joke,
  });
}
