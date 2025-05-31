import mongoose, { Types } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Project } from "../../models/Project";

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

describe("Project Model", () => {
  it("should create and save a project successfully", async () => {
    const validProject = new Project({
      name: "My Project",
      description: "A project description",
      owner: new Types.ObjectId()
    });

    const savedProject = await validProject.save();

    expect(savedProject._id).toBeDefined();
    expect(savedProject.name).toBe("My Project");
    expect(savedProject.description).toBe("A project description");
    expect(savedProject.owner).toBeInstanceOf(Types.ObjectId);
  });

  it("should fail if required fields are missing", async () => {
    const invalidProject = new Project({});

    let err: unknown;
    try {
      await invalidProject.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    if (err instanceof mongoose.Error.ValidationError) {
      expect(err.errors.name).toBeDefined();
      expect(err.errors.description).toBeDefined();
      expect(err.errors.owner).toBeDefined();
    }
  });

  it("should fail if name is too short", async () => {
    const project = new Project({
      name: "ab",
      description: "Valid desc",
      owner: new Types.ObjectId()
    });

    await expect(project.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  it("should fail if description is too short", async () => {
    const project = new Project({
      name: "Valid name",
      description: "1234",
      owner: new Types.ObjectId()
    });

    await expect(project.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });
});
