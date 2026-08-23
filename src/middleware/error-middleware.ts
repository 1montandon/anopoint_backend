import type { NextFunction, Request, Response } from "express";
import HttpError from "../error/error.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.log(err);
  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      status: "error",
    });

    return;
  }
  console.log(err);
  res.status(500).json({
    message: `Erro interno do servidor ${err}`,
    status: "error",
  });
}
