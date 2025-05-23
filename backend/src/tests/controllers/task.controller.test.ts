import { NextFunction, Request, Response } from "express";
import { TaskController } from "../../controllers/task.controller";
import { TaskService } from "../../services/task.service";
import { Types } from "mongoose";

jest.mock("../../services/task.service");

describe("TaskController", () => {
  const controller = new TaskController();
  const mockService = TaskService as jest.MockedClass<typeof TaskService>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTask = {
    _id: "taskId123",
    title: "Test Task",
    assignee: "assigneeId123",
    projectId: "projectId123"
  };

  describe("getAllTask", () => {
    it("should return all tasks", async () => {
      (mockService.prototype.findAllTasks as jest.Mock).mockResolvedValue([
        mockTask
      ]);

      await controller.getAllTask({} as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockTask]);
    });

    it("should call next on error", async () => {
      const error = new Error("DB error");
      (mockService.prototype.findAllTasks as jest.Mock).mockRejectedValue(
        error
      );

      await controller.getAllTask({} as Request, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getTaskById", () => {
    const req = {
      params: { id: "taskId123" }
    } as unknown as Request<{ id: string }>;
    it("should return a task by id", async () => {
      (mockService.prototype.findTaskById as jest.Mock).mockResolvedValue(
        mockTask
      );

      await controller.getTasksById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should call next on error", async () => {
      const error = new Error("Not found");
      (mockService.prototype.findTaskById as jest.Mock).mockRejectedValue(
        error
      );

      await controller.getTasksById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createTask", () => {
    const req = {
      body: {
        title: "New Task",
        assignee: new Types.ObjectId().toHexString(),
        projectId: new Types.ObjectId().toHexString()
      }
    } as unknown as Request;

    it("should create a new task", async () => {
      (mockService.prototype.createTask as jest.Mock).mockResolvedValue(
        mockTask
      );

      await controller.createTask(req, res, next);

      expect(mockService.prototype.createTask).toHaveBeenCalledWith({
        title: "New Task",
        assignee: expect.any(Types.ObjectId),
        projectId: expect.any(Types.ObjectId)
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should call next on error", async () => {
      const error = new Error("Create error");
      (mockService.prototype.createTask as jest.Mock).mockRejectedValue(error);

      await controller.createTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateTask", () => {
    const req = {
      params: { id: "taskId123" },
      body: {
        name: "Updated Task",
        assignee: new Types.ObjectId().toHexString(),
        projectId: new Types.ObjectId().toHexString()
      }
    } as unknown as Request<{ id: string }>;

    it("should update a task", async () => {
      (mockService.prototype.updateTask as jest.Mock).mockResolvedValue(
        mockTask
      );

      await controller.updateTask(req, res, next);

      expect(mockService.prototype.updateTask).toHaveBeenCalledWith(
        "taskId123",
        expect.objectContaining({
          name: "Updated Task",
          assignee: expect.any(Types.ObjectId),
          projectId: expect.any(Types.ObjectId)
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should call next on error", async () => {
      const error = new Error("Update error");
      (mockService.prototype.updateTask as jest.Mock).mockRejectedValue(error);

      await controller.updateTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteTask", () => {
    const req = {
      params: { id: "taskId123" }
    } as unknown as Request<{ id: string }>;

    it("should delete a task", async () => {
      (mockService.prototype.deleteTask as jest.Mock).mockResolvedValue(
        undefined
      );

      await controller.deleteTask(req, res, next);

      expect(mockService.prototype.deleteTask).toHaveBeenCalledWith(
        "taskId123"
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should call next on error", async () => {
      const error = new Error("Delete error");
      (mockService.prototype.deleteTask as jest.Mock).mockRejectedValue(error);

      await controller.deleteTask(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
