import { NextFunction, Request, Response } from "express";
import * as Boom from "@hapi/boom";

export const errorMiddleware = (
  err: Error | Boom.Boom,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const boomErr = Boom.isBoom(err)
    ? err
    : Boom.boomify(err, {
        statusCode: 500,
        message: "Internal server error"
      });

  const { statusCode, payload } = boomErr.output;
  res.status(statusCode).json({
    success: false,
    error: {
      ...payload,
      stack: process.env.NODE_ENV === "development" ? boomErr.stack : undefined,
      details: boomErr.data || undefined
    }
  });
};
