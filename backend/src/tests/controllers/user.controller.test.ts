import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { UserController } from "../../controllers/user.controller";
import { UserService } from "../../services/user.service";

jest.mock("../../services/user.service");

describe("UserController", () => {
  const controller = new UserController();
  const mockService = UserService as jest.MockedClass<typeof UserService>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    _id: "userId123",
    email: "a",
    name: "b"
  };

  describe("getAllUser", () => {
    it("should return all users", async () => {
      (mockService.prototype.findAllUsers as jest.Mock).mockResolvedValue([
        mockUser
      ]);

      await controller.getAllUsers({} as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockUser]);
    });

    it("should call next on error", async () => {
      const error = new Error("DB error");
      (mockService.prototype.findAllUsers as jest.Mock).mockRejectedValue(
        error
      );

      await controller.getAllUsers({} as Request, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserById", () => {
    const req = {
      params: { id: "userId123" }
    } as unknown as Request<{ id: string }>;
    it("should return a user by id", async () => {
      (mockService.prototype.findUserById as jest.Mock).mockResolvedValue(
        mockUser
      );

      await controller.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next on error", async () => {
      const error = new Error("Not found");
      (mockService.prototype.findUserById as jest.Mock).mockRejectedValue(
        error
      );

      await controller.getUserById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserByEmail", () => {
    const req = {
      params: { email: "a" }
    } as unknown as Request<{ email: string }>;

    it("shouldReturn a user by email", async () => {
      (mockService.prototype.findUserByEmail as jest.Mock).mockResolvedValue(
        mockUser
      );

      await controller.getUserByEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next on error", async () => {
      const error = new Error("Not found");
      (mockService.prototype.findUserByEmail as jest.Mock).mockRejectedValue(
        error
      );

      await controller.getUserByEmail(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createUser", () => {
    const req = {
      body: {
        email: "a",
        name: "New User"
      }
    } as unknown as Request;

    it("should create a new user", async () => {
      (mockService.prototype.createUser as jest.Mock).mockResolvedValue(
        mockUser
      );

      await controller.createUser(req, res, next);

      expect(mockService.prototype.createUser).toHaveBeenCalledWith({
        email: "a",
        name: "New User"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next on error", async () => {
      const error = new Error("Create error");
      (mockService.prototype.createUser as jest.Mock).mockRejectedValue(error);

      await controller.createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUser", () => {
    const req = {
      params: { id: "userId123" },
      body: {
        email: "a",
        name: "Updated User"
      }
    } as unknown as Request<{ id: string }>;

    it("should update a user", async () => {
      (mockService.prototype.updateUser as jest.Mock).mockResolvedValue(
        mockUser
      );

      await controller.updateUser(req, res, next);

      expect(mockService.prototype.updateUser).toHaveBeenCalledWith(
        "userId123",
        expect.objectContaining({
          email: "a",
          name: "Updated User"
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next on error", async () => {
      const error = new Error("Update error");
      (mockService.prototype.updateUser as jest.Mock).mockRejectedValue(error);

      await controller.updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteUser", () => {
    const req = {
      params: { id: "userId123" }
    } as unknown as Request<{ id: string }>;

    it("should delete a user", async () => {
      (mockService.prototype.deleteUser as jest.Mock).mockResolvedValue(
        undefined
      );

      await controller.deleteUser(req, res, next);

      expect(mockService.prototype.deleteUser).toHaveBeenCalledWith(
        "userId123"
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should call next on error", async () => {
      const error = new Error("Delete error");
      (mockService.prototype.deleteUser as jest.Mock).mockRejectedValue(error);

      await controller.deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
