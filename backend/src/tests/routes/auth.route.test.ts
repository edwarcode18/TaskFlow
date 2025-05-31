jest.mock("../../controllers/auth.controller", () => {
  return {
    AuthController: jest.fn().mockImplementation(() => ({
      login: (req: express.Request, res: express.Response) => {
        return res.status(200).json({ token: "mocked-token" });
      }
    }))
  };
});

import express from "express";
import request from "supertest";
import { errorMiddleware } from "../../middlewares/error.middleware";
import authRouter from "../../routes/auth.route";

describe("Auth Router", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/auth", authRouter);
    app.use(errorMiddleware);
  });

  it("should login successfully with valid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "user@example.com",
      password: "Password1"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token", "mocked-token");
  });

  it("should return 400 validation error with invalid email", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "invalid-email",
      password: "Password1"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
    expect(res.body.error.details).toBeDefined();
    expect(Array.isArray(res.body.error.details.details)).toBe(true);
  });

  it("should return 400 validation error with short password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "user@example.com",
      password: "123"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.message).toBe("Validation error");
    expect(res.body.error.details).toBeDefined();
    expect(Array.isArray(res.body.error.details.details)).toBe(true);
  });
});
