import { Document, Types } from "mongoose";

type RoleInProject = "owner" | "member" | "guest";

export interface IUserProject extends Document {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  roleInProject: RoleInProject;
  joinedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserProjectDocument extends IUserProject, Document {
  _id: string;
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
}

export interface IUserProjectResponse {
  _id: string;
  userId: string;
  projectId: string;
  roleInProject: RoleInProject;
  joinedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
