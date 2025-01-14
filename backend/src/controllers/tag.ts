import { Request, Response } from "express";
import { logger } from "../configs/logger";
import { prisma } from "../configs/prisma";
import { Prisma } from "../generated/client";

export const createTag = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const userId = req.user!.id;

    const systemTag = await prisma.systemTag.findUnique({ where: { name } });
    if (systemTag) {
      logger.warn(`Tag "${name}" is reserved by the system`);
      res.status(409).json({ error: `Tag "${name}" x.` });
      return;
    }

    const tag = await prisma.customTag.create({
      data: { userId, name },
    });
    logger.info("Tag created successfully");
    res.json(tag);
  } catch (error) {
    logger.error(`Error creating tag:`, error);
    if (!name) {
      logger.warn(`Cannot create empty tag`);
      res.status(409).json({ error: `Cannot create empty tag.` });
      return;
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      logger.warn(`Tag "${name}" already exists`);
      res.status(409).json({ error: `Tag "${name}" already exists.` });
      return;
    }
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Invalid tag data" });
    }
  }
};

export const getTags = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const systemTags = await prisma.systemTag.findMany({
      select: { id: true, name: true },
    });
    const customTags = await prisma.customTag.findMany({
      where: { userId },
      select: { id: true, name: true },
    });
    const tags = [...systemTags, ...customTags];
    logger.info("Tags retrieved successfully.");
    res.json(tags);
  } catch (error) {
    logger.error("Error retrieving tags:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user!.id;
    const tag = await prisma.customTag.findUnique({
      where: { userId, id: Number(id) },
    });
    if (!tag) {
      logger.warn(`Tag ${id} not found.`);
      res.status(404).json({ error: `Tag ${id} not found.` });
      return;
    }
    await prisma.customTag.delete({
      where: { userId, id: Number(id) },
    });
    logger.info(`Tag ${id} deleted successfully.`);
    res.status(204).json({ message: `Tag ${id} deleted successfully.` });
  } catch (error) {
    logger.error(`Error deleting tag ${id}:`, error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
