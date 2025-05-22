import { Request, Response, NextFunction } from "express";
import * as Boom from "@hapi/boom";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserService } from "../services/user.service";

export class AuthController {
  private userService = new UserService();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findUserByEmailWithPassword(email);
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      if (!user) throw Boom.unauthorized("Credenciales inválidas");

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) throw Boom.unauthorized("Credenciales inválidas");

      const jwtSecret: Secret = process.env.JWT_SECRET;
      const jwtOptions: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN ||
          "1h") as SignOptions["expiresIn"]
      };

      const payload = {
        id: user._id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(payload, jwtSecret, jwtOptions);

      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
