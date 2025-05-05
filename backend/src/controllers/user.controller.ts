import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schema";

export class UserController {
  private service = new UserService();

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await this.service.findAllUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  public getUserById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.service.findUserById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  public getUserByEmail = async (
    req: Request<{ email: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.service.findUserByEmail(req.params.email);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  public createUser = async (
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.service.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  public updateUser = async (
    req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.service.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  public deleteUser = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
