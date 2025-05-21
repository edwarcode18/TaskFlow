import * as Boom from "@hapi/boom";
import { UserProject } from "../../models/UserProject";
import { UserProjectService } from "../../services/userProject.service";
import { IUserProject } from "../../interfaces/userProject.interface";

jest.mock("../../models/UserProject.ts");
const mockedUserProject = UserProject as jest.Mocked<typeof UserProject>;

const mockQuery = (result: any) =>
  ({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result)
  } as any);

describe("UserProjectService", () => {
  const service = new UserProjectService();
  afterEach(() => jest.clearAllMocks());

  describe("findAllUserProjects", () => {
    it("should return user projects", async () => {
      const userProjects = [
        { _id: "1", userId: "1", projectId: "1" },
        { _id: "2", userId: "1", projectId: "2" }
      ];
      mockedUserProject.find.mockReturnValue(mockQuery(userProjects));
      const result = await service.findAllUserProjects();
      expect(result).toEqual(userProjects);
      expect(mockedUserProject.find).toHaveBeenCalled();
    });

    it("should return empty array if no user projects", async () => {
      mockedUserProject.find.mockReturnValue(mockQuery([]));
      const result = await service.findAllUserProjects();
      expect(result).toEqual([]);
    });
  });

  describe("findUserProjectById", () => {
    const userProject = {
      _id: "1",
      userId: "1",
      projectId: "1",
      toObject: () => ({ _id: "1", userId: "1", projectId: "1" })
    };

    it("should return a user project object", async () => {
      mockedUserProject.findById.mockResolvedValue(userProject);
      const result = await service.findUserProjectById("1");
      expect(result).toEqual({
        _id: "1",
        userId: "1",
        projectId: "1"
      });
    });

    it("should throw not Found error if user project not found", async () => {
      mockedUserProject.findById.mockResolvedValue(null);
      await expect(service.findUserProjectById("999")).rejects.toThrow(
        Boom.notFound("UserProject not found")
      );
    });

    it("should throw error for invalid id", async () => {
      await expect(service.findUserProjectById("bad_id")).rejects.toThrow();
    });
  });

  describe("createUserProject", () => {
    const userProjectData = {
      userId: "1",
      projectId: "1"
    };
    const createdUserProject = {
      _id: "1",
      ...userProjectData,
      toObject: () => ({ _id: "1", ...userProjectData })
    };

    it("should create a user project", async () => {
      mockedUserProject.create.mockResolvedValue(createdUserProject as any);
      const result = await service.createUserProject(userProjectData as any);
      expect(result).toEqual({
        _id: "1",
        ...userProjectData
      });
    });
  });

  describe("updateUserProject", () => {
    const update: Partial<IUserProject> = {
      roleInProject: "owner"
    };
    const updatedUserProject = {
      _id: "1",
      ...update,
      userId: "1",
      projectId: "1",
      toObject: jest.fn().mockReturnValue({
        _id: "1",
        ...update,
        userId: "1",
        projectId: "1"
      })
    };

    it("should update a user project successfully", async () => {
      mockedUserProject.findByIdAndUpdate.mockReturnValue(
        updatedUserProject as any
      );
      const result = await service.updateUserProject("1", update);
      expect(result).toEqual({
        _id: "1",
        ...update,
        userId: "1",
        projectId: "1"
      });
    });

    it("should throw not Found error if user project not found", async () => {
      mockedUserProject.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.updateUserProject("999", update)).rejects.toThrow(
        Boom.notFound("User Project not found")
      );
    });
  });

  describe("deleteUserProject", () => {
    it("should delete a user project", async () => {
      mockedUserProject.findByIdAndDelete.mockResolvedValue({ _id: "1" });
      await service.deleteUserProject("1");
      expect(mockedUserProject.findByIdAndDelete).toHaveBeenCalledWith("1");
    });

    it("should throw not Found error if user project not found", async () => {
      mockedUserProject.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.deleteUserProject("999")).rejects.toThrow(
        Boom.notFound("User Project not found")
      );
    });
  });
});
