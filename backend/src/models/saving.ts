import { User, SavingsGoal, SavingsHistory } from "../generated/client";

// SavingsGoalの型
// 貯金目標作成時の入力型
export interface CreateSavingsGoalInput {
  name: string;
  targetAmount: number;
  deadline?: Date;
}

// 貯金目標更新時の入力型
export interface UpdateSavingsGoalInput {
  name?: string;
  targetAmount?: number;
  deadline?: Date;
}

// 貯金履歴作成時の入力型
export interface CreateSavingsHistoryInput {
  goalId: number;
  amount: number;
  description?: string;
  date: Date;
}

// 貯金目標と履歴を結合した型
export interface SavingsGoalWithHistory extends SavingsGoal {
  savingsHistory: SavingsHistory[];
}

// 貯金統計情報の型
export interface SavingsStatistics {
  totalGoals: number;
  completedGoals: number;
  totalSaved: number;
  totalTarget: number;
  progressPercentage: number;
}