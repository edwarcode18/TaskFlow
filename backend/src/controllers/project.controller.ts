import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/project.service";
import {
  CreateProjectInput,
  UpdateProjectInput
} from "../schemas/project.schema";

export class ProjectController {
  private service = new ProjectService();

  public getAllProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const projects = await this.service.findAllProjects();
      res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  };

  public getProjectById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const project = await this.service.findProjectById(req.params.id);
      res.status(200).json(project);
    } catch (err) {
      next(err);
    }
  };

  public createProject = async (
    req: Request<{}, {}, CreateProjectInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = {
        ...req.body,
        owner: new Types.ObjectId(req.body.owner)
      };
      const project = await this.service.createProject(data);
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  };

  public updateProject = async (
    req: Request<UpdateProjectInput["params"], {}, UpdateProjectInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = {
        ...req.body,
        owner: new Types.ObjectId(req.body.owner)
      };
      const project = await this.service.updateProject(req.params.id, data);
      res.status(200).json(project);
    } catch (err) {
      next(err);
    }
  };

  public deleteProject = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.deleteProject(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
