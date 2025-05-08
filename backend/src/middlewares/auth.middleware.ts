import { Request, Response, NextFunction } from "express";
import * as Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import { IUserDocument } from "../interfaces/user.interface";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) throw Boom.unauthorized("Token requerido");

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) throw Boom.unauthorized("Token inválido o expirado");
      req.user = decoded as { id: string; email: string; role: string };
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!roles.includes(req.user?.role!)) {
        throw Boom.forbidden("No tienes permisos para esta acción");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
