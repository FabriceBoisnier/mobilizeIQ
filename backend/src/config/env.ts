import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL manquante"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET trop courte"),
  REDIS_URL: z.string().min(1, "REDIS_URL manquante"),
});

export const env = EnvSchema.parse(process.env);
