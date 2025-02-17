import { useEffect, useState, useMemo } from 'react';
import { Container, Grid, Snackbar, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//component import
import Layout from '../layout/Layout';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactionsCard from '../components/transactions/TransactionsCard';
import MonthlyStatistics from '../components/dashboard/MonthlyStatistics';
import ExpensesByTagPieChart from '../components/dashboard/ExpensesByTagPieChart';
import WeeklyExpensesChart from '../components/dashboard/WeeklyExpensesChart';
import UpcomingPaymentsCard from '../components/dashboard/UpcomingPaymentsCard';

//hook import
import { useTransactionData } from '../lib/useTransactionData';
import { useStatisticsData } from '../lib/useStatisticsData';

//lib import
import { checkSession } from '../lib/localStorage';

const Dashboard = () => {

  const navigate = useNavigate();
  
  // 月初から今日までの日付範囲
  const monthDates = useMemo(() => {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }, []);

  // 直近30日の日付範囲
  const thirtyDaysDates = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    return { startDate, endDate };
  }, []);

  // 月次データ
  const {
    statistics: monthlyStats,
    isLoading: monthlyLoading,
    fetchData: fetchMonthlyStats
  } = useStatisticsData(monthDates.startDate, monthDates.endDate);

  // 直近30日のデータ
  const {
    summaryData: thirtyDaysData,
    isLoading: thirtyDaysLoading,
    fetchData: fetchThirtyDaysData
  } = useTransactionData({
    startDate: thirtyDaysDates.startDate,
    endDate: thirtyDaysDates.endDate
  });

  // 全期間のデータ
  const {
    summaryData,
    Transactions,
    isLoading,
    error,
    fetchData: fetchTransactions
  } = useTransactionData();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success'
  });

  useEffect(() => {
    const session = checkSession();

    if (!session) {
      navigate('/');
      return;
    }

    fetchTransactions();
    fetchMonthlyStats();
    fetchThirtyDaysData();
  }, [navigate, fetchTransactions, fetchMonthlyStats, fetchThirtyDaysData]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MonthlyStatistics 
              statistics={monthlyStats}
              isLoading={monthlyLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ExpensesByTagPieChart 
              statistics={thirtyDaysData}
              loading={thirtyDaysLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <WeeklyExpensesChart 
              statistics={summaryData}
              transactions={Transactions}
              loading={isLoading}
            />
            <Box sx={{ mt: 3 }}>
              <UpcomingPaymentsCard 
                transactions={Transactions}
                loading={isLoading}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <RecentTransactionsCard 
              transactions={Transactions} 
              loading={isLoading}
              limit={5}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="総収入" 
              amount={summaryData?.totalIncome ?? 0}
              type="income"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="総支出" 
              amount={summaryData?.totalExpense ?? 0}
              type="expense"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="総残高" 
              amount={(summaryData?.totalIncome ?? 0) - (summaryData?.totalExpense ?? 0)}
              type="balance"
              loading={isLoading}
            />
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false}))}
      >
        <Alert
          severity='error'
          onClose={() => setSnackbar(prev => ({ ...prev, open: false}))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Dashboard;
