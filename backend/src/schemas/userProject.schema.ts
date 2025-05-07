import { z } from "zod";

export const createUserProjectSchema = z.object({
  body: z.object({
    userId: z.string(),
    projectId: z.string(),
    roleInProject: z.enum(["owner", "member", "guest"]).default("member"),
    joinedAt: z.date().optional()
  })
});

export const updateUserProjectSchema = z.object({
  body: z.object({
    userId: z.string(),
    projectId: z.string(),
    roleInProject: z.enum(["owner", "member", "guest"]).default("member"),
    joinedAt: z.date().optional()
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

export type CreateUserProjectInput = z.infer<typeof createUserProjectSchema>;
export type UpdateUserProjectInput = z.infer<typeof updateUserProjectSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
