import * as Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

jest.mock("jsonwebtoken");

describe("auth.middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should call next with user when token is valid", () => {
      const mockDecoded = { id: "1", email: "test@example.com", role: "admin" };
      req.headers.authorization = "Bearer valid.token";

      (jwt.verify as jest.Mock).mockImplementation((_token, _secret, callback) => {
        callback(null, mockDecoded);
      });

      authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        "valid.token",
        process.env.JWT_SECRET!,
        expect.any(Function)
      );
      expect(req.user).toEqual(mockDecoded);
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next with Boom.unauthorized when token is missing", () => {
      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Boom.Boom));
      expect((next.mock.calls[0][0] as Boom.Boom).output.statusCode).toBe(401);
    });

    it("should call next with Boom.unauthorized when token is invalid", () => {
      req.headers.authorization = "Bearer invalid.token";

      (jwt.verify as jest.Mock).mockImplementation((_token, _secret, callback) => {
        callback(new Error("Invalid token"), undefined);
      });

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Boom.Boom));
      expect((next.mock.calls[0][0] as Boom.Boom).output.statusCode).toBe(401);
    });
  });

  describe("authorize", () => {
    it("should call next if user has valid role", () => {
      const middleware = authorize(["admin", "editor"]);

      req.user = { role: "admin" };

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should call next with Boom.forbidden if user role is not allowed", () => {
      const middleware = authorize(["admin"]);

      req.user = { role: "guest" };

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Boom.Boom));
      expect((next.mock.calls[0][0] as Boom.Boom).output.statusCode).toBe(403);
    });

    it("should call next with Boom.forbidden if user is undefined", () => {
      const middleware = authorize(["admin"]);

      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Boom.Boom));
      expect((next.mock.calls[0][0] as Boom.Boom).output.statusCode).toBe(403);
    });
  });
});
