import { useState, useCallback } from "react";
import { getStatistics, getStatisticsbyPeriod } from "../api/Statistic";
import { getTransactionsAll, getTransactionsByPeriod } from "../api/Transactions";
import { useEventBus } from "../utils/useEventBus";
import { EVENT_TYPES } from "../utils/eventTypes";
import type { Statistics, APITransaction } from "../model/apimodel";

interface UseTransactionDataProps {
  startDate?: Date;
  endDate?: Date;
}

export const useTransactionData = ({ startDate, endDate }: UseTransactionDataProps = {}) => {
    const [summaryData, setSummaryData] = useState<Statistics | null>(null);
    const [Transactions, setTransactions] = useState<APITransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const [stats, transactions] = await Promise.all([
                startDate && endDate
                    ? getStatisticsbyPeriod(startDate, endDate)
                    : getStatistics(),
                startDate && endDate
                    ? getTransactionsByPeriod(startDate, endDate)
                    : getTransactionsAll()
            ]);

            if (stats.success && stats.statistics) {
                setSummaryData(stats.statistics);
            }
            if (transactions.success && transactions.transactions) {
                // 日付でフィルタリング
                const filteredTransactions = startDate && endDate
                    ? transactions.transactions.filter(t => {
                        const date = new Date(t.date);
                        return date >= startDate && date <= endDate;
                    })
                    : transactions.transactions;
                    
                setTransactions(filteredTransactions);
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
        Transactions,
        isLoading,
        error,
        fetchData 
    };
};