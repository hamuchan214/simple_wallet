//セッションデータ
export interface Session {
    id: number;
    token: string;
}

//取引データ
export interface Transaction {
    amount: number;
    description: string;
    date: string;

    tags: string[];
}

export interface APITransaction extends Transaction {
    id: number;
    userId: number;
}

//統計データ
export interface Statistics {
    totalExpense: number;
    totalIncome: number;

    tagAmounts: [
        {
            name: string;
            amount: number;
        }
    ]
}

