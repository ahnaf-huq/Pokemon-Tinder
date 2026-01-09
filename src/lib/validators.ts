import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(6).max(128),
});

export const loginSchema = registerSchema;

export const preferencesSchema = z.object({
  region: z.string().min(1),
  types: z.array(z.string().min(1)).max(18),
});

export const swipeSchema = z.object({
  pokemonId: z.number().int().positive(),
  decision: z.enum(["LIKE", "DISLIKE"]),
  pokemonName: z.string().min(1),
  spriteUrl: z.string().url(),
});
