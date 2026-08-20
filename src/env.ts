import { z } from "zod";

const envSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number(),
  REFRESH_TOKEN_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
