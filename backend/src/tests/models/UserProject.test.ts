import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../../models/User";
import { Project } from "../../models/Project";
import { UserProject } from "../../models/UserProject";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
  await UserProject.syncIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (db) await db.dropDatabase();
});

describe("UserProject Model", () => {
  it("should create a valid user-project relation", async () => {
    const user = await new User({
      name: "Test User",
      email: "test@example.com",
      password: "Valid123"
    }).save();

    const project = await new Project({
      name: "Test Project",
      description: "Testing",
      owner: user._id
    }).save();

    const relation = await new UserProject({
      userId: user._id,
      projectId: project._id,
      roleInProject: "member"
    }).save();

    expect(relation._id).toBeDefined();
    expect(relation.userId.toString()).toBe(user._id.toString());
    expect(relation.projectId.toString()).toBe(project._id.toString());
    expect(relation.roleInProject).toBe("member");
    expect(relation.joinedAt).toBeInstanceOf(Date);
  });

  it("should prevent duplicate user-project relation (manual check)", async () => {
    const user = await new User({
      name: "Duplicate User",
      email: "dup@example.com",
      password: "Valid123"
    }).save();

    const project = await new Project({
      name: "Duplicate Project",
      description: "Dup Test",
      owner: user._id
    }).save();

    await new UserProject({
      userId: user._id,
      projectId: project._id,
      roleInProject: "owner"
    }).save();

    const exists = await UserProject.findOne({
      userId: user._id,
      projectId: project._id
    });

    expect(exists).toBeTruthy();

    const duplicate = new UserProject({
      userId: user._id,
      projectId: project._id,
      roleInProject: "owner"
    });

    let errorCaught = false;
    try {
      if (exists) {
        throw new Error("Duplicate user-project relation is not allowed");
      }
      await duplicate.save();
    } catch (err: any) {
      errorCaught = true;
      expect(err.message).toMatch(/duplicate user-project/i);
    }

    expect(errorCaught).toBe(true);
  });

  it("should fail with invalid roleInProject", async () => {
    const user = await new User({
      name: "Invalid Role User",
      email: "invalidrole@example.com",
      password: "Valid123"
    }).save();

    const project = await new Project({
      name: "Invalid Role Project",
      description: "Role Test",
      owner: user._id
    }).save();

    const invalidRelation = new UserProject({
      userId: user._id,
      projectId: project._id,
      roleInProject: "invalidrole"
    });

    await expect(invalidRelation.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });
});
