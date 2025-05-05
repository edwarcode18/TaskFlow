import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().min(5),
    owner: z.string()
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(3),
    owner: z.string()
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

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
