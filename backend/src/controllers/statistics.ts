import { Request, Response } from "express";
import { prisma } from "../configs/prisma";
import { logger } from "../configs/logger";

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    const dateFilter = {
      userId,
      date: {
        ...(startDate ? { gte: new Date(startDate as string) } : {}),
        ...(endDate ? { lte: new Date(endDate as string) } : {}),
      },
    };

    const [totalExpense, totalIncome, transactionsByTag] = await Promise.all([
      // 総支出
      prisma.transaction.aggregate({
        where: { ...dateFilter, amount: { lt: 0 } },
        _sum: { amount: true },
      }),
      // 総収入
      prisma.transaction.aggregate({
        where: { ...dateFilter, amount: { gt: 0 } },
        _sum: { amount: true },
      }),
      // タグ別集計
      prisma.transactionWithTag.groupBy({
        by: ["tagId"],
        where: {
          ...dateFilter,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // タグ名の取得
    const tagIds = transactionsByTag.map((t) => t.tagId);
    const tags = await prisma.tag.findMany({
      where: {
        id: {
          in: tagIds,
        },
      },
    });

    const tagAmounts = transactionsByTag.map((stat) => ({
      name: tags.find((t) => t.id === stat.tagId)?.name || "Unknown",
      amount: stat._sum.amount || 0,
    }));

    logger.info("Statistics retrieved successfully");
    res.json({
      totalExpense: Math.abs(totalExpense._sum?.amount || 0),
      totalIncome: totalIncome._sum?.amount || 0,
      balance:
        (totalIncome._sum?.amount || 0) + (totalExpense._sum?.amount || 0),
      tagAmounts,
    });
  } catch (error) {
    logger.error("Error retrieving statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
