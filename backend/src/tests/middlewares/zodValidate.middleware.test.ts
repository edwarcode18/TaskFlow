import { z } from "zod";
import { zodValidate } from "../../middlewares/zodValidate.middleware";
import * as Boom from "@hapi/boom";

const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query
});

describe("zodValidate middleware", () => {
  const schema = z.object({
    body: z.object({
      name: z.string(),
      age: z.number().min(18)
    }),
    params: z.object({}),
    query: z.object({})
  });

  const middleware = zodValidate(schema);

  const res = {} as any;
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
  });

  it("should call next with no error for valid data", () => {
    const req = mockRequest({ name: "John", age: 30 });

    middleware(req as any, res, next);

    expect(next).toHaveBeenCalledWith(); // sin errores
  });

  it("should call next with Boom error for invalid data", () => {
    const req = mockRequest({ name: "John", age: 15 });

    middleware(req as any, res, next);

    const errorArg = next.mock.calls[0][0];

    expect(errorArg).toBeInstanceOf(Error);
    expect((errorArg as Boom.Boom).isBoom).toBe(true);
    expect((errorArg as Boom.Boom).output.statusCode).toBe(400);

    const data = (errorArg as Boom.Boom).data;
    expect(data).toBeDefined();
    expect(data).toHaveProperty("details");
    expect(Array.isArray(data.details)).toBe(true);
  });

  it("should call next with Boom internal error if unexpected error occurs", () => {
    const brokenSchema = {
      parse: () => {
        throw new Error("Unexpected");
      }
    } as any;

    const mw = zodValidate(brokenSchema);
    const req = mockRequest();

    mw(req as any, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        isBoom: true,
        output: expect.objectContaining({
          statusCode: 500
        }),
        message: "Validation failed"
      })
    );
  });
});
