import mongoose, { Types } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Task } from "../../models/Task";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    dbName: "test"
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (db) {
    await db.dropDatabase();
  }
});

describe("Task Model", () => {
  it("should create and save a valid task", async () => {
    const task = new Task({
      title: "Test Task",
      description: "This is a valid task description",
      status: "in-progress",
      priority: "medium",
      dueDate: new Date(Date.now() + 86400000), // mañana
      assignee: new Types.ObjectId(),
      projectId: new Types.ObjectId()
    });

    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe("Test Task");
    expect(savedTask.status).toBe("in-progress");
    expect(savedTask.priority).toBe("medium");
    expect(savedTask.assignee).toBeInstanceOf(Types.ObjectId);
    expect(savedTask.projectId).toBeInstanceOf(Types.ObjectId);
  });

  it("should fail if required fields are missing", async () => {
    const task = new Task({});

    let err: unknown;
    try {
      await task.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    if (err instanceof mongoose.Error.ValidationError) {
      expect(err.errors.title).toBeDefined();
      expect(err.errors.description).toBeDefined();
      expect(err.errors.assignee).toBeDefined();
      expect(err.errors.projectId).toBeDefined();
    }
  });

  it("should fail if title is too short", async () => {
    const task = new Task({
      title: "Hi",
      description: "Valid Description",
      assignee: new Types.ObjectId(),
      projectId: new Types.ObjectId()
    });

    await expect(task.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should fail if description is too short", async () => {
    const task = new Task({
      title: "Valid title",
      description: "1234",
      assignee: new Types.ObjectId(),
      projectId: new Types.ObjectId()
    });

    await expect(task.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should fail if dueDate is in the past", async () => {
    const task = new Task({
      title: "Task with past due date",
      description: "Valid desc",
      dueDate: new Date(Date.now() - 86400000), // ayer
      assignee: new Types.ObjectId(),
      projectId: new Types.ObjectId()
    });

    let err: unknown;
    try {
      await task.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    if (err instanceof mongoose.Error.ValidationError) {
      expect(err.errors.dueDate).toBeDefined();
      expect(err.errors.dueDate.message).toBe(
        "La fecha de vencimiento debe ser futura"
      );
    }
  });
});
