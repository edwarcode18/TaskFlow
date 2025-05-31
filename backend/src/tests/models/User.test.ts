import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../../models/User";
import bcrypt from "bcryptjs";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    dbName: "test"
  });
  await User.syncIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (db) await db.dropDatabase();
  await User.syncIndexes();
});

describe("User Model", () => {
  it("should create and save a valid user with hashed password", async () => {
    const plainPassword = "Strong123";
    const user = new User({
      name: "edward",
      email: "edward@example.com",
      password: plainPassword
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe("edward");
    expect(savedUser.email).toBe("edward@example.com");
    expect(savedUser.password).not.toBe(plainPassword);
    const isMatch = await bcrypt.compare(plainPassword, savedUser.password);
    expect(isMatch).toBe(true);
  });

  it("should not include password in toJSON output", async () => {
    const user = new User({
      name: "noPassUser",
      email: "noPass@example.com",
      password: "Valid123"
    });

    const saved = await user.save();
    const json = saved.toJSON();

    expect(json.password).toBeUndefined();
  });

  it("should fail with invalid email", async () => {
    const user = new User({
      name: "bademail",
      email: "invalid-email",
      password: "Valid123"
    });

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should fail if password is weak (fails custom validator)", async () => {
    const user = new User({
      name: "weakpass",
      email: "weakpass@example.com",
      password: "abcdef"
    });

    let err: unknown;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    if (err instanceof mongoose.Error.ValidationError) {
      expect(err.errors.password).toBeDefined();
      expect(err.errors.password.message).toMatch(/La contraseña no cumple/);
    }
  });

  it("should fail if name is too short", async () => {
    const user = new User({
      name: "Ed",
      email: "ed@example.com",
      password: "Valid123"
    });

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should fail if email is not unique", async () => {
    const user1 = new User({
      name: "UserOne",
      email: "duplicate@example.com",
      password: "Valid123"
    });

    const user2 = new User({
      name: "UserTwo",
      email: "duplicate@example.com",
      password: "Valid123"
    });

    await user1.save();

    let err: unknown;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();

    if (err && typeof err === "object" && "code" in err) {
      expect((err as any).code).toBe(11000);
    }
  });

  it("should skip hashing if password is not modified", async () => {
    const user = new User({
      name: "skipHash",
      email: "skip@example.com",
      password: "Valid123"
    });

    await user.save();

    // Vuelve a guardar sin modificar password
    const originalHash = user.password;
    user.name = "skipHashUpdated";
    await user.save();

    expect(user.password).toBe(originalHash);
  });

  it("should handle error during password hashing", async () => {
    (jest.spyOn(bcrypt, "genSalt") as jest.Mock).mockRejectedValue(
      new Error("Salt error")
    );

    const user = new User({
      name: "errorhash",
      email: "errorhash@example.com",
      password: "Valid123"
    });

    await expect(user.save()).rejects.toThrow("Password hashing failed");

    (bcrypt.genSalt as jest.Mock).mockRestore?.();
  });
});
