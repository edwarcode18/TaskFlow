import * as Boom from "@hapi/boom";
import { Types } from "mongoose";
import {
  IUserProject,
  IUserProjectResponse
} from "../interfaces/userProject.interface";
import { UserProject } from "../models/UserProject";

type RoleInProject = "owner" | "member" | "guest";

export class UserProjectService {
  public async findAllUserProjects(): Promise<IUserProjectResponse[]> {
    const userProjects = await UserProject.find().lean();
    return userProjects.map((userProject) => ({
      ...userProject,
      userId: userProject.userId.toString(),
      projectId: userProject.projectId.toString()
    }));
  }

  public async findUserProjectById(id: string): Promise<IUserProjectResponse> {
    const userProject = await UserProject.findById(id);
    if (!userProject) throw Boom.notFound("UserProject not found");
    const userProjectObj = userProject.toObject();
    return {
      ...userProjectObj,
      userId: userProject.userId.toString(),
      projectId: userProject.projectId.toString()
    };
  }

  public async createUserProject(userProjectData: {
    userId: Types.ObjectId;
    projectId: Types.ObjectId;
    roleInProject: RoleInProject;
    joinedAt?: Date;
  }): Promise<IUserProjectResponse> {
    const userProject = await UserProject.create(userProjectData);
    const userProjectObj = userProject.toObject();
    return {
      ...userProjectObj,
      userId: userProject.userId.toString(),
      projectId: userProject.projectId.toString()
    };
  }

  public async updateUserProject(
    id: string,
    data: Partial<IUserProject>
  ): Promise<IUserProjectResponse> {
    const userProject = await UserProject.findByIdAndUpdate(id, data, {
      new: true
    });
    if (!userProject) throw Boom.notFound("User Project not found");
    const userProjectObj = userProject.toObject();
    return {
      ...userProjectObj,
      userId: userProject.userId.toString(),
      projectId: userProject.projectId.toString()
    };
  }

  public async deleteUserProject(id: string): Promise<void> {
    const userProject = await UserProject.findByIdAndDelete(id);
    if (!userProject) throw Boom.notFound("User Project not found");
  }
}
