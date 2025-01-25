import { useEffect, useState, useMemo } from 'react';
import { Container, Grid, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//component import
import Layout from '../layout/Layout';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactionsCard from '../components/transactions/TransactionsCard';
import MonthlyStatistics from '../components/dashboard/MonthlyStatistics';
import ExpensesByTagPieChart from '../components/dashboard/ExpensesByTagPieChart';
import WeeklyExpensesChart from '../components/dashboard/WeeklyExpensesChart';

//hook import
import { useTransactionData } from '../lib/useTransactionData';
import { useStatisticsData } from '../lib/useStatisticsData';

//lib import
import { checkSession } from '../lib/localStorage';

const Dashboard = () => {

  const navigate = useNavigate();
  const dates = useMemo(() => {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }, []);

  const {
    statistics: monthlyStats,
    isLoading: monthlyLoading,
    fetchData: fetchMonthlyStats
  } = useStatisticsData(dates.startDate, dates.endDate);

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
  }, [navigate, fetchTransactions, fetchMonthlyStats]);

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
              statistics={summaryData}
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <WeeklyExpensesChart 
              statistics={summaryData}
              transactions={Transactions}
              loading={isLoading}
            />
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
