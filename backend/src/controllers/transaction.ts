import { Request, Response } from "express";
import { logger } from "../configs/logger";
import { prisma } from "../configs/prisma";
import { CreateTransaction } from "../models/transaction";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const { amount, description, date, tags } = req.body as CreateTransaction;
    const transaction = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId,
          amount,
          description,
          date: new Date(date),
        },
      });
      const transactionTags = await Promise.all(
        tags.map(async (tagName) => {
          const tag = await tx.tag.findUnique({
            where: { name: tagName },
            select: { id: true },
          });
          if (!tag) {
            const newTag = await tx.tag.create({ data: { name: tagName } });
            return {
              transactionId: transaction.id,
              tagId: newTag.id,
            };
          }
          return {
            transactionId: transaction.id,
            tagId: tag.id,
          };
        })
      );
      await tx.tagsOnTransactions.createMany({
        data: transactionTags,
      });
      return transaction;
    });

    logger.info("Transaction created successfully");
    res.json(transaction);
  } catch (error) {
    logger.error(`Error creating transaction:`, error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate } = req.query;

    const dateFilter = {
      date: {
        ...(startDate ? { gte: new Date(startDate as string) } : {}),
        ...(endDate ? { lte: new Date(endDate as string) } : {}),
      },
    };

    const transactions = await prisma.transaction.findMany({
      where: { userId, ...dateFilter },
      orderBy: { date: "desc", id: "desc" },
    });
    logger.info("Transactions retrieved successfully.");
    res.json(transactions);
  } catch (error) {
    logger.error("Error retrieving transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id), userId },
    });
    if (!transaction) {
      logger.warn(`Transaction ${id} not found.`);
      res.status(404).json({ error: `Transaction ${id} not found.` });
      return;
    }
    logger.info(`Transaction ${id} retrieved successfully.`);
    res.json(transaction);
  } catch (error) {
    logger.error(`Error retrieving transaction ${id}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const patchTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id), userId },
    });
    if (!transaction) {
      logger.warn(`Transaction ${id} not found.`);
      res.status(404).json({ error: `Transaction ${id} not found.` });
      return;
    }
    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id), userId },
      data: req.body,
    });
    logger.info(`Transaction ${id} updated successfully.`);
    res.json(updatedTransaction);
  } catch (error) {
    logger.error(`Error updating transaction ${id}:`, error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?.id;
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id), userId },
    });
    if (!transaction) {
      logger.warn(`Transaction ${id} not found.`);
      res.status(404).json({ error: `Transaction ${id} not found.` });
      return;
    }
    await prisma.transaction.delete({
      where: { id: Number(id), userId },
    });
    logger.info(`Transaction ${id} deleted successfully.`);
    res.json({ message: `Transaction ${id} deleted successfully.` });
  } catch (error) {
    logger.error(`Error deleting transaction ${id}:`, error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
