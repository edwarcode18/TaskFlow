import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import {
  CreateUserProjectInput,
  UpdateUserProjectInput
} from "../schemas/userProject.schema";
import { UserProjectService } from "../services/userProject.service";

export class UserProjectController {
  private service = new UserProjectService();

  public getAllUserProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userProjects = await this.service.findAllUserProjects();
      res.status(200).json(userProjects);
    } catch (err) {
      next(err);
    }
  };

  public getUserProjectById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userProject = await this.service.findUserProjectById(req.params.id);
      res.status(200).json(userProject);
    } catch (err) {
      next(err);
    }
  };

  public createUserProject = async (
    req: Request<{}, {}, CreateUserProjectInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = {
        ...req.body,
        userId: new Types.ObjectId(req.body.userId),
        projectId: new Types.ObjectId(req.body.projectId)
      };
      const userProject = await this.service.createUserProject(data);
      res.status(201).json(userProject);
    } catch (err) {
      next(err);
    }
  };

  public updateUserProject = async (
    req: Request<
      UpdateUserProjectInput["params"],
      {},
      UpdateUserProjectInput["body"]
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = {
        ...req.body,
        userId: new Types.ObjectId(req.body.userId),
        projectId: new Types.ObjectId(req.body.projectId)
      };
      const userProject = await this.service.updateUserProject(
        req.params.id,
        data
      );
      res.status(200).json(userProject);
    } catch (err) {
      next(err);
    }
  };

  public deleteUserProject = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.deleteUserProject(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
