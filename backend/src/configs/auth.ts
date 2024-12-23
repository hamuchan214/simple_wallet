import env from "dotenv";
import jwt from "jsonwebtoken";
import { AuthorizedUser } from "../models/authorized";

env.config();
export const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const generateToken = (id: string): string => {
  const payload: AuthorizedUser = { id };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "6h",
  });
};

export const verifyToken = (token: string): AuthorizedUser => {
  return jwt.verify(token, JWT_SECRET) as AuthorizedUser;
};
