import axios from "axios";
import requests from "../utils/endpoints";
import { getAuthToken } from "../lib/localStorage";
import { Transaction } from "../model/apimodel";
import { APITransaction } from "../model/apimodel";

export const getTransactionsAll = async (): Promise<{
    success: boolean;
    transactions?: APITransaction[];
    error?: string;
    }> => {
        try {
            const token = getAuthToken();
            const response = await axios.get(requests.transactions, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                return {
                    success: true,
                    transactions: response.data
                }
            }
            return {
                success: false,
                error: 'Failed to fetch transactions'
            };
        }
        catch (error: any) {
            if (error.response?.status) {
                switch (error.response.status) {
                    case 401: 
                        return {
                            success: false,
                            error: 'Unauthorized'
                        };
                    case 500:
                        return {
                            success: false,
                            error: 'サーバーエラーが発生しました'
                        };
                }
            }
            return {
                success: false,
                error: 'サーバーに接続できません'
            }
        }
}

export const getTransactionById = async (id: number): Promise<{
    success: boolean;
    transaction?: APITransaction;
    error?: string;
}> => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${requests.transactions}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return {
                success: true,
                transaction: response.data
            }
        }
        return {
            success: false,
            error: 'Failed to fetch transaction'
        }
    } catch (error: any) {
        if (error.response.status) {
            switch (error.response.status) {
                case 401: 
                    return {
                        success: false,
                        error: 'Unauthorized'
                    };
                case 404:
                    return {
                        success: false,
                        error: 'Transaction not found'
                    };
            }
        }
    }
    return {
        success: false,
        error: 'Failed to fetch transaction'
    }
}

export const createTransaction = async (transaction: Transaction): Promise<{
    success: boolean;
    transaction?: APITransaction;
    error?: string;
}> => {
    try {
        const token = getAuthToken();
        const response = await axios.post(requests.transactions, transaction, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response);

        if (response.status === 200) {
            return {
                success: true,
                transaction: response.data
            };
        }
        return {
            success: false,
            error: 'Failed to create transaction'
        };
    } catch (error: any) {
        if (error.response.status) {
            switch (error.response.status) {
                case 400: 
                    return {
                        success: false,
                        error: 'Invalid transaction data'
                    };
                case 401: 
                    return {
                        success: false,
                        error: 'Unauthorized'
                    };
            }
        }
    }
    return{
        success: false,
        error: 'Failed to create transaction'
    };
}

export const updateTransaction = async (id: number, transaction: Transaction): Promise<{
    success: boolean;
    error?: string;
}> => {
    try {
        const token = getAuthToken();
        const response = await axios.patch(`${requests.transactions}/${id}`, transaction, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return {
                success: true
            };
        }
        return {
            success: false,
            error: 'Failed to update transaction'
        };
    } catch (error: any) {
        if (error.response.status) {
            switch (error.response.status) {
                case 400: 
                    return {
                        success: false,
                        error: 'Invalid transaction data'
                    };
                case 401: 
                    return {
                        success: false,
                        error: 'Unauthorized'
                    };
                case 404:
                    return {
                        success: false,
                        error: 'Transaction not found'
                    };
            }
        }
    }
    return {
        success: false,
        error: 'Failed to update transaction'
    };
}

export const deleteTransaction = async (id: number): Promise<{
    success: boolean;
    error?: string;
}> => {
    try {
        const token = getAuthToken();
        const response = await axios.delete(`${requests.transactions}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 204) {
            return {
                success: true
            };
        }
        return {
            success: false,
            error: 'Failed to delete transaction'
        };
    } catch (error: any) {
        if (error.response.status) {
            switch (error.response.status) {
                case 400:
                    return {
                        success: false,
                        error: 'Invalid transaction data'
                    };
                case 401: 
                    return {
                        success: false,
                        error: 'Unauthorized'
                    };
                case 404:
                    return {
                        success: false,
                        error: 'Transaction not found'
                    };
            }
        }
    }
    return {
        success: false,
        error: 'Failed to delete transaction'
    };
}