import { useState, useCallback } from "react";
import { getStatistics, getStatisticsbyPeriod } from "../api/Statistic";
import { useEventBus } from "../utils/useEventBus";
import { EVENT_TYPES } from "../utils/eventTypes";
import type { Statistics } from "../model/apimodel";

export const useStatisticsData = (startDate?: Date, endDate?: Date) => {
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const stats = startDate && endDate 
                ? await getStatisticsbyPeriod(startDate, endDate)
                : await getStatistics();

            if (stats.success && stats.statistics) {
                setStatistics(stats.statistics);
            } else {
                setError(stats.error || 'Failed to fetch statistics');
            }
        } catch (error) {
            setError('Failed to fetch statistics');
            console.error('Error fetching statistics:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 取引データが更新されたら統計も更新
    useEventBus(EVENT_TYPES.TRANSACTION_UPDATED, fetchData);

    return { 
        statistics, 
        isLoading,
        error,
        fetchData 
    };
};
