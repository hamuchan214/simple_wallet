import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateToken } from "../configs/auth";
import { logger } from "../configs/logger";
import { prisma } from "../configs/prisma";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const alreadyUser = await prisma.user.findUnique({ where: { username } });
    if (alreadyUser) {
      logger.warn(`User ${username} already exists`);
      res.status(400).json({ error: `User "${username}" already exists.` });
      return;
    }
    const user = await prisma.user.create({
      data: { username, password: await bcrypt.hashSync(password, 10) },
    });
    logger.info(`Register user ${username} successful.`);
    res.json({ status: `Register user ${username} successful.` });
  } catch (error) {
    logger.error("Error register:", error);
    res.status(500).json({ error: "Register failed." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user && (await bcrypt.compareSync(password, user.password))) {
      const token = generateToken(user.id, user.username);
      logger.info(`(${user.username}) login successfully`);
      res.json({ token, id: user.id });
    } else {
      logger.warn(`Invalid credentials: ${user?.username}`);
      res.status(401).json({ error: "Invalid credentials." });
    }
  } catch (error) {
    logger.error("Error login:", error);
    res.status(500).json({ error: "login failed." });
  }
};
