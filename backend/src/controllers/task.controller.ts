import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";

export class TaskController {
  private service = new TaskService();

  public getAllTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tasks = await this.service.findAllTasks();
      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  };

  public getTasksById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await this.service.findTaskById(req.params.id);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  };

  public createTask = async (
    req: Request<{}, {}, CreateTaskInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = {
        ...req.body,
        assignee: new Types.ObjectId(req.body.assignee),
        projectId: new Types.ObjectId(req.body.projectId)
      };
      const task = await this.service.createTask(data);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  };

  public updateTask = async (
    req: Request<UpdateTaskInput["params"], {}, UpdateTaskInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = {
        ...req.body,
        assignee: new Types.ObjectId(req.body.assignee),
        projectId: new Types.ObjectId(req.body.projectId)
      };
      const task = await this.service.updateTask(req.params.id, data);
      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  };

  public deleteTask = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.deleteTask(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
