import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { UserProjectController } from "../../controllers/userProject.controller";
import { UserProjectService } from "../../services/userProject.service";

jest.mock("../../services/userProject.service");

describe("UserProjectController", () => {
  const controller = new UserProjectController();
  const mockService = UserProjectService as jest.MockedClass<
    typeof UserProjectService
  >;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserProject = {
    _id: "userProjectId123",
    userId: "userId123",
    projectId: "projectId123"
  };

  describe("getAllUserProject", () => {
    it("should return all user project", async () => {
      (
        mockService.prototype.findAllUserProjects as jest.Mock
      ).mockResolvedValue([mockUserProject]);

      await controller.getAllUserProjects({} as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockUserProject]);
    });

    it("should call next on error", async () => {
      const error = new Error("DB error");
      (
        mockService.prototype.findAllUserProjects as jest.Mock
      ).mockRejectedValue(error);

      await controller.getAllUserProjects({} as Request, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserProjectById", () => {
    const req = {
      params: { id: "userProjectId123" }
    } as unknown as Request<{ id: string }>;
    it("should return a user project by id", async () => {
      (
        mockService.prototype.findUserProjectById as jest.Mock
      ).mockResolvedValue(mockUserProject);

      await controller.getUserProjectById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserProject);
    });

    it("should call next on error", async () => {
      const error = new Error("Not found");
      (
        mockService.prototype.findUserProjectById as jest.Mock
      ).mockRejectedValue(error);

      await controller.getUserProjectById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createUserProject", () => {
    const req = {
      body: {
        userId: new Types.ObjectId().toHexString(),
        projectId: new Types.ObjectId().toHexString()
      }
    } as unknown as Request;

    it("should create a new user project", async () => {
      (mockService.prototype.createUserProject as jest.Mock).mockResolvedValue(
        mockUserProject
      );

      await controller.createUserProject(req, res, next);

      expect(mockService.prototype.createUserProject).toHaveBeenCalledWith({
        userId: expect.any(Types.ObjectId),
        projectId: expect.any(Types.ObjectId)
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUserProject);
    });

    it("should call next on error", async () => {
      const error = new Error("Create error");
      (mockService.prototype.createUserProject as jest.Mock).mockRejectedValue(
        error
      );

      await controller.createUserProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUserProject", () => {
    const req = {
      params: { id: "userProjectId123" },
      body: {
        userId: new Types.ObjectId().toHexString(),
        projectId: new Types.ObjectId().toHexString()
      }
    } as unknown as Request<{ id: string }>;

    it("should update a user project", async () => {
      (mockService.prototype.updateUserProject as jest.Mock).mockResolvedValue(
        mockUserProject
      );

      await controller.updateUserProject(req, res, next);

      expect(mockService.prototype.updateUserProject).toHaveBeenCalledWith(
        "userProjectId123",
        expect.objectContaining({
          userId: expect.any(Types.ObjectId),
          projectId: expect.any(Types.ObjectId)
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserProject);
    });

    it("should call next on error", async () => {
      const error = new Error("Update error");
      (mockService.prototype.updateUserProject as jest.Mock).mockRejectedValue(
        error
      );

      await controller.updateUserProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteUserProject", () => {
    const req = {
      params: { id: "userProjectId123" }
    } as unknown as Request<{ id: string }>;

    it("should delete a user project", async () => {
      (mockService.prototype.deleteUserProject as jest.Mock).mockResolvedValue(
        undefined
      );

      await controller.deleteUserProject(req, res, next);

      expect(mockService.prototype.deleteUserProject).toHaveBeenCalledWith(
        "userProjectId123"
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should call next on error", async () => {
      const error = new Error("Delete error");
      (mockService.prototype.deleteUserProject as jest.Mock).mockRejectedValue(
        error
      );

      await controller.deleteUserProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
