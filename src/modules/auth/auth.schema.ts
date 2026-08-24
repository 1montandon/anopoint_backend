import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["cookies"];
