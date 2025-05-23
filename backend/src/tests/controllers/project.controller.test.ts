import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { ProjectController } from "../../../src/controllers/project.controller";
import { ProjectService } from "../../../src/services/project.service";

jest.mock("../../../src/services/project.service");

describe("ProjectController", () => {
  const controller = new ProjectController();
  const mockService = ProjectService as jest.MockedClass<typeof ProjectService>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProject = {
    _id: "projectId123",
    name: "Test Project",
    owner: "ownerId123"
  };

  describe("getAllProjects", () => {
    it("should return all projects", async () => {
      (mockService.prototype.findAllProjects as jest.Mock).mockResolvedValue([
        mockProject
      ]);

      await controller.getAllProjects({} as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockProject]);
    });

    it("should call next on error", async () => {
      const error = new Error("DB error");
      (mockService.prototype.findAllProjects as jest.Mock).mockRejectedValue(
        error
      );

      await controller.getAllProjects({} as Request, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getProjectById", () => {
    const req = {
      params: { id: "projectId123" }
    } as unknown as Request<{ id: string }>;

    it("should return a project by id", async () => {
      (mockService.prototype.findProjectById as jest.Mock).mockResolvedValue(
        mockProject
      );

      await controller.getProjectById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it("should call next on error", async () => {
      const error = new Error("Not found");
      (mockService.prototype.findProjectById as jest.Mock).mockRejectedValue(
        error
      );

      await controller.getProjectById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createProject", () => {
    const req = {
      body: {
        name: "New Project",
        owner: new Types.ObjectId().toHexString()
      }
    } as unknown as Request;

    it("should create a new project", async () => {
      (mockService.prototype.createProject as jest.Mock).mockResolvedValue(
        mockProject
      );

      await controller.createProject(req, res, next);

      expect(mockService.prototype.createProject).toHaveBeenCalledWith({
        name: "New Project",
        owner: expect.any(Types.ObjectId)
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it("should call next on error", async () => {
      const error = new Error("Create error");
      (mockService.prototype.createProject as jest.Mock).mockRejectedValue(
        error
      );

      await controller.createProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateProject", () => {
    const req = {
      params: { id: "projectId123" },
      body: {
        name: "Updated Project",
        owner: new Types.ObjectId().toHexString()
      }
    } as unknown as Request<{ id: string }>;

    it("should update a project", async () => {
      (mockService.prototype.updateProject as jest.Mock).mockResolvedValue(
        mockProject
      );

      await controller.updateProject(req, res, next);

      expect(mockService.prototype.updateProject).toHaveBeenCalledWith(
        "projectId123",
        expect.objectContaining({
          name: "Updated Project",
          owner: expect.any(Types.ObjectId)
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it("should call next on error", async () => {
      const error = new Error("Update error");
      (mockService.prototype.updateProject as jest.Mock).mockRejectedValue(
        error
      );

      await controller.updateProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteProject", () => {
    const req = {
      params: { id: "projectId123" }
    } as unknown as Request<{ id: string }>;

    it("should delete a project", async () => {
      (mockService.prototype.deleteProject as jest.Mock).mockResolvedValue(
        undefined
      );

      await controller.deleteProject(req, res, next);

      expect(mockService.prototype.deleteProject).toHaveBeenCalledWith(
        "projectId123"
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should call next on error", async () => {
      const error = new Error("Delete error");
      (mockService.prototype.deleteProject as jest.Mock).mockRejectedValue(
        error
      );

      await controller.deleteProject(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
