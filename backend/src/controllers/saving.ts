import { Request,Response } from "express";
import { prisma } from "../configs/prisma"; 
import { logger } from "../configs/logger";

import { CreateSavingsGoalInput, CreateSavingsHistoryInput,UpdateSavingsGoalInput } from "../models/saving";

export const getSavingsGoals = async (req: Request, res:Response) => {
    try {
        const userId = req.user!.id;
        const goals = await prisma.savingsGoal.findMany({
            where: {userId},
            include: {savingsHistory: true},
        });

        res.json(goals);
    }
    catch (error){
        logger.error("Error retrieving statistics:", error);
        res.status(500).json({error: "Internal Server error"});
    }
} 

export const createSavingsGoal = async(req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { name, targetAmount, deadline} = req.body as CreateSavingsGoalInput;

        const goal = await prisma.savingsGoal.create({
            data: {
                name,
                targetAmount,
                deadline: deadline ? new Date(deadline) : null,
                userId,
                currentAmount: 0,
                isCompleted: false,
            },
        });
        res.status(201).json(goal);
    }
    catch (error){
        console.log(error);
        res.status(500).json({error: "Internal server error"});
        logger.error(error);
    }
};

export const deleteSavingsGoal = async (req:Request, res:Response) => {
    try{
        const { id } = req.params;
        const userId = req.user!.id;

        await prisma.savingsGoal.delete({
            where: {id: Number(id), userId},
        });

        logger.info("saving gole deleted successfully");
        res.status(204).send();
    }
    catch(error){
        res.status(500).json({error: "Internal server error"});
    }
};

export const addSavingHistory = async (req: Request, res: Response) => {
    try {

      const userId = req.user!.id;
      const { goalId, amount, description, date } = req.body as CreateSavingsHistoryInput;
  
      // 目標が存在し、ユーザーが所有していることを確認
      const goal = await prisma.savingsGoal.findFirst({
        where: { id: goalId, userId },
      });
  
      if (!goal) {
        return res.status(404).json({ error: "貯金目標が見つかりません" });
      }
  
      const history = await prisma.savingsHistory.create({
        data: {
          goalId,
          amount,
          description,
          date,
        },
      });
  
      // 現在の貯金額を更新
      const updatedGoal = await prisma.savingsGoal.update({
        where: { id: goalId },
        data: {
          currentAmount: goal.currentAmount + amount,
          isCompleted: goal.currentAmount + amount >= goal.targetAmount,
        },
      });
  
      res.status(201).json({ history, goal: updatedGoal });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const updateSavingsGoal = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, targetAmount, deadline } = req.body as UpdateSavingsGoalInput;
      const userId = req.user!.id;
  
      const goal = await prisma.savingsGoal.update({
        where: { id: Number(id), userId },
        data: { 
          name, 
          targetAmount, 
          deadline: deadline ? new Date(deadline) : null
        },
      });
  
      res.json(goal);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };