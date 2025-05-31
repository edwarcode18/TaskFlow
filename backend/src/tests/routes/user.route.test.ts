jest.mock("../../controllers/user.controller", () => {
  return {
    UserController: jest.fn().mockImplementation(() => ({
      getAllUsers: (_req: express.Request, res: express.Response) =>
        res.status(200).json([]),
      getUserById: (req: express.Request, res: express.Response) =>
        res.status(200).json({ id: req.params.id }),
      getUserByEmail: (req: express.Request, res: express.Response) =>
        res.status(200).json({ email: req.params.email }),
      createUser: (req: express.Request, res: express.Response) =>
        res.status(201).json({ ...req.body, id: "new-user-id" }),
      updateUser: (req: express.Request, res: express.Response) =>
        res.status(200).json({ ...req.body, id: req.params.id }),
      deleteUser: (_req: express.Request, res: express.Response) =>
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
import userRouter from "../../routes/user.route";
import { errorMiddleware } from "../../middlewares/error.middleware";

describe("User Router", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/users", userRouter);
    app.use(errorMiddleware);
  });

  it("should return 400 for invalid user ID on GET /:id", async () => {
    const res = await request(app).get("/users/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
    expect(res.body.error.details).toBeDefined();
  });

  it("should return 400 for invalid body on POST /", async () => {
    const res = await request(app).post("/users").send({
      name: "Al",
      email: "not-an-email",
      password: "123"
    });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
  });

  it("should create user with valid data", async () => {
    const res = await request(app).post("/users").send({
      name: "Alice Smith",
      email: "alice@example.com",
      password: "StrongPass123",
      language: "en",
      role: "user"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", "new-user-id");
    expect(res.body.name).toBe("Alice Smith");
  });

  it("should update user with valid data", async () => {
    const res = await request(app).put("/users/123456789012345678901234").send({
      name: "Updated Name",
      language: "es",
      role: "admin"
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: "123456789012345678901234",
      name: "Updated Name",
      language: "es",
      role: "admin"
    });
  });

  it("should delete user", async () => {
    const res = await request(app).delete("/users/123456789012345678901234");

    expect(res.status).toBe(204);
  });

  it("should get user by email", async () => {
    const res = await request(app).get("/users/email/alice@example.com");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "alice@example.com");
  });
});
