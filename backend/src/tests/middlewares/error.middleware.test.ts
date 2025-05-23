import * as Boom from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import { errorMiddleware } from "../../middlewares/error.middleware";

describe("errorMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.NODE_ENV = "test";
  });

  it("should handle Boom errors", () => {
    const boomError = Boom.notFound("Resource not found");

    errorMiddleware(boomError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        ...boomError.output.payload,
        stack: undefined,
        details: undefined
      }
    });
  });

  it("should handle regular errors and convert to Boom", () => {
    const error = new Error("Unexpected failure");

    errorMiddleware(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: expect.objectContaining({
        statusCode: 500,
        error: "Internal Server Error",
        message: "An internal server error occurred",
        stack: undefined,
        details: undefined
      })
    });
  });

  it("should include stack trace in development", () => {
    process.env.NODE_ENV = "development";
    const error = new Error("Dev error");

    errorMiddleware(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          stack: expect.any(String)
        })
      })
    );
  });

  it("should include custom details if provided in Boom error", () => {
    const boomError = Boom.badRequest("Invalid input", { field: "email" });

    errorMiddleware(boomError, req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          details: { field: "email" }
        })
      })
    );
  });
});
