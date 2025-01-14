export interface CreateTransaction {
  amount: number;
  description?: string;
  date: string;
  tags: string[];
}

export interface Transaction {
  id: number;
  userId: string;
  amount: number;
  description: string | null;
  date: Date;
  tags: string[];
}
