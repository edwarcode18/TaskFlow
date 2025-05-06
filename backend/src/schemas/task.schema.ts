import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    status: z.enum(["todo", "in-progress", "done"]).default("todo"),
    priority: z.enum(["low", "medium", "high"]).default("low"),
    duDate: z.date().optional(),
    assignee: z.string(),
    projectId: z.string()
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    status: z.enum(["todo", "in-progress", "done"]).default("todo"),
    priority: z.enum(["low", "medium", "high"]).default("low"),
    duDate: z.date().optional(),
    assignee: z.string(),
    projectId: z.string()
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

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
