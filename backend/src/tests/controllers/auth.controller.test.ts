import * as Boom from "@hapi/boom";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthController } from "../../../src/controllers/auth.controller";
import { UserService } from "../../../src/services/user.service";

jest.mock("../../../src/services/user.service");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  const authController = new AuthController();
  const mockedUserService = UserService as jest.MockedClass<typeof UserService>;

  const mockUser = {
    _id: "123",
    email: "test@example.com",
    password: "hashedPassword",
    name: "Test User",
    role: "admin"
  };

  const req = {
    body: {
      email: mockUser.email,
      password: "plaintextPassword"
    }
  } as unknown as Request;

  const res = {
    json: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  it("should login successfully and return a token and user info", async () => {
    (
      mockedUserService.prototype.findUserByEmailWithPassword as jest.Mock
    ).mockResolvedValue(mockUser);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

    await authController.login(req, res, next);

    expect(
      mockedUserService.prototype.findUserByEmailWithPassword
    ).toHaveBeenCalledWith(mockUser.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "plaintextPassword",
      mockUser.password
    );
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: "mockedToken",
      user: {
        _id: mockUser._id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      }
    });
  });

  it("should throw unauthorized error if user not found", async () => {
    (
      mockedUserService.prototype.findUserByEmailWithPassword as jest.Mock
    ).mockResolvedValue(null);

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      Boom.unauthorized("Credenciales inválidas")
    );
  });

  it("should throw unauthorized error if password is invalid", async () => {
    (
      mockedUserService.prototype.findUserByEmailWithPassword as jest.Mock
    ).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      Boom.unauthorized("Credenciales inválidas")
    );
  });

  it("should throw error if JWT_SECRET is not defined", async () => {
    delete process.env.JWT_SECRET;

    (
      mockedUserService.prototype.findUserByEmailWithPassword as jest.Mock
    ).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new Error("JWT_SECRET is not defined in environment variables")
    );
  });

  it("should use default expiresIn if JWT_EXPIRES_IN is not defined", async () => {
    delete process.env.JWT_EXPIRES_IN;

    (
      mockedUserService.prototype.findUserByEmailWithPassword as jest.Mock
    ).mockResolvedValue(mockUser);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

    await authController.login(req, res, next);

    expect(jwt.sign).toHaveBeenCalledWith(
      expect.any(Object),
      process.env.JWT_SECRET,
      expect.objectContaining({ expiresIn: "1h" })
    );
  });

  it("should call next with unexpected errors", async () => {
    const error = new Error("Unexpected");
    (
      mockedUserService.prototype.findUserByEmailWithPassword as jest.Mock
    ).mockRejectedValue(error);

    await authController.login(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
