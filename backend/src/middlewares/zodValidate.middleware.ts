import { RequestHandler } from "express";
import { AnyZodObject, ZodError } from "zod";
import * as Boom from "@hapi/boom";

export const zodValidate = (schema: AnyZodObject): RequestHandler => {
  return (req, _res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(Boom.badRequest("Validation error", { details: error.errors }));
      } else {
        next(Boom.badImplementation("Validation failed"));
      }
    }
  };
};
