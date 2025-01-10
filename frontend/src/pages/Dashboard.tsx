import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactionsCard from '../components/dashboard/RecentTransactionsCard';
import { getTransactionsAll } from '../api/Transactions';
import { Statistics } from '../model/apimodel';
import { getStatistics } from '../api/Statistic';
import { APITransaction } from '../model/apimodel';
const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ id: number; name: string } | null>(null);
  const [summaryData, setSummaryData] = useState<Statistics | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<APITransaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const stats = await getStatistics();
      if (stats.success && stats.statistics) {
        setSummaryData(stats.statistics);
      }

      const transaction = await getTransactionsAll();
      if (transaction.success && transaction.transactions) {
        setRecentTransactions(transaction.transactions);
      }
    };

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');

    if (!token || !id || !name) {
      navigate('/');
      return;
    }

    setUserData({
      id: parseInt(id, 10),
      name,
    });

    fetchData();
  }, [navigate]);

  if (!userData || !summaryData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="収入" 
              amount={summaryData.totalIncome} 
              type="income" 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="支出" 
              amount={summaryData.totalExpense} 
              type="expense" 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="残高" 
              amount={summaryData.totalIncome - summaryData.totalExpense} 
              type="balance" 
            />
          </Grid>
          <Grid item xs={12}>
            <RecentTransactionsCard transactions={recentTransactions} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Dashboard;
