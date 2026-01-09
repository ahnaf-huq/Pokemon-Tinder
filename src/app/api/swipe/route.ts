import { NextResponse } from "next/server";
import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { swipeSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = swipeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { pokemonId, decision, pokemonName, spriteUrl } = parsed.data;

  await prisma.swipe.upsert({
    where: { userId_pokemonId: { userId, pokemonId } },
    create: { userId, pokemonId, decision, pokemonName, spriteUrl },
    update: { decision, pokemonName, spriteUrl },
  });

  return NextResponse.json({ ok: true });
}
