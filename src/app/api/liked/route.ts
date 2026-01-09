import { NextResponse } from "next/server";
import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const liked = await prisma.swipe.findMany({
    where: { userId, decision: "LIKE" },
    orderBy: { createdAt: "desc" },
    select: { pokemonId: true, pokemonName: true, spriteUrl: true, createdAt: true },
  });

  return NextResponse.json({ liked });
}
