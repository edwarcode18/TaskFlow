import { Document, Types } from "mongoose";

type Status = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

export interface ITask extends Document {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate?: Date;
  assignee: Types.ObjectId;
  projectId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITaskDocument extends ITask, Document {
  _id: string;
  assignee: Types.ObjectId;
  projectId: Types.ObjectId;
}

export interface ITaskResponse {
  _id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate?: Date;
  assignee: string;
  projectId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
