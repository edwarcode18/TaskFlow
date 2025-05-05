import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number");

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: passwordSchema,
    language: z.enum(["es", "en"]).optional(),
    role: z.enum(["admin", "user", "guest"]).optional()
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    language: z.enum(["es", "en"]).optional(),
    role: z.enum(["admin", "user", "guest"]).optional()
  }),
  params: z.object({
    id: z.string().length(24, "Invalid ID format")
  })
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid ID format")
  })
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
