import * as Boom from "@hapi/boom";
import { IProject, IProjectResponse } from "../interfaces/project.interface";
import { Project } from "../models/Project";
import { Types } from "mongoose";

export class ProjectService {
  public async findAllProjects(): Promise<IProjectResponse[]> {
    const projects = await Project.find().lean();
    return projects.map((project) => ({
      ...project,
      owner: project.owner.toString()
    }));
  }

  public async findProjectById(id: string): Promise<IProjectResponse> {
    const project = await Project.findById(id);
    if (!project) throw Boom.notFound("Project not found");
    const projectObj = project.toObject();
    return {
      ...projectObj,
      owner: projectObj.owner.toString()
    };
  }

  public async createProject(projectData: {
    name: string;
    description: string;
    owner: Types.ObjectId;
  }): Promise<IProjectResponse> {
    const existingName = await Project.findOne({ name: projectData.name });
    if (existingName) throw Boom.conflict("Name already in use");

    const project = await Project.create(projectData);
    const projectObj = project.toObject();
    return {
      ...projectObj,
      owner: projectObj.owner.toString()
    };
  }

  public async updateProject(
    id: string,
    data: Partial<IProject>
  ): Promise<IProjectResponse> {
    const project = await Project.findByIdAndUpdate(id, data, { new: true });
    if (!project) throw Boom.notFound("Project not found");
    const projectObj = project.toObject();
    return {
      ...projectObj,
      owner: projectObj.owner.toString()
    };
  }

  public async deleteProject(id: string): Promise<void> {
    const project = await Project.findByIdAndDelete(id);
    if (!project) throw Boom.notFound("Project not found");
  }
}
