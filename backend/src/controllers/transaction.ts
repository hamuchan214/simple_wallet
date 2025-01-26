import { Request, Response } from "express";
import { logger } from "../configs/logger";
import { Prisma, prisma } from "../configs/prisma";
import { CreateTransaction, Transaction } from "../models/transaction";

const getTransactionWithAssociatedTags = async (
  userId: string,
  transactionId: number
) => {
  const transactionWithTags = await prisma.transactionWithTags.findMany({
    where: { userId, transactionId },
  });

  // トランザクション情報とタグをまとめる
  const transaction: Transaction = {
    id: transactionWithTags[0].transactionId,
    userId: transactionWithTags[0].userId,
    amount: transactionWithTags[0].amount,
    description: transactionWithTags[0].description,
    date: transactionWithTags[0].date,
    tags: transactionWithTags.map((t) => t.tagName).filter((t) => t != null),
  };
  return transaction;
};

// 共通関数の定義
const handleTransactionTags = async (
  tx: Prisma.TransactionClient,
  userId: string,
  transactionId: number,
  tags: string[]
) => {
  // システムタグとカスタムタグを一括で取得
  const [systemTags, customTags] = await Promise.all([
    tx.systemTag.findMany({
      where: { name: { in: tags } },
      select: { id: true, name: true },
    }),
    tx.customTag.findMany({
      where: {
        AND: [{ userId }, { name: { in: tags } }],
      },
      select: { id: true, name: true },
    }),
  ]);

  // 存在するタグ名
  const tagNames = new Set([
    ...systemTags.map((t) => t.name),
    ...customTags.map((t) => t.name),
  ]);

  // タグが存在しない場合はエラー
  if (tagNames.size !== tags.length) {
    const invalidTags = tags.filter((t) => !tagNames.has(t));
    throw new Error(`Invalid tags: ${invalidTags.join(", ")}`);
  }

  // タグの紐付けを作成
  await Promise.all([
    ...systemTags.map((tag) =>
      tx.systemTagsOnTransactions.create({
        data: {
          transactionId,
          tagId: tag.id,
        },
      })
    ),
    ...customTags.map((tag) =>
      tx.customTagsOnTransactions.create({
        data: {
          transactionId,
          tagId: tag.id,
        },
      })
    ),
  ]);
};

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

      await handleTransactionTags(tx, userId, transaction.id, tags);

      return transaction;
    });

    const createdTransaction = await getTransactionWithAssociatedTags(
      userId,
      transaction.id
    );

    logger.info("Transaction created successfully");
    res.json(createdTransaction);
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
    const userId = req.user!.id;
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
    const userId = req.user!.id;
    const transactionWithTags = await prisma.transactionWithTags.findMany({
      where: { userId, transactionId: Number(id) },
    });

    if (!transactionWithTags.length) {
      logger.warn(`Transaction ${id} not found.`);
      res.status(404).json({ error: `Transaction ${id} not found.` });
      return;
    }

    const transaction = await getTransactionWithAssociatedTags(
      userId,
      Number(id)
    );

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
    const userId = req.user!.id;
    const transactionId = Number(id);
    const { amount, description, date, tags } = req.body as CreateTransaction;
    const originalTransaction = await prisma.transaction.findUnique({
      where: { userId, id: transactionId },
    });
    if (!originalTransaction) {
      logger.warn(`Transaction ${id} not found.`);
      res.status(404).json({ error: `Transaction ${id} not found.` });
      return;
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const updatedTransaction = await tx.transaction.update({
        where: { userId, id: transactionId },
        data: { amount, description, date: new Date(date) },
      });

      // 既存のタグ紐付けを全て削除
      await Promise.all([
        tx.systemTagsOnTransactions.deleteMany({
          where: { transactionId },
        }),
        tx.customTagsOnTransactions.deleteMany({
          where: { transactionId },
        }),
      ]);

      await handleTransactionTags(tx, userId, transactionId, tags);
      return updatedTransaction;
    });

    const updatedTransaction = await getTransactionWithAssociatedTags(
      userId,
      transaction.id
    );
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
    const userId = req.user!.id;
    const transactionId = Number(id);
    const transaction = await prisma.transaction.findUnique({
      where: { userId, id: transactionId },
    });
    if (!transaction) {
      logger.warn(`Transaction ${id} not found.`);
      res.status(404).json({ error: `Transaction ${id} not found.` });
      return;
    }
    await prisma.transaction.delete({
      where: { userId, id: transactionId },
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
