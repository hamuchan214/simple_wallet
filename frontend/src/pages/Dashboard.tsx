import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactionsCard from '../components/dashboard/RecentTransactionsCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ id: number; name: string } | null>(null);

  // ダミーデータ（後でAPIから取得するように変更）
  const summaryData = {
    income: 150000,
    expense: 80000,
    balance: 70000
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'income' as const,
      amount: 50000,
      description: '給料',
      date: '2024-03-25'
    },
    {
      id: 2,
      type: 'expense' as const,
      amount: 12000,
      description: '食費',
      date: '2024-03-24'
    },
  ];

  useEffect(() => {
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
  }, [navigate]);

  if (!userData) {
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
              amount={summaryData.income} 
              type="income" 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="支出" 
              amount={summaryData.expense} 
              type="expense" 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard 
              title="残高" 
              amount={summaryData.balance} 
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
