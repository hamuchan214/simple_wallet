//userデータ
export interface Session {
    id: number;
    token: string;
}

export interface Transaction {
    amount: number;
    description: string;
    date: string;

    tags: string[];

    id: number;
    user_id: number;
}