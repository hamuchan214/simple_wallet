import axios from "axios";
import requests from "../utils/endpoints";
import { getAuthToken } from "../lib/localStorage";
import { Statistics } from "../model/apimodel";

export const getStatistics = async (): Promise<{
    success: boolean;
    statistics?: Statistics;
    error?: string;
}> => {
    try {
        const token = getAuthToken();
        const response = await axios.get(requests.statistics, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return {
                success: true,
                statistics: response.data
            };
        }
        return {
            success: false,
            error: 'Failed to fetch statistics'
        };
    } catch (error: any) {
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
        };
    }
}

export const getStatisticsbyPeriod = async (startDate: Date, endDate: Date): Promise<{
    success: boolean;
    statistics?: Statistics;
    error?: string;
}> => {
    try {
        const token = getAuthToken();
        const response = await axios.get(requests.statistics, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });

        if (response.status === 200) {
            return {
                success: true,
                statistics: response.data
            };
        }
        return {
            success: false,
            error: 'Failed to fetch statistics'
        };
    } catch (error: any) {
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
        };
    }
}