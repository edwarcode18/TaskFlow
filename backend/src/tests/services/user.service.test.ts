import * as Boom from "@hapi/boom";
import { IUser } from "../../../src/interfaces/user.interface";
import { User } from "../../../src/models/User";
import { UserService } from "../../../src/services/user.service";

jest.mock("../../../src/models/User");
const mockedUser = User as jest.Mocked<typeof User>;

const mockQuery = (result: any) =>
  ({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result)
  } as any);

describe("UserService", () => {
  const service = new UserService();

  afterEach(() => jest.clearAllMocks());

  describe("findAllUsers", () => {
    it("should return users without password", async () => {
      const users = [{ _id: "1" }, { _id: "2" }];
      mockedUser.find.mockReturnValue(mockQuery(users));

      const result = await service.findAllUsers();

      expect(result).toEqual(users);
      expect(mockedUser.find).toHaveBeenCalled();
      expect(mockedUser.find().select).toHaveBeenCalledWith("-password");
    });

    it("should return empty array if no users", async () => {
      mockedUser.find.mockReturnValue(mockQuery([]));
      const result = await service.findAllUsers();
      expect(result).toEqual([]);
    });
  });

  describe("findUserById", () => {
    const user = { _id: "1", toObject: () => ({ _id: "1" }) };

    it("should return a user object", async () => {
      mockedUser.findById.mockReturnValue(mockQuery(user));
      const result = await service.findUserById("1");
      expect(result).toEqual(user);
    });

    it("should throw notFound error if user not found", async () => {
      mockedUser.findById.mockReturnValue(mockQuery(null));
      await expect(service.findUserById("999")).rejects.toThrow(
        Boom.notFound("User not found")
      );
    });

    it("should throw error for invalid id", async () => {
      await expect(service.findUserById("bad_id")).rejects.toThrow();
    });
  });

  describe("findUserByEmail", () => {
    const user = { _id: "1", email: "a", toObject: () => ({ _id: "1" }) };

    it("should return user by email", async () => {
      mockedUser.findOne.mockReturnValue(mockQuery(user.toObject()));
      const result = await service.findUserByEmail("a");
      expect(result).toEqual(user.toObject());
    });

    it("should throw notFound if no user found", async () => {
      mockedUser.findOne.mockReturnValue(mockQuery(null));
      await expect(service.findUserByEmail("no")).rejects.toThrow(
        Boom.notFound("User not found")
      );
    });

    it("should throw error for empty email", async () => {
      await expect(service.findUserByEmail("")).rejects.toThrow();
    });
  });

  describe("createUser", () => {
    const userData: IUser = { email: "a", name: "b", password: "c" };
    const createdUser = {
      _id: "1",
      email: "a",
      toObject: () => ({ _id: "1", email: "a" })
    };

    it("should throw conflict if email exists", async () => {
      mockedUser.findOne.mockResolvedValueOnce({ email: "a" });
      await expect(service.createUser(userData)).rejects.toThrow(
        Boom.conflict("Email already in use")
      );
    });

    it("should throw conflict if name exists", async () => {
      mockedUser.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ name: "b" });
      await expect(service.createUser(userData)).rejects.toThrow(
        Boom.conflict("Name already in use")
      );
    });

    it("should create a new user", async () => {
      mockedUser.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockedUser.create.mockResolvedValue(createdUser as any);
      const result = await service.createUser(userData);
      expect(result).toEqual(createdUser.toObject());
    });
  });

  describe("updateUser", () => {
    const update = { name: "Updated" };
    const updatedUser = {
      _id: "1",
      ...update,
      toObject: () => ({ _id: "1", ...update })
    };

    it("should update user successfully", async () => {
      mockedUser.findByIdAndUpdate.mockReturnValue(
        mockQuery(updatedUser.toObject())
      );
      const result = await service.updateUser("1", update);
      expect(result).toEqual(updatedUser.toObject());
    });

    it("should throw notFound if user does not exist", async () => {
      mockedUser.findByIdAndUpdate.mockReturnValue(mockQuery(null));
      await expect(service.updateUser("1", update)).rejects.toThrow(
        Boom.notFound("User not found")
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      mockedUser.findByIdAndDelete.mockResolvedValue({ _id: "1" });
      await service.deleteUser("1");
      expect(mockedUser.findByIdAndDelete).toHaveBeenCalledWith("1");
    });

    it("should throw notFound if user missing", async () => {
      mockedUser.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.deleteUser("999")).rejects.toThrow(
        Boom.notFound("User not found")
      );
    });
  });

  describe("findUserByEmailWithPassword", () => {
    it("should return user with password", async () => {
      const user = { _id: "1", email: "a", password: "secret" };
      mockedUser.findOne.mockReturnValue(mockQuery(user));
      const result = await service.findUserByEmailWithPassword("a");
      expect(result).toEqual(user);
    });

    it("should return null if not found", async () => {
      mockedUser.findOne.mockReturnValue(mockQuery(null));
      const result = await service.findUserByEmailWithPassword("no");
      expect(result).toBeNull();
    });
  });
});
