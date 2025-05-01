import { User } from "../generated/client";

// SavingsGoalの型
interface SavingsGoal {
    id: number;
    userId: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date | null;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    savingsHistory: SavingsHistory[];
  }
  
  // SavingsHistoryの型
  interface SavingsHistory {
    id: number;
    goalId: number;
    amount: number;
    description: string | null;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    goal: SavingsGoal;
  }