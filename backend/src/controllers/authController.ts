import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateToken } from "../configs/auth";
import { logger } from "../configs/logger";
import { prisma } from "../configs/prisma";

export const register = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: { userName, email, password: await bcrypt.hashSync(password, 10) },
    });
    res.json({ status: `Register user ${userName} successful.` });
  } catch (error) {
    logger.error("Error register user:", error);
    res.status(500).json({ error: "Register failed", errorMessage: error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compareSync(password, user.password))) {
      const token = generateToken(user.id);
      logger.info(`(${user.userName}) login successfully`);
      res.json({ token, id: user.id });
    } else {
      logger.warn(`Invalid credentials: ${user?.userName}`);
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    logger.error("Error login:", error);
    res.status(500).json({ error: "login failed" });
  }
};
