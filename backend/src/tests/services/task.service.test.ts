import * as Boom from "@hapi/boom";
import { Task } from "../../models/Task";
import { TaskService } from "../../services/task.service";

jest.mock("../../models/Task");
const mockedTask = Task as jest.Mocked<typeof Task>;

const mockQuery = (result: any) =>
  ({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result)
  } as any);

describe("TaskService", () => {
  const service = new TaskService();

  afterEach(() => jest.clearAllMocks());

  describe("findAllTasks", () => {
    it("should return tasks", async () => {
      const tasks = [
        { _id: "1", assignee: "1", projectId: "1" },
        { _id: "2", assignee: "1", projectId: "1" }
      ];
      mockedTask.find.mockReturnValue(mockQuery(tasks));
      const result = await service.findAllTasks();
      expect(result).toEqual(tasks);
      expect(mockedTask.find).toHaveBeenCalled();
    });

    it("should return empty array if no tasks", async () => {
      mockedTask.find.mockReturnValue(mockQuery([]));
      const result = await service.findAllTasks();
      expect(result).toEqual([]);
    });
  });

  describe("findTaskById", () => {
    const task = {
      _id: "1",
      assignee: "1",
      projectId: "1",
      toObject: () => ({ _id: "1", assignee: "1", projectId: "1" })
    };

    it("should return a task object", async () => {
      mockedTask.findById.mockResolvedValue(task);
      const result = await service.findTaskById("1");
      expect(result).toEqual({
        _id: "1",
        assignee: "1",
        projectId: "1"
      });
    });

    it("should throw not Found error if task not found", async () => {
      mockedTask.findById.mockResolvedValue(null);
      await expect(service.findTaskById("999")).rejects.toThrow(
        Boom.notFound("Task not found")
      );
    });

    it("should throw error for invalid id", async () => {
      await expect(service.findTaskById("bad_id")).rejects.toThrow();
    });
  });

  describe("createTask", () => {
    const taskData = {
      title: "Test Task",
      description: "Test",
      assignee: "1",
      projectId: "1"
    };
    const createdTask = {
      _id: "1",
      ...taskData,
      toObject: () => ({ _id: "1", ...taskData })
    };

    it("should create a task", async () => {
      mockedTask.create.mockResolvedValue(createdTask as any);
      const result = await service.createTask(taskData as any);
      expect(result).toEqual({
        _id: "1",
        ...taskData
      });
    });
  });

  describe("updateTask", () => {
    const update = { title: "Updated" };
    const updatedTask = {
      _id: "1",
      ...update,
      assignee: "1",
      projectId: "1",
      toObject: jest.fn().mockReturnValue({
        _id: "1",
        ...update,
        assignee: "1",
        projectId: "1"
      })
    };

    it("should update a task successfully", async () => {
      mockedTask.findByIdAndUpdate.mockReturnValue(updatedTask as any);
      const result = await service.updateTask("1", update);
      expect(result).toEqual({
        _id: "1",
        ...update,
        assignee: "1",
        projectId: "1"
      });
    });

    it("should throw not Found error if task not found", async () => {
      mockedTask.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.updateTask("999", update)).rejects.toThrow(
        Boom.notFound("Task not found")
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      mockedTask.findByIdAndDelete.mockResolvedValue({ _id: "1" });
      await service.deleteTask("1");
      expect(mockedTask.findByIdAndDelete).toHaveBeenCalledWith("1");
    });

    it("should throw not Found error if task not found", async () => {
      mockedTask.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.deleteTask("999")).rejects.toThrow(
        Boom.notFound("Task not found")
      );
    });
  });
});
