// src/tests/routes/project.route.test.ts
jest.mock("../../controllers/project.controller", () => {
  return {
    ProjectController: jest.fn().mockImplementation(() => ({
      getAllProjects: (_req: express.Request, res: express.Response) =>
        res.status(200).json([]),
      getProjectById: (req: express.Request, res: express.Response) =>
        res.status(200).json({ id: req.params.id }),
      createProject: (req: express.Request, res: express.Response) =>
        res.status(201).json({ ...req.body, id: "new-id" }),
      updateProject: (req: express.Request, res: express.Response) =>
        res.status(200).json({ ...req.body, id: req.params.id }),
      deleteProject: (_req: express.Request, res: express.Response) =>
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
import projectRouter from "../../routes/project.route";
import { errorMiddleware } from "../../middlewares/error.middleware";

describe("Project Router", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/projects", projectRouter);
    app.use(errorMiddleware);
  });

  it("should return 400 for invalid project ID on GET /:id", async () => {
    const res = await request(app).get("/projects/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
    expect(res.body.error.details).toBeDefined();
    expect(Array.isArray(res.body.error.details.details)).toBe(true);
  });

  it("should return 400 for invalid body on POST /", async () => {
    const res = await request(app)
      .post("/projects")
      .send({
        body: {
          name: "",
          description: 123
        }
      });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
    expect(res.body.error.details).toBeDefined();
    expect(Array.isArray(res.body.error.details.details)).toBe(true);
  });

  it("should create project with valid data", async () => {
    const res = await request(app).post("/projects").send({
      name: "Test Project",
      description: "Some description",
      owner: "user123"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", "new-id");
    expect(res.body.name).toBe("Test Project");
  });

  it("should update project with valid data", async () => {
    const res = await request(app)
      .put("/projects/123456789012345678901234")
      .send({
        name: "Updated Project",
        description: "Updated desc",
        owner: "user123"
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: "123456789012345678901234",
      name: "Updated Project",
      description: "Updated desc"
    });
  });

  it("should delete project", async () => {
    const res = await request(app).delete("/projects/123456789012345678901234");

    expect(res.status).toBe(204);
  });
});
