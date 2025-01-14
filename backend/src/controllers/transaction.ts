import { Request, Response } from "express";
import { logger } from "../configs/logger";
import { prisma } from "../configs/prisma";
import { CreateTransaction, Transaction } from "../models/transaction";

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
      await Promise.all(
        tags.map(async (tagName) => {
          const systemTag = await tx.systemTag.findUnique({
            where: { name: tagName },
            select: { id: true },
          });
          if (systemTag) {
            await tx.systemTagsOnTransactions.create({
              data: { transactionId: transaction.id, tagId: systemTag.id },
            });
            return {
              transactionId: transaction.id,
              tagId: systemTag.id,
            };
          }
          const customTag = await tx.customTag.findUnique({
            where: { userId, name: tagName },
            select: { id: true },
          });
          if (!customTag) {
            const newTag = await tx.customTag.create({
              data: { userId, name: tagName },
            });
            await tx.customTagsOnTransactions.create({
              data: { transactionId: transaction.id, tagId: newTag.id },
            });
            return {
              transactionId: transaction.id,
              tagId: newTag.id,
            };
          }
          await tx.customTagsOnTransactions.create({
            data: { transactionId: transaction.id, tagId: customTag.id },
          });
          return {
            transactionId: transaction.id,
            tagId: customTag.id,
          };
        })
      );
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

    const transactionsWithTags = await prisma.transactionWithTags.findMany({
      where: { userId, ...dateFilter },
      orderBy: [{ date: "desc" }, { transactionId: "desc" }],
    });

    // タグ情報をトランザクションごとにグループ化
    const transactions = transactionsWithTags.reduce((acc, curr) => {
      const existingTransaction = acc.find((t) => t.id === curr.transactionId);
      if (existingTransaction && curr.tagName) {
        existingTransaction.tags.push(curr.tagName);
      } else {
        acc.push({
          id: curr.transactionId,
          userId: curr.userId,
          amount: curr.amount,
          description: curr.description,
          date: curr.date,
          tags: curr.tagName ? [curr.tagName] : [],
        });
      }
      return acc;
    }, [] as Array<Transaction>);

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
    const transactionWithTags = await prisma.transactionWithTags.findMany({
      where: {
        transactionId: Number(id),
        userId,
      },
    });

    if (!transactionWithTags.length) {
      logger.warn(`Transaction ${id} not found.`);
      res.status(404).json({ error: `Transaction ${id} not found.` });
      return;
    }

    // トランザクション情報とタグをまとめる
    const transaction: Transaction = {
      id: transactionWithTags[0].transactionId,
      userId: transactionWithTags[0].userId,
      amount: transactionWithTags[0].amount,
      description: transactionWithTags[0].description,
      date: transactionWithTags[0].date,
      tags: transactionWithTags.map((t) => t.tagName).filter((t) => t != null),
    };

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
    res
      .status(204)
      .json({ message: `Transaction ${id} deleted successfully.` });
  } catch (error) {
    logger.error(`Error deleting transaction ${id}:`, error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
