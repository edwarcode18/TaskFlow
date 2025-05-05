import { Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDocument extends IProject, Document {
  _id: string;
  owner: Types.ObjectId;
}

export interface IProjectResponse {
  _id: string;
  name: string;
  description: string;
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
}
