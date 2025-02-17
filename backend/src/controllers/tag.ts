import { Request, Response } from "express";
import { logger } from "../configs/logger";
import { prisma, Prisma } from "../configs/prisma";

export const createTag = async (req: Request, res: Response) => {
  const { name, type } = req.body;
  try {
    if (!name || !type) {
      logger.warn(`Invalid tag data: ${req.body}`);
      res.status(400).json({ error: `Invalid request.` });
      return;
    }
    const userId = req.user!.id;

    const systemTag = await prisma.systemTag.findUnique({
      where: { name, type },
    });
    if (systemTag) {
      logger.warn(`Tag "${name}" is reserved by the system`);
      res
        .status(409)
        .json({ error: `Tag "${name}" is reserved by the system.` });
      return;
    }

    const tag = await prisma.customTag.create({
      data: { userId, name, type },
    });
    logger.info("Tag created successfully");
    res.json(tag);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      logger.warn(`Tag "${name}" already exists`);
      res.status(409).json({ error: `Tag "${name}" already exists.` });
      return;
    }
    logger.error(`Error creating tag:`, error);
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
    const { type, owner } = req.query as { type?: string; owner?: string };
    const tagTypeFilter =
      type && ["income", "expense"].includes(type) ? { type: type } : {};

    const systemTags = await prisma.systemTag.findMany({
      select: { name: true, type: true },
      where: tagTypeFilter,
      orderBy: { id: "asc" },
    });
    const customTags = await prisma.customTag.findMany({
      where: { userId, ...tagTypeFilter },
      select: { id: true, name: true, type: true },
      orderBy: { updatedAt: "desc" },
    });

    const tags = [
      ...(!owner || owner === "system" ? systemTags : []),
      ...(!owner || owner === "custom" ? customTags : []),
    ];

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
