import { useState, useCallback } from "react";
import { getStatistics } from "../api/Statistic";
import { getTransactionsAll } from "../api/Transactions";
import { useEventBus } from "../utils/useEventBus";
import { EVENT_TYPES } from "../utils/eventTypes";
import type { Statistics, APITransaction } from "../model/apimodel";

export const useTransactionData = () => {
    const [summaryData, setSummaryData] = useState<Statistics | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<APITransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const [stats, transaction] = await Promise.all([
                getStatistics(),
                getTransactionsAll()
            ]);

            if (stats.success && stats.statistics) {
                setSummaryData(stats.statistics);
            }
            if (transaction.success && transaction.transactions) {
                setRecentTransactions(transaction.transactions);
            }
        } catch (error) {
            setError('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEventBus(EVENT_TYPES.TRANSACTION_UPDATED, fetchData);

    return { 
        summaryData, 
        recentTransactions,
        isLoading,
        error,
        fetchData 
    };
};