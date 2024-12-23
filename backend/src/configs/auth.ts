import env from "dotenv";
import jwt from "jsonwebtoken";

env.config();
export const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "6h",
  });
};

export const verifyToken = (token: string): { id: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: string };
};
