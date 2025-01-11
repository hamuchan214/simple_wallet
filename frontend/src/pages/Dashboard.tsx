import { useEffect, useState } from 'react';
import { Container, Grid, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactionsCard from '../components/dashboard/RecentTransactionsCard';
import { useTransactionData } from '../lib/useTransactionData';

const Dashboard = () => {

  const navigate = useNavigate();
  const {
    summaryData,
    recentTransactions,
    isLoading,
    error,
    fetchData
  } = useTransactionData();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');

    if (!token || !id || !name) {
      navigate('/');
      return;
    }

    fetchData();
  }, [navigate, fetchData]);

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
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="収入" 
              amount={summaryData?.totalIncome ?? 0}
              type="income"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="支出" 
              amount={summaryData?.totalExpense ?? 0}
              type="expense"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="残高" 
              amount={(summaryData?.totalIncome ?? 0) - (summaryData?.totalExpense ?? 0)}
              type="balance"
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <RecentTransactionsCard 
              transactions={recentTransactions} 
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
