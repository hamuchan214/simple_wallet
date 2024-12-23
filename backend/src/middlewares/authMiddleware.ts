import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../configs/auth";
import { logger } from "../configs/logger";

// express.Requestに拡張でuser型を追加
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      logger.error("Error validating token:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  } else {
    logger.warn(`Authorization header missing`);
    res.status(401).json({ error: "Authorization header missing" });
  }
};
