import * as Boom from "@hapi/boom";
import { ITask, ITaskResponse } from "../interfaces/task.interface";
import { Types } from "mongoose";
import { Task } from "../models/Task";

type Status = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

export class TaskService {
  public async findAllTasks(): Promise<ITaskResponse[]> {
    const tasks = await Task.find().lean();
    return tasks.map((task) => ({
      ...task,
      assignee: task.assignee.toString(),
      projectId: task.projectId.toString()
    }));
  }

  public async findTaskById(id: string): Promise<ITaskResponse> {
    const task = await Task.findById(id);
    if (!task) throw Boom.notFound("Task not found");
    const taskObj = task.toObject();
    return {
      ...taskObj,
      assignee: taskObj.assignee.toString(),
      projectId: taskObj.projectId.toString()
    };
  }

  public async createTask(taskData: {
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    dueDate?: Date;
    assignee: Types.ObjectId;
    projectId: Types.ObjectId;
  }): Promise<ITaskResponse> {
    const task = await Task.create(taskData);
    const taskObj = task.toObject();
    return {
      ...taskObj,
      assignee: taskObj.assignee.toString(),
      projectId: taskObj.projectId.toString()
    };
  }

  public async updateTask(
    id: string,
    data: Partial<ITask>
  ): Promise<ITaskResponse> {
    const task = await Task.findByIdAndUpdate(id, data, { new: true });
    if (!task) throw Boom.notFound("Task not found");
    const taskObj = task.toObject();
    return {
      ...taskObj,
      assignee: taskObj.assignee.toString(),
      projectId: taskObj.projectId.toString()
    };
  }

  public async deleteTask(id: string): Promise<void> {
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw Boom.notFound("Task not found");
  }
}
