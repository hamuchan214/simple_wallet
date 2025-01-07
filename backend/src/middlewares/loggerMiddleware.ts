import { NextFunction, Request, Response } from "express";
import { httpLogger } from "../configs/logger";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  httpLogger.info(`${req.method} ${req.url}`);
  next();
};
