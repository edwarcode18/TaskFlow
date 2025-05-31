jest.mock("../../controllers/userProject.controller", () => {
  return {
    UserProjectController: jest.fn().mockImplementation(() => ({
      getAllUserProjects: (_req: express.Request, res: express.Response) =>
        res.status(200).json([]),
      getUserProjectById: (req: express.Request, res: express.Response) =>
        res.status(200).json({ id: req.params.id }),
      createUserProject: (req: express.Request, res: express.Response) =>
        res.status(201).json({ ...req.body, id: "new-up-id" }),
      updateUserProject: (req: express.Request, res: express.Response) =>
        res.status(200).json({ ...req.body, id: req.params.id }),
      deleteUserProject: (_req: express.Request, res: express.Response) =>
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
import userProjectRouter from "../../routes/userProject.route";
import { errorMiddleware } from "../../middlewares/error.middleware";

describe("UserProject Router", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/user-projects", userProjectRouter);
    app.use(errorMiddleware);
  });

  it("should return 400 for invalid ID on GET /:id", async () => {
    const res = await request(app).get("/user-projects/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
  });

  it("should return 400 for invalid body on POST /", async () => {
    const res = await request(app).post("/user-projects").send({
      userId: "",
      projectId: 123
    });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
  });

  it("should create userProject with valid data", async () => {
    const res = await request(app).post("/user-projects").send({
      userId: "user123",
      projectId: "project123",
      roleInProject: "member"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", "new-up-id");
    expect(res.body.userId).toBe("user123");
    expect(res.body.projectId).toBe("project123");
  });

  it("should update userProject with valid data", async () => {
    const res = await request(app)
      .put("/user-projects/123456789012345678901234")
      .send({
        userId: "user999",
        projectId: "project999",
        roleInProject: "owner"
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: "123456789012345678901234",
      userId: "user999",
      roleInProject: "owner"
    });
  });

  it("should delete userProject", async () => {
    const res = await request(app).delete(
      "/user-projects/123456789012345678901234"
    );

    expect(res.status).toBe(204);
  });
});
