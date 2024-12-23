import { NextFunction, Request, Response } from "express";
import { logger } from "../configs/logger";

export const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
};
