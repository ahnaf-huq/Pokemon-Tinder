import { NextResponse } from "next/server";
import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { preferencesSchema } from "@/lib/validators";

export async function GET() {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pref = await prisma.preference.findUnique({ where: { userId } });
  if (!pref) return NextResponse.json({ region: "kanto", types: [] });

  return NextResponse.json({ region: pref.region, types: JSON.parse(pref.typesJson) as string[] });
}

export async function POST(req: Request) {
  const userId = await getUserIdFromCookies();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = preferencesSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { region, types } = parsed.data;

  await prisma.preference.upsert({
    where: { userId },
    create: { userId, region, typesJson: JSON.stringify(types) },
    update: { region, typesJson: JSON.stringify(types) },
  });

  return NextResponse.json({ ok: true });
}
