jest.mock("../../controllers/task.controller", () => {
  return {
    TaskController: jest.fn().mockImplementation(() => ({
      getAllTask: (_req: express.Request, res: express.Response) =>
        res.status(200).json([]),
      getTasksById: (req: express.Request, res: express.Response) =>
        res.status(200).json({ id: req.params.id }),
      createTask: (req: express.Request, res: express.Response) =>
        res.status(201).json({ ...req.body, id: "new-task-id" }),
      updateTask: (req: express.Request, res: express.Response) =>
        res.status(200).json({ ...req.body, id: req.params.id }),
      deleteTask: (_req: express.Request, res: express.Response) =>
        res.status(204).send()
    }))
  };
});

jest.mock("../../middlewares/auth.middleware", () => ({
  authenticate: (
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => next()
}));

import express from "express";
import request from "supertest";
import taskRouter from "../../routes/task.route";
import { errorMiddleware } from "../../middlewares/error.middleware";

describe("Task Router", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/tasks", taskRouter);
    app.use(errorMiddleware);
  });

  it("should return 400 for invalid task ID on GET /:id", async () => {
    const res = await request(app).get("/tasks/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
    expect(res.body.error.details).toBeDefined();
    expect(Array.isArray(res.body.error.details.details)).toBe(true);
  });

  it("should return 400 for invalid body on POST /", async () => {
    const res = await request(app).post("/tasks").send({
      title: "ok",
      description: 123,
      status: "wrong-status",
      priority: "high"
    });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
    expect(res.body.error.details).toBeDefined();
  });

  it("should create task with valid data", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "Some description here",
      status: "todo",
      priority: "medium",
      assignee: "user123",
      projectId: "project123"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", "new-task-id");
    expect(res.body.title).toBe("Test Task");
  });

  it("should update task with valid data", async () => {
    const res = await request(app).put("/tasks/123456789012345678901234").send({
      title: "Updated Task",
      description: "Updated description",
      status: "in-progress",
      priority: "high",
      assignee: "user456",
      projectId: "project456"
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: "123456789012345678901234",
      title: "Updated Task",
      status: "in-progress"
    });
  });

  it("should delete task", async () => {
    const res = await request(app).delete("/tasks/123456789012345678901234");

    expect(res.status).toBe(204);
  });
});
