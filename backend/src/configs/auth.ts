import env from "dotenv";
import jwt from "jsonwebtoken";
import { AuthenticatedUserData } from "../models/authenticatedUser";

env.config();
export const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const generateToken = (id: string, username: string): string => {
  const payload: AuthenticatedUserData = { id, username };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "6h",
  });
};

export const verifyToken = (token: string): AuthenticatedUserData => {
  return jwt.verify(token, JWT_SECRET) as AuthenticatedUserData;
};
