import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

export type LoginBody = z.infer<typeof loginSchema>["body"];

export type LoginInput = LoginBody;
