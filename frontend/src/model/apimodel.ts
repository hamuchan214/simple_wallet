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
    id: string;
    userId: string;
}

export interface ReactTransaction extends APITransaction {
    type: 'income' | 'expense';
    amount: number;
}

//統計データ
export interface Statistics {
    totalExpense: number;
    totalIncome: number;
    balance: number;

    tagAmounts: [
        {
            name: string;
            amount: number;
        }
    ]
}

export interface Tag {
    name: string;
    type: 'income' | 'expense';
}

export interface APITag extends Tag{
    id: string;
}