import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, type z } from "zod";

export function validateData(schema: z.ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = data.body ?? req.body;
      req.params = (data.params ?? req.params) as typeof req.params;
      req.query = (data.query ?? req.query) as typeof req.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));

        return res.status(StatusCodes.BAD_REQUEST).json({
          details: errorMessages,
          error: "Invalid data",
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
      });
    }
  };
}
