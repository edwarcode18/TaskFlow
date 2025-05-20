import * as Boom from "@hapi/boom";
import { Project } from "../../models/Project";
import { ProjectService } from "../../services/project.service";

jest.mock("../../models/Project");
const mockedProject = Project as jest.Mocked<typeof Project>;

const mockQuery = (result: any) =>
  ({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result)
  } as any);

describe("ProjectService", () => {
  const service = new ProjectService();

  afterEach(() => jest.clearAllMocks());

  describe("findAllProjects", () => {
    it("should return projects", async () => {
      const projects = [
        { _id: "1", owner: "1" },
        { _id: "2", owner: "1" }
      ];
      mockedProject.find.mockReturnValue(mockQuery(projects));

      const result = await service.findAllProjects();

      expect(result).toEqual(projects);
      expect(mockedProject.find).toHaveBeenCalled();
    });

    it("should return empty array if no projects", async () => {
      mockedProject.find.mockReturnValue(mockQuery([]));
      const result = await service.findAllProjects();
      expect(result).toEqual([]);
    });
  });

  describe("findProjectById", () => {
    const project = {
      _id: "1",
      owner: "1",
      toObject: () => ({ _id: "1", owner: "1" })
    };
    it("should return a project object", async () => {
      mockedProject.findById.mockResolvedValue(project);
      const result = await service.findProjectById("1");
      expect(result).toEqual({
        _id: "1",
        owner: "1"
      });
    });

    it("should throw not Found error if project not found", async () => {
      mockedProject.findById.mockResolvedValue(null);
      await expect(service.findProjectById("999")).rejects.toThrow(
        Boom.notFound("Project not found")
      );
    });

    it("should throw error for invalid id", async () => {
      await expect(service.findProjectById("bad_id")).rejects.toThrow();
    });
  });

  describe("createProject", () => {
    const projectData = {
      name: "Test Project",
      description: "Test",
      owner: "1"
    };
    const createdProject = {
      _id: "1",
      ...projectData,
      toObject: () => ({ _id: "1", ...projectData })
    };

    it("should throw conflict error if name already exists", async () => {
      mockedProject.findOne.mockResolvedValue({ name: "Test Project" });
      await expect(service.createProject(projectData as any)).rejects.toThrow(
        Boom.conflict("Name already in use")
      );
    });

    it("should create a project", async () => {
      mockedProject.findOne.mockResolvedValue(null);
      mockedProject.create.mockResolvedValue(createdProject as any);
      const result = await service.createProject(projectData as any);
      expect(result).toEqual({
        _id: "1",
        ...projectData
      });
    });
  });

  describe("updateProject", () => {
    const update = { name: "Updated" };
    const updatedProject = {
      _id: "1",
      ...update,
      owner: "1",
      toObject: jest.fn().mockReturnValue({
        _id: "1",
        ...update,
        owner: "1"
      })
    };

    it("should update a project successfully", async () => {
      mockedProject.findByIdAndUpdate.mockReturnValue(updatedProject as any);
      const result = await service.updateProject("1", update);
      expect(result).toEqual({
        _id: "1",
        ...update,
        owner: "1"
      });
    });

    it("should throw not Found error if project not found", async () => {
      mockedProject.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.updateProject("999", update)).rejects.toThrow(
        Boom.notFound("Project not found")
      );
    });
  });

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      mockedProject.findByIdAndDelete.mockResolvedValue({ _id: "1" });
      await service.deleteProject("1");
      expect(mockedProject.findByIdAndDelete).toHaveBeenCalledWith("1");
    });

    it("should throw not Found error if project not found", async () => {
      mockedProject.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.deleteProject("999")).rejects.toThrow(
        Boom.notFound("Project not found")
      );
    });
  });
});
